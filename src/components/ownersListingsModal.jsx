import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import tradeContractAbi from ''; 
import forgeContractAbi from ''; 

const tradeContractAddress = '';
const forgeContractAddress = '';

const OwnersListingsModal = ({ open, onClose }) => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [error, setError] = useState('');

const fetchListings = useCallback(async (contractAddress, contractAbi) => {
  if (!isConnected || !address) {
  alert("Wallet not connected");
  console.log("Wallet not connected or address not found");
  return;
  }
  try {
  const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
  const signer = ethersProvider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
  const balance = await contract.ownerListedEntities(address);
  let tokenIds = [];
  for (let index = 0; index < balance.toNumber(); index++) {
  const tokenId = await contract.tokenOfOwnerByIndex(address, index);
  tokenIds.push(tokenId.toString());
  }
  return tokenIds.map(id => ({ id, source: contractAddress === tradeContractAddress ? 'trade' : 'forge' }));
  } catch (error) {
  console.error('Could not retrieve listings:', error);
  setError('Failed to fetch listings');
  return [];
  }
}, [address, isConnected, walletProvider]);

const fetchUserListings = useCallback(async () => {
  const tradeListings = await fetchListings(tradeContractAddress, tradeContractAbi);
  const forgeListings = await fetchListings(forgeContractAddress, forgeContractAbi);
  setEntities([...tradeListings, ...forgeListings]);
}, [fetchListings]);

useEffect(() => {
  if (open) {
  fetchUserListings();
  }
}, [open, fetchUserListings]);


const unlistEntity = useCallback(async() => {
  if (!isConnected || !selectedEntity) {
  alert("Wallet not connected");
  console.log("Wallet not connected or address not found");
  return;
  }
  try {
  const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
  const signer = ethersProvider.getSigner();
  const tradeContract = new ethers.Contract(tradeContractAddress, tradeContractAbi.abi, signer);
  const unlist = await tradeContract.unlistEntity(selectedEntity);
  await unlist.wait();
  fetchUserListings();
  setSelectedEntity(null);
  } catch (error) {
  console.error('Failed to unlist:', error);
  setError('Failed to unlist');
  }
}, [isConnected, walletProvider, selectedEntity, fetchUserListings]);

  if (!open) return null;

return (
  <div className='overlay'>
    <button className='closeBtn' onClick={onClose}>x</button>
    <div className='modalContainer'>
    <header>Unlist an Entity</header>
    <div className='unlist-display-container'>
    {entities.length > 0 ? (entities.map(entity => (
    <div key={entity.id} className={`nfts-item ${selectedEntity === entity.id ? 'selected' : ''}`} onClick={() => setSelectedEntity(entity.id)}>
      <img src={entity.image} alt={entity.id} /> 
    </div>
))
) : (<p>You have no entities listed.</p>)}
   </div>
  {selectedEntity && ( <button className="unlist-button" onClick={() => unlistEntity(selectedEntity)}>Unlist</button>
)}
  </div>
  </div>
)};

export default OwnersListingsModal;
