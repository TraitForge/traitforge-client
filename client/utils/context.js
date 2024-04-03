import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { JsonRpcProvider } from 'ethers/providers';
import { useWeb3ModalProvider, useWeb3ModalAccount, createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import Web3Modal from 'web3modal';
import { contractsConfig } from './contractsConfig';

const AppContext = createContext();
const infuraProvider = new JsonRpcProvider(contractsConfig.infuraRPCURL);

const ContextProvider = ({ children }) => {
  const [entitiesForSale, setEntitiesForSale] = useState([]);
  const [ethAmount, setEthAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);
  const [upcomingMints, setUpcomingMints] = useState([]);
  const [entitiesForForging, setEntitiesForForging] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [entityPrice, setEntityPrice] = useState(null);
  const [walletProvider, setWalletProvider] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);


  useEffect(() => {
    const initWeb3Modal = async () => {
      const projectId = 'YOUR_PROJECT_ID';
      const mainnet = {
        chainId: 1,
        name: 'Ethereum',
        currency: 'ETH',
        explorerUrl: 'https://etherscan.io',
        rpcUrl: 'https://cloudflare-eth.com'
      };

      const metadata = {
        name: 'My Website',
        description: 'My Website description',
        url: 'https://mywebsite.com',
        icons: ['https://avatars.mywebsite.com/']
      };

      const ethersConfig = {
        metadata,
        enableEIP6963: true,
        enableInjected: true,
        enableCoinbase: true,
        rpcUrl: 'https://cloudflare-eth.com',
        defaultChainId: 1
      };

      const web3ModalInstance = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions: {},
        ethersConfig,
        projectId
      });

      setWeb3Modal(web3ModalInstance);
      return web3ModalInstance;
  };

  initWeb3Modal().then(connectWallet); // Chain the promises
}, []);
const connectWallet = async (web3ModalInstance) => {
  if (!web3ModalInstance) return;
  try {
    const connection = await web3ModalInstance.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    setWalletProvider(provider);
  } catch (error) {
    console.error('Error connecting wallet:', error);
  }
};

//Modal State Trigger
  const openModal = (content) => {
  setModalContent(content);
  setIsOpen(true);
  };
  
  const closeModal = () => {
  setIsOpen(false);
  };

//fetching/setting Price States
const fetchEthAmount = useCallback(async () => {
  try {
    const nukeFundContract = new ethers.Contract(
      contractsConfig.NukeFundAddress,
      contractsConfig.NukeFundAbi.abi,
      infuraProvider
    );
    const balance = await nukeFundContract.getFundBalance();
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error fetching ETH amount from nuke fund:', error);
    return 0;
  }
}, [infuraProvider]);

const fetchEthToUsdRate = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    return response.data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching ETH to USD rate:', error);
  }
  return 10000;
};

useEffect(() => {
  const interval = setInterval(async () => {
    const amount = await fetchEthAmount();
    const rate = await fetchEthToUsdRate();
    if (amount && rate) {
      const usdValue = amount * rate;
      setEthAmount(Number(amount).toFixed(2));
      setUsdAmount(Number(usdValue).toFixed(2));
    }
  }, 10000);

  return () => clearInterval(interval);
}, [fetchEthAmount]);


