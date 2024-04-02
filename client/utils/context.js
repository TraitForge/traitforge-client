import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { useWeb3ModalProvider, useWeb3ModalAccount, createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { contractsConfig } from './contractsConfig';

const AppContext = createContext();
const infuraProvider = new JsonRpcProvider('https://sepolia.infura.io/v3/bc15b785e15745beaaea0b9c42ae34fa');

const ContextProvider = ({ children }) => {
  const [entitiesForSale, setEntitiesForSale] = useState([]);
  const [upcomingMints, setUpcomingMints] = useState([]);
  const [entitiesForForging, setEntitiesForForging] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [entityPrice, setEntityPrice] = useState(null);
  const [walletProvider, setWalletProvider] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);

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
    };

    initWeb3Modal();
  }, []);

  useEffect(() => {
    if (!web3Modal) return;

    const connectWallet = async () => {
      const connection = await web3Modal.connect();
      const walletProvider = new ethers.providers.Web3Provider(connection);
      setWalletProvider(walletProvider);
    };

    connectWallet();
  }, [web3Modal]);

//Entity Price For Mint
useEffect(() => {
    const getLatestEntityPrice = async () => {
      if (!infuraProvider) return;
      setIsLoading(true);
      try {
        const mintContract = new ethers.Contract(
          contractsConfig.mintAddress,
          contractsConfig.mintAbi,
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

  useEffect(() => {
    const getUpcomingMints = async () => {
        if (!infuraProvider) return;
        setIsLoading(true);
        const contract = new ethers.Contract(
          contractsConfig.entropyGeneratorContractAddress, 
          contractsConfig.entropyGeneratorContractAbi, 
          infuraProvider);
        let allEntropies = [];
        for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
            const batchPromises = [];
            for (let numberIndex = 0; numberIndex < valuesPerSlot; numberIndex++) {
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
    getUpcomingMints();
}, []);

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
      const transaction = await defaultProvider.getTransaction(transactionHash);
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
        entityPrice,
        isLoading,
        entitiesForForging,
        entitiesForSale,
        transactions,
        walletProvider, 
        web3Modal,
        upcomingMints,
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