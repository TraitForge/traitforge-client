import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MintContractAbi from '../artifacts/contracts/Mint.sol/Mint.json';
import BreedContractAbi from '../artifacts/contracts/BreedableToken.sol/BreedableToken.json';
import NukeContractAbi from '../artifacts/contracts/NukeFund.sol/NukeFund.json';

const MintContractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
const BreedContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const NukeContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

const defaultProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

const TransactionsDisplay = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
      const loadedTransactions = localStorage.getItem('transactions');
      const initialTransactions = loadedTransactions ? JSON.parse(loadedTransactions) : [];
      setTransactions(initialTransactions);

      const provider = defaultProvider;
      const mintContract = new ethers.Contract(MintContractAddress, MintContractAbi.abi, provider);
      const breedContract = new ethers.Contract(BreedContractAddress, BreedContractAbi.abi, provider);
      const nukeContract = new ethers.Contract(NukeContractAddress, NukeContractAbi.abi, provider);
  
      const handleEvent = (type) => async (...args) => {
        const event = args[args.length - 1];
        const transactionHash = event.transactionHash;
        const transaction = await defaultProvider.getTransaction(transactionHash);
        const valueInEth = ethers.utils.formatEther(transaction.value); 
        const newTransaction = {
          type,
          from: "Smart Contract",
          to: args[0], 
          amount: valueInEth,
          timestamp: new Date().getTime(),
          transactionHash: transactionHash,
        };
        setTransactions((prevTransactions) => {
            const updatedTransactions = [newTransaction, ...prevTransactions];
            localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
            return updatedTransactions;
          });
      };
  
       mintContract.on('MintEvent', handleEvent("MintEvent"));
       breedContract.on('TokenBred', handleEvent("TokenBred"));
       nukeContract.on('Nuked', handleEvent("Nuked")); 
       
       return () => { 
       mintContract.off('MintEvent', handleEvent("MintEvent")); 
       breedContract.off('TokenBred', handleEvent("TokenBred")); 
       nukeContract.off('Nuked', handleEvent("Nuked"));
      };
    }, []); 
  
    return (
      <div className="transactions-container">
        <h1 className='transactions-header'>
            Activity
        </h1>
        {transactions.length > 0 ? (
          transactions.map((tx, index) => (
            <div key={index} className="transaction">
              <p>Type: {tx.type}</p>
              <p>From: {tx.from}</p>
              <p>To: {tx.to || "N/A"}</p>
              <p>Amount: {tx.amount || "N/A"}</p>
              <p>Token ID: {tx.tokenId || "N/A"}</p>
              <p>Parent IDs: {tx.parentIds ? tx.parentIds.join(", ") : "N/A"}</p>
              <p>Time: {new Date(tx.timestamp).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No transactions have occurred.</p>
        )}
      </div>
    );
};

export default TransactionsDisplay;
