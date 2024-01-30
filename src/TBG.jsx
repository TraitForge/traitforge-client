import React, { useState, useEffect } from 'react';
import Modal from './TBGmodal';
import Entities from './Entity-data'; 
import './TBG.css';

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
  const [listedEntities, setListedEntities] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleSaveListing = (entity) => {
    if (entity) {
      setListedEntities([...listedEntities, entity]);
    }
    setOpenModal(false);
  };

  useEffect(() => {
    // This effect could be used for initial data loading if necessary
  }, []);

  return (
    <div className='TBG-page'>
      <button className='breed-entity-button' onClick={() => setOpenModal(true)}>List For Breeding</button>
      {openModal && (
        <Modal 
          open={openModal} 
          onClose={() => setOpenModal(false)} 
          onSave={handleSaveListing}
          listedIds={listedEntities.map(e => e.id)}
          entities={Entities}
        />
      )}
      <EntityList entities={listedEntities} />
    </div>
  );
};

export default NFTListings;
