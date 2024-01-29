import React, { useState } from 'react';
import Entities from './Entity-data';
import './TBGmodal.css';


const Modal = ({ open, onClose, onSave, listedIds }) => {
  const [price, setPrice] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [listedEntities, setListedEntities] = useState(new Set());

  const EntityCard = ({ entity, onSelect, isSelected }) => (
    <div className={`entity-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(entity)}>
      <img src={entity.image} alt={entity.title} />
      <h3>{entity.title}</h3>
      <p>{entity.gender}</p>
      <p>{entity.claimshare}</p>
    </div>
  );

  const handleEntitySelection = (entity) => {
      setSelectedEntity(entity);
  };

  const handleSave = () => {
    if (selectedEntity && selectedEntity.gender !== 'Sire') {
      alert('Only Sires can be listed for breeding.');
      setListedEntities(new Set([...listedEntities, selectedEntity.id]));
      return;
    }

    onSave(selectedEntity);
    onClose(); 
  };

  if (!open) return null;

 
  return (
    <div className='breeding-overlay'>
      <button onClick={onClose} className="breeding-close-btn">x</button>
      <div className='breeding-modalContainer'>
        <div className='breeding-modalHeader'>
          <h5>List Your Entity for Breeding</h5>
        </div>
        <div className='breeding-modalBody'>
        <div className="entity-cards-container">
        {Entities.filter(entity => !listedIds.includes(entity.id)).map(entity => (
          <EntityCard key={entity.id} entity={entity} onSelect={handleEntitySelection} isSelected={selectedEntity && entity.id === selectedEntity.id}/>       ))}
        </div>
          <input className='price-tab' type="number" placeholder="Price in ETH" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className='breeding-modalFooter'>
          <button onClick={handleSave}>List for Breeding</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

