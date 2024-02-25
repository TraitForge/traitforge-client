import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import Modal from './ForgingModal';
import '../styles/Breeding.css';
import LoadingSpinner from './Spinner'
import ForgeContractAbi from '../artifacts/contracts/BreedableToken.sol/BreedableToken.json';

const ForgeContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

const EntityList = ({ entities, onEntitySelect }) => (
  <div className="breeder-items-list">
  {entities.map((entity) => (
  <div className='card' key={entity.id} onClick={() => onEntitySelect(entity)}>
  <img className='cards-img' src={entity.image} alt={`Entity ${entity.title}`} />
  <h5>{entity.title}</h5>
  <p>Price: {entity.price} ETH</p>
  <p>{entity.gender}</p>
  <p>Nuke Factor: {entity.nukefactor}</p>
  </div>
    ))}
  </div>
);

const ProcessingModal = ({ processing, text}) => {
  if (!processing) return null;
  return (
  <div className="processing-modal">
   <div className="modal-content">
    <LoadingSpinner />
    <p>{text}</p>
    </div>
  </div>
);
}

const NFTListings = () => {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [entitiesForForging, setEntitiesForForging] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('Forging');

useEffect(() => {
  const fetchEntities = async () => {
  if (!isConnected) return;
  try {
  const provider = new ethers.providers.Web3Provider(walletProvider);
  const contract = new ethers.Contract(ForgeContractAddress, ForgeContractAbi, provider);
  const data = await contract.fetchEntitiesForForging();
        
  const entities = data.map(entity => ({
  id: entity.id.toString(),
  image: entity.image,
  title: entity.title,
  price: ethers.utils.formatEther(entity.price),
  gender: entity.gender,
  nukefactor: entity.claimshare.toNumber(),
  }));
        
  setEntitiesForForging(entities);
  } catch (error) {
  console.error("Failed to fetch entities:", error);
  }};
  fetchEntities();
},[isConnected, walletProvider]);

const getSortedEntities = () => {
  if (!sortOption) return entitiesForForging; 
  return entitiesForForging.sort((a, b) => {
  if (sortOption === 'priceLowHigh') {
  return parseFloat(a.price) - parseFloat(b.price);
  } else if (sortOption === 'priceHighLow') {
  return parseFloat(b.price) - parseFloat(a.price);
  } return 0;
 });
};

const sortedEntities = getSortedEntities();

const openEntityToForge = (entity) => {
  setSelectedEntity(entity);
};

const forgeNewEntity = async () => {
  if (!isConnected) return;
  setProcessing(true);
  setProcessingText('Forging');
  try {
  const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const forgeContract = new ethers.Contract(ForgeContractAddress, ForgeContractAbi.abi, signer);
  const transaction = await forgeContract.forgeEntity();
  await transaction.wait();

  setTimeout(() => {
  setProcessingText('Merging');
  setTimeout(() => {
  setProcessing(false);
  console.log("Process completed");
  }, 10000);
  }, 10000);
  console.log("Forged successfully");
  } catch (error) {
  console.error("Failed to fetch entities:", error);
};
}

return (
<div className='TBG-page'>
    <button className='breed-entity-button' onClick={() => setOpenModal(true)}>List Entity For Forging</button>
  {openModal && (
  <Modal open={openModal}  onClose={() => setOpenModal(false)} /> )}
     
  <div className="breed-sorting-options">
    <h1> Filter </h1>
    <select className="sorting-dropdown" onChange={(e) => setSortOption(e.target.value)}>
    <option value="">Select Sorting Option</option>
    <option value="priceLowHigh">Price: Low to High</option>
    <option value="priceHighLow">Price: High to Low</option>
    </select>
  </div>
      
  <EntityList entities={sortedEntities} openSelectEntity={openEntityToForge} />

  {selectedEntity && (
  <div className="detailed-card">
    <img src={selectedEntity.image} alt={`Entity ${selectedEntity.title}`} />
    <h5>{selectedEntity.title}</h5>
    <p>Price: {selectedEntity.price} ETH</p>
    <p>{selectedEntity.gender}</p>
    <p>Nuke Factor: {selectedEntity.nukefactor}</p>
    <button className="forge-button" onClick={() => forgeNewEntity(selectedEntity)}>Forge</button>
    <button className="close-button" onClick={() => setSelectedEntity(null)}>Close</button>
    <ProcessingModal processing={processing} text={processingText} />
  </div>
   )}
</div>
  );
};

export default NFTListings;
