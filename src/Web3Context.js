import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';


export const Web3Provider = ({ children }) => {
  const [userWallet, setUserWallet] = useState(null);

  useEffect(() => {
  
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "YOUR_INFURA_ID" 
        }
      },

    };

    const web3Modal = new Web3Modal({
      network: "mainnet", 
      cacheProvider: true,
      providerOptions
    });

    if (web3Modal.cachedProvider) {
      connectWallet();
    }

    async function connectWallet() {
      try {
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);

        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setUserWallet(accounts[0]);
        }

        provider.on("connect", (info) => console.log(info));
        provider.on("disconnect", (error) => console.log(error));
      } catch (error) {
        console.error('Error connecting to wallet', error);
      }
    }

    window.connectWallet = connectWallet; // Optional: for easy access to connect wallet function
  }, []);

  const connectWalletHandler = () => {
    window.connectWallet && window.connectWallet();
  };

  const value = { userWallet, connectWalletHandler };

  return <Web3Provider value={value}>{children}</Web3Provider>;
};

