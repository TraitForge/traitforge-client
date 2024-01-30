import React, { createContext, useState, useContext } from 'react';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [userWallet, setUserWallet] = useState(null);

  return (
    <Web3Context.Provider value={{ userWallet, setUserWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
