import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import Modal from './BreedingModal';
import '../styles/Breeding.css';
import BreedContractAbi from '../artifacts/contracts/BreedableToken.sol/BreedableToken.json';

const BreedContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

const EntityList = ({ entities }) => (
  <div className="breeder-items-list">
    {entities.map((entity) => (
      <div className='card' key={entity.id}>
        <img className='cards-img' src={entity.image} alt={`Entity ${entity.title}`} />
        <h5>{entity.title}</h5>
        <p>Price: {entity.price} ETH</p>
        <p>{entity.gender}</p>
        <p>Nuke Factor: {entity.nukefactor}</p>
      </div>
    ))}
  </div>
);

const NFTListings = () => {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [entitiesForBreed, setEntitiesForBreed] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const fetchEntities = async () => {
      if (!isConnected) return;

      try {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const contract = new ethers.Contract(BreedContractAddress, BreedContractAbi, provider);
        
        const data = await contract.fetchEntitiesForBreed();
        
        const entities = data.map(entity => ({
          id: entity.id.toString(),
          image: entity.image,
          title: entity.title,
          price: ethers.utils.formatEther(entity.price),
          gender: entity.gender,
          nukefactor: entity.claimshare.toNumber(),
        }));
        
        setEntitiesForBreed(entities);
      } catch (error) {
        console.error("Failed to fetch entities:", error);
      }
    };

    fetchEntities();
  }, [isConnected, walletProvider]);

  // Sorting logic
  const getSortedEntities = () => {
    if (!sortOption) return entitiesForBreed; 
    return entitiesForBreed.sort((a, b) => {
      if (sortOption === 'priceLowHigh') {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (sortOption === 'priceHighLow') {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      return 0;
    });
  };

  const sortedEntities = getSortedEntities();

  return (
    <div className='TBG-page'>
      <button className='breed-entity-button' onClick={() => setOpenModal(true)}>List Entity For Breeding</button>
      {openModal && (
        <Modal open={openModal}  onClose={() => setOpenModal(false)} onSave={(entity) => console.log('Save functionality to be implemented')} entities={entitiesForBreed} /> )}
     
      <div className="breed-sorting-options">
        <h1> Filter </h1>
        <select className="sorting-dropdown" onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Select Sorting Option</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
        </select>
      </div>
      <EntityList entities={sortedEntities} />
    </div>
  );
};

export default NFTListings;
