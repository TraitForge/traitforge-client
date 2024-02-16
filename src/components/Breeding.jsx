import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import Modal from './BreedingModal';
import '../styles/Breeding.css';
import BreedContractAbi from '../artifacts/contracts/BreedableToken.sol/BreedableToken.json';

const BreedContractAddress = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';



const EntityList = ({ entities }) => (
  <div className="breeder-items-list">
    {entities.map((entity) => (
      <div className='card' key={entity.id}>
        <img className='cards-img' src={entity.image} alt={`Entity ${entity.title}`} />
        <h5>{entity.title}</h5>
        <p>Price: {entity.price} ETH</p>
        <p>{entity.gender}</p>
        <p>Claimshare: {entity.claimshare}</p>
      </div>
    ))}
  </div>
);

const NFTListings = () => {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [entitiesForBreed, setEntitiesForBreed] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  

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
          claimshare: entity.claimshare.toNumber(),
        }));
        
        setEntitiesForBreed(entities);
      } catch (error) {
        console.error("Failed to fetch entities:", error);
      }
    };

    fetchEntities();
  }, [isConnected, walletProvider]);

  return (
    <div className='TBG-page'>
      <button className='breed-entity-button' onClick={() => setOpenModal(true)}>List Entity For Breeding</button>
      {openModal && (
        <Modal 
          open={openModal} 
          onClose={() => setOpenModal(false)} 
          onSave={(entity) => console.log('Save functionality to be implemented')} 
          entities={entitiesForBreed} 
        />
      )}
      <EntityList entities={entitiesForBreed} />
    </div>
  );
};

export default NFTListings;
