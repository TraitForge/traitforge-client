import React, { useState, useEffect} from 'react';
import Modal from './BreedingModal';
import { useEntities } from '../graph-data/EntitiesContext'; 
import '../styles/TBG.css';

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
  const [openModal, setOpenModal] = useState(false);
  const { entitiesForSale } = useEntities; 

  useEffect(() => {
  }, []);

  return (
    <div className='TBG-page'>
      <button className='breed-entity-button' onClick={() => setOpenModal(true)}>List Entity For Sale</button>
      {openModal && (
        <Modal 
          open={openModal} 
          onClose={() => setOpenModal(false)} 
          onSave={(entity) => console.log('Save functionality to be implemented')} 
          entities={entitiesForSale} 
        />
      )}
      <EntityList entities={entitiesForSale} />
    </div>
  );
};

export default NFTListings;

