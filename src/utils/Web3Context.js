import React, { createContext, useState } from 'react';

export const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [userWallet, setUserWallet] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserWallet(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('MetaMask is not installed');
    }
  };

  return (
    <Web3Context.Provider value={{ userWallet, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

