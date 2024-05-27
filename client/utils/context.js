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
import {
  getEntitiesHook,
  getUpcomingMintsHook,
  getEntitiesForSaleHook,
  getOwnersEntitiesHook,
  getEntityEntropyHook,
  getCurrentGenerationHook,
  calculateNukeFactor,
  getEntityGeneration,
  calculateEntityAttributes,
} from './utils';
import { get } from 'jquery';

const AppContext = createContext();
const infuraProvider = new JsonRpcProvider(contractsConfig.infuraRPCURL);

const ContextProvider = ({ children }) => {
  const [ethAmount, setEthAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);
  const [entitiesListedByUser, setEntitiesListedByUser] = useState([])
  const [currentGeneration, setCurrentGeneration] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [entityPrice, setEntityPrice] = useState(null);
  const [entityEntropy, setEntityEntropy] = useState('');
  const [ownerEntities, setOwnerEntities] = useState([]);
  const [address, setAddress] = useState('');
  const [entitiesForSale, setEntitiesForSale] = useState([]);
  const [upcomingMints, setUpcomingMints] = useState([]);
  const [entitiesForForging, setEntitiesForForging] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const { walletProvider } = useWeb3ModalProvider();

  const getUpcomingMints = async (startSlot = 0, startNumberIndex = 0) => {
    if (!infuraProvider) return;
    setIsLoading(true);
    const { allEntropies, maxCount } = await getUpcomingMintsHook(
      startSlot,
      startNumberIndex,
      infuraProvider
    );

    setUpcomingMints(
      allEntropies.slice(0, maxCount).map((entropy, index) => ({
        id: startSlot * 13 + index + 1,
        entropy,
      }))
    );
    setIsLoading(false);
  };

  const getEntitiesForSale = useCallback(async () => {
    if (!infuraProvider || !walletProvider) return;

    try {
      const entitiesForSale = await getEntitiesForSaleHook(infuraProvider);
      const enrichedEntitiesForSale = await Promise.all(entitiesForSale.map(async (entity) => {
        const { tokenId, seller, price } = entity;
        const nukeFactor = await calculateNukeFactor(walletProvider, tokenId);
        const generation = await getEntityGeneration(walletProvider, tokenId);
        const entropy = await getEntityEntropyHook(walletProvider, tokenId);
        const paddedEntropy = entropy.toString().padStart(6, '0');
        const { role, forgePotential, performanceFactor } = calculateEntityAttributes(paddedEntropy);
        return {
          tokenId,
          seller,
          price,
          nukeFactor,
          generation,
          paddedEntropy,
          role,
          forgePotential,
          performanceFactor,
        };
      }));
      setEntitiesForSale(enrichedEntitiesForSale);
    } catch (error) {
      console.error('Failed to fetch entities for sale:', error);
      setEntitiesForSale([]);
    }
  }, [infuraProvider]);

  const getEntitiesForForging = useCallback(async () => {
    if (!infuraProvider) return;

    try {
      const entitiesForForging = await getEntitiesHook(infuraProvider);
      const enrichedEntitiesForForging = await Promise.all(entitiesForForging.map(async (entity) => {
        const { tokenId, seller, price } = entity;
        const nukeFactor = await calculateNukeFactor(walletProvider, tokenId);
        const generation = await getEntityGeneration(walletProvider, tokenId);
        const entropy = await getEntityEntropyHook(walletProvider, tokenId);
        const paddedEntropy = entropy.toString().padStart(6, '0');
        const { role, forgePotential, performanceFactor } = calculateEntityAttributes(paddedEntropy);
        return {
          tokenId,
          price,
          nukeFactor,
          seller,
          generation,
          paddedEntropy,
          role,
          forgePotential,
          performanceFactor,
        };
      }));
      setEntitiesForForging(enrichedEntitiesForForging);
    } catch (error) {
      console.error('Failed to fetch entities for forging:', error);
      setEntitiesForForging([]);
    }
  }, [infuraProvider]);
  

  const getCurrentGeneration = async () => {
    if (!infuraProvider) return;

    try {
      const generation = await getCurrentGenerationHook(infuraProvider);
      setCurrentGeneration(generation);
      console.log('Current Generation:', generation);
    } catch (error) {
      console.error('Failed to fetch current generation:', error);
    }
  };

  const getEntityEntropy = async (listing) => {
    if(!walletProvider) return;
    try {
      const entityEntropy = await getEntityEntropyHook(walletProvider, listing);
      setEntityEntropy(entityEntropy);
    } catch (error) {
      console.error("Error fetching entity entropy:", error);
    }
  };

  const getOwnersEntities = useCallback(async () => {
    if (!walletProvider) {
      alert('Please connect your wallet first.');
      setOwnerEntities([]);
      return;
    }
    try {
      const entities = await getOwnersEntitiesHook(walletProvider);
      const enrichedEntities = await Promise.all(entities.map(async (tokenId) => {
        const nukeFactor = await calculateNukeFactor(walletProvider, tokenId);
        const generation = await getEntityGeneration(walletProvider, tokenId);
        const entropy = await getEntityEntropyHook(walletProvider, tokenId);
        const paddedEntropy = entropy.toString().padStart(6, '0');
        const { role, forgePotential, performanceFactor } = calculateEntityAttributes(paddedEntropy);
        return {
          tokenId,
          nukeFactor,
          generation,
          paddedEntropy,
          role,
          forgePotential,
          performanceFactor,
        };
      }));
      setOwnerEntities(enrichedEntities);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setOwnerEntities([]);
    }
  }, [walletProvider]);
  

  useEffect(() => {
    setIsLoading(true);
    getOwnersEntities();
    getEntitiesForSale();
    getEntitiesForForging();
    getCurrentGeneration();
    getEntitiesListedByPlayer();
    setIsLoading(false);
  }, [walletProvider]);

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
        'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=USD'
      );
      return response.data.ETH.USD;
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
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchEthAmount, fetchEthToUsdRate]);

  useEffect(() => {
    const getLatestEntityPrice = async () => {
      if (!infuraProvider) return;
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
      }
    };
  
    getLatestEntityPrice();
  
    const intervalId = setInterval(() => {
      getLatestEntityPrice();
    }, 6000);
  
    return () => clearInterval(intervalId); 
  }, []);
  
  useEffect(() => {
    if (entityPrice) {
      const priceToIndex = Math.floor(entityPrice * 100);
      const startSlot = Math.floor(priceToIndex / 13);
      const startNumberIndex = priceToIndex % 13;
      getUpcomingMints(startSlot, startNumberIndex);
    }
  }, [entityPrice]);

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

  const getEntitiesListedByPlayer = async () => {
    if (!walletProvider) {
      console.error('No wallet provider found.');
      return;
    }
  
    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
  
      const listedEntities = entitiesForSale
        .filter(entity => entity.seller === address)
        .map(entity => ({
          tokenId: entity.tokenId,
          seller: entity.seller,
          price: entity.price,
          nukeFactor: entity.nukeFactor,
          generation: entity.generation,
          paddedEntropy: entity.paddedEntropy,
          role: entity.role,
          forgePotential: entity.forgePotential,
          performanceFactor: entity.performanceFactor,
        }));
  
      const forgingEntities = entitiesForForging
        .filter(entity => entity.seller === address)
        .map(entity => ({
          tokenId: entity.tokenId,
          seller: entity.seller,
          price: entity.price,
          nukeFactor: entity.nukeFactor,
          generation: entity.generation,
          paddedEntropy: entity.paddedEntropy,
          role: entity.role,
          forgePotential: entity.forgePotential,
          performanceFactor: entity.performanceFactor,
        }));
  
      const combinedListedEntities = [...listedEntities, ...forgingEntities];
  
      console.log("Entities listed by player:", combinedListedEntities);
      setEntitiesListedByUser(combinedListedEntities);
    } catch (error) {
      console.error('Failed to fetch entities listed by player:', error);
    }
  };
  
  


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
        walletProvider,
        ownerEntities,
        setIsLoading,
        getOwnersEntities,
        getCurrentGeneration,
        upcomingMints,
        currentGeneration,
        getUpcomingMints,
        entitiesForForging,
        getEntitiesForForging,
        getEntitiesListedByPlayer,
        entitiesListedByUser,
        entitiesForSale,
        getEntityEntropy,
        entityEntropy,
        getEntitiesForSale,
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
