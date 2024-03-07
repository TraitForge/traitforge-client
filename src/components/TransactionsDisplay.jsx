import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MintContractAbi from '../artifacts/contracts/EntityMerging.sol/EntityMerging.json';
import NukeContractAbi from '../artifacts/contracts/NukeFund.sol/NukeFund.json';

const MintContractAddress = '0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2';
const NukeContractAddress = '0xD8a5a9b31c3C0232E196d518E89Fd8bF83AcAd43';

const defaultProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

const TransactionsDisplay = () => {
  const [transactions, setTransactions] = useState([]);

useEffect(() => {
  const loadedTransactions = localStorage.getItem('transactions');
  const initialTransactions = loadedTransactions ? JSON.parse(loadedTransactions) : [];
  setTransactions(initialTransactions);
  const provider = defaultProvider;
  const mintContract = new ethers.Contract(MintContractAddress, MintContractAbi.abi, provider);
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
  })};
  mintContract.on('Minted', handleEvent("Minted"));
  mintContract.on('Entitybred', handleEvent("Entitybred"));
  nukeContract.on('Nuked', handleEvent("Nuked")); 
  return () => { 
   mintContract.off('Minted', handleEvent("Minted")); 
   mintContract.off('Entitybred', handleEvent("Entitybred")); 
   nukeContract.off('Nuked', handleEvent("Nuked"));
}}, []); 


return (
<div className="transactions-container">
   <h1 className='transactions-header'> Activity </h1>

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
)};

export default TransactionsDisplay;
