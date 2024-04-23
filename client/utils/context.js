import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

import { JsonRpcProvider } from 'ethers/providers';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { contractsConfig } from './contractsConfig';

const AppContext = createContext();
const infuraProvider = new JsonRpcProvider(contractsConfig.infuraRPCURL);

const ContextProvider = ({ children }) => {
  const [ethAmount, setEthAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [entityPrice, setEntityPrice] = useState(null);
  const [ownerEntities, setOwnerEntities] = useState([]);
  const [address, setAddress] = useState('');

  const { walletProvider } = useWeb3ModalProvider();

  //fetching/setting Price States
  const fetchEthAmount = useCallback(async () => {
    if (!infuraProvider) return;
    try {
      const nukeFundContract = new ethers.Contract(
        contractsConfig.nukeContractAddress,
        contractsConfig.nukeFundContractAbi,
        infuraProvider
      );
      const balance = await nukeFundContract.getFundBalance();
      return ethers.formatEther(balance);
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
    return null;
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const amount = await fetchEthAmount();
      const rate = await fetchEthToUsdRate();
      if (amount && rate) {
        const usdValue = amount * rate;
        setEthAmount(Number(amount).toFixed(5));
        setUsdAmount(Number(usdValue).toFixed(5));
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
        const priceInEth = ethers.formatEther(mintPrice);
        setEntityPrice(priceInEth);
      } catch (error) {
        console.error('Error fetching entity price:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getLatestEntityPrice();
  }, []);

  const getOwnersEntities = useCallback(async () => {
    if (!walletProvider) {
        console.log('Wallet provider is not set.');
        setOwnerEntities([]);
        return;
    }
    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
        const TraitForgeContract = new ethers.Contract(
          contractsConfig.traitForgeNftAddress,
          contractsConfig.traitForgeNftAbi,
          ethersProvider
      );
        const balance = await TraitForgeContract.balanceOf(address);
        const fetchPromises = [];
        console.log(`Balance for address ${address}: ${balance}`);

        for (let i = 0; i < balance; i++) {
            fetchPromises.push(
                (async () => {
                    const tokenId = await TraitForgeContract.tokenOfOwnerByIndex(address, i);
                    const entropy = await TraitForgeContract.getTokenEntropy(tokenId);
                    console.log(tokenId, entropy);
                    return { tokenId: tokenId.toString(), entropy };
                })()
            );
        }

        const entities = await Promise.all(fetchPromises);
        setOwnerEntities(entities);
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        setOwnerEntities([]);
    }
}, [walletProvider, address]);

  // Event Listener for Stats
  //const subscribeToMintEvent = () => {
  //if (!infuraProvider) return;
  //
  //  const mintContract = new ethers.Contract(
  //    contractsConfig.traitForgeNftAddress,
  //    contractsConfig.traitForgeNftAbi,
  //    infuraProvider
  //  );
  //  const nukeContract = new ethers.Contract(
  //    contractsConfig.nukeContractAddress,
  //    contractsConfig.nukeFundContractAbi,
  //    infuraProvider
  //  );
  //
  //  const handleEvent = (type) => async (...args) => {
  //    const event = args[args.length - 1];
  //    const transactionHash = event.transactionHash;
  //    const transaction = await infuraProvider.getTransaction(transactionHash);
  //    const valueInEth = ethers.utils.formatEther(transaction.value);
  //    const newTransaction = {
  //      type,
  //      from: 'Smart Contract',
  //      to: args[0],
  //      amount: valueInEth,
  //      timestamp: new Date().getTime(),
  //      transactionHash,
  //    };
  //    setTransactions(prevTransactions => {
  //    const updatedTransactions = [newTransaction, ...prevTransactions];
  //    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  //    return updatedTransactions;
  //    });
  //  };
  //
  //  mintContract.on('Minted', handleEvent('Minted'));
  //  mintContract.on('Entitybred', handleEvent('Entitybred'));
  //  nukeContract.on('Nuked', handleEvent('Nuked'));
  //
  //  return () => {
  //  mintContract.off('Minted', handleEvent('Minted'));
  //  mintContract.off('Entitybred', handleEvent('Entitybred'));
  //  nukeContract.off('Nuked', handleEvent('Nuked'));
  //  };
  //};
  //
  //useEffect(() => {
  // Subscribe to mint events
  //const unsubscribe = subscribeToMintEvent();
  // return () => {
  //   unsubscribe();
  //};
  //}, [infuraProvider]);

  return (
    <AppContext.Provider
      value={{
        ethAmount,
        address,
        usdAmount,
        entityPrice,
        isLoading,
        transactions,
        infuraProvider,
        ownerEntities,
        //subscribeToMintEvent,
        setIsLoading,
        getOwnersEntities
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