//Entity Price For Mint
useEffect(() => {
    const getLatestEntityPrice = async () => {
      if (!infuraProvider) return;
      setIsLoading(true);
      try {
        const mintContract = new ethers.Contract(
          contractsConfig.traitForgeNftAddress,
          contractsConfig.traitForgeNftAbi,
          infuraProvider
        );
        const mintPrice = await mintContract.calculateMintPrice();
        const priceInEth = ethers.utils.formatEther(mintPrice);
        setEntityPrice(priceInEth);
      } catch (error) {
        console.error('Error fetching entity price:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getLatestEntityPrice();
  }, [infuraProvider]);

  //useEffect(() => {
    const getUpcomingMints = async () => {
        if (!infuraProvider) return;
        setIsLoading(true);
        const contract = new ethers.Contract(
          contractsConfig.entropyGeneratorContractAddress, 
          contractsConfig.entropyGeneratorContractAbi, 
          infuraProvider);
        let allEntropies = [];
        for (let slotIndex = 0; slotIndex < contractsConfig.totalSlots; slotIndex++) {
            const batchPromises = [];
            for (let numberIndex = 0; numberIndex < contractsConfig.valuesPerSlot; numberIndex++) {
                batchPromises.push(contract.getPublicEntropy(slotIndex, numberIndex));
            }
            const batchResults = await Promise.allSettled(batchPromises);
            const processedBatch = batchResults.map(result => result.status === 'fulfilled' ? parseInt(result.value, 10) : 0);
            allEntropies = [...allEntropies, ...processedBatch];
        }
        const upcomingMints = allEntropies.slice(0, 150).map((entropy, index) => ({
            id: index + 1,
            entropy,
        }));
        setIsLoading(false);
        setUpcomingMints(upcomingMints);
    };
    //getUpcomingMints();
//}, []);

// Event Listener for Stats
  useEffect(() => {
    if(!infuraProvider) return;
    const loadedTransactions = localStorage.getItem('transactions');
    const initialTransactions = loadedTransactions ? JSON.parse(loadedTransactions) : [];
    setTransactions(initialTransactions);
      const mintContract = new ethers.Contract(
      contractsConfig.traitForgeNftAddress,
      contractsConfig.traitForgeNftAbi,
      infuraProvider
    );
    const nukeContract = new ethers.Contract(
      contractsConfig.nukeContractAddress,
      contractsConfig.nukeFundContractAbi,
      infuraProvider
    );

    const handleEvent = (type) => async (...args) => {
      const event = args[args.length - 1];
      const transactionHash = event.transactionHash;
      const transaction = await infuraProvider.getTransaction(transactionHash);
      const valueInEth = ethers.utils.formatEther(transaction.value);
      const newTransaction = {
        type,
        from: 'Smart Contract',
        to: args[0],
        amount: valueInEth,
        timestamp: new Date().getTime(),
        transactionHash: transactionHash,
      };
      setTransactions(prevTransactions => {
        const updatedTransactions = [newTransaction, ...prevTransactions];
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        return updatedTransactions;
      });
    };

    mintContract.on('Minted', handleEvent('Minted'));
    mintContract.on('Entitybred', handleEvent('Entitybred'));
    nukeContract.on('Nuked', handleEvent('Nuked'));

    return () => {
      mintContract.off('Minted', handleEvent('Minted'));
      mintContract.off('Entitybred', handleEvent('Entitybred'));
      nukeContract.off('Nuked', handleEvent('Nuked'));
    };
  }, [infuraProvider]);

// Fetch Entities From Wallet
const getOwnersEntities = async (address, walletProvider) => {
    if (!walletProvider || !address) return [];
    const provider = new ethers.providers.Web3Provider(walletProvider);
    const TraitForgeContract = new ethers.Contract(
      contractsConfig.traitForgeNftAddress,
      contractsConfig.traitForgeNftAbi,
      provider
    );
  
    try {
      const balance = await TraitForgeContract.balanceOf(address);
      let fetchedEntities = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await TraitForgeContract.tokenOfOwnerByIndex(address, i);
        const tokenURI = await TraitForgeContract.tokenURI(tokenId);
        fetchedEntities.push({ tokenId: tokenId.toString(), tokenURI });
      }
  
      return fetchedEntities;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return [];
    }
  };

// Entities Listed in Trading Contract
const getEntitiesForSale = async () => {
  if (!infuraProvider) return;
    try {
      const tradeContract = new ethers.Contract(
        contractsConfig.tradeContractAddress,
        contractsConfig.tradeContractAbi,
        infuraProvider
      );
      const entropyContract = new ethers.Contract(
        contractsConfig.entropyContractAddress,
        contractsConfig.entropyContractAbi,
        infuraProvider
      );
      const data = await tradeContract.fetchEntitiesForSale();

      const entitiesPromises = data.map(async (entity) => {
        const [nukeFactor, breedPotential, performanceFactor, isSire] = await entropyContract.deriveTokenParameters(entity);

        return {
          entity,
          nukeFactor: nukeFactor.toString(),
          breedPotential: breedPotential.toString(),
          performanceFactor: performanceFactor.toString(),
          isSire: isSire,
          price: ethers.utils.formatEther(entity.price),
        };
      });

      const entities = await Promise.all(entitiesPromises);
      setEntitiesForSale(entities);
    } catch (error) {
      console.error("Failed to fetch entities for sale:", error);
    }
  };

// Entities Listed in Forging/Merging Contract
const getEntitiesForForging = async () => {
  if (!infuraProvider) return;
    try {
      const contract = new ethers.Contract(
        contractsConfig.forgeContractAddress,
        contractsConfig.forgeContractAbi,
        infuraProvider
      );
      const data = await contract.getAllEntitiesForMerging();
      const forgingListings = data.map(async entity => {
        const [nukeFactor, breedPotential, performanceFactor, isSire] =
          await contract.deriveTokenParameters(entity);
        return {
          entity,
          nukeFactor: nukeFactor.toString(),
          breedPotential: breedPotential.toString(),
          performanceFactor: performanceFactor.toString(),
          isSire: isSire,
          price: ethers.utils.formatEther(entity.price),
        };
      });
      const entities = await Promise.all(forgingListings);
      setEntitiesForForging(entities);
    } catch (error) {
      console.error('Failed to fetch entities for forging:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isOpen,
        modalContent,
        ethAmount,
        usdAmount,
        entityPrice,
        isLoading,
        entitiesForForging,
        entitiesForSale,
        transactions,
        walletProvider, 
        infuraProvider,
        web3Modal,
        upcomingMints,
        openModal,
        closeModal,
        connectWallet,
        getEntitiesForSale,
        getOwnersEntities,
        getEntitiesForForging,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useContextState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useContext must be used within a ContextProvider');
  }
  return context;
};

export { useContextState, ContextProvider };
