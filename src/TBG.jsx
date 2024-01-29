import React, { useState, useEffect } from 'react';
import Modal from './TBGmodal';
import Entities from './Entity-data'; 
import './TBG.css';

const ItemList = ({ items }) => (
  <div className="breeder-items-list">
    {items.map((item) => (
      <div className='card' key={item.id}>
        <img className='cards-img' src={item.image} alt={`Entity ${item.title}`} />
        <h5>{item.title}</h5>
        <p>Price: {item.price} ETH</p>
        <p>Claimshare {item.claimshare}</p>
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
      <ItemList items={listedEntities} />
    </div>
  );
};

export default NFTListings;

