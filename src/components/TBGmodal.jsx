import React, { useState } from 'react';
import { useEntities } from '../graph-data/EntitiesContext';
import '../styles/TBGmodal.css';

const Modal = ({ open, onClose, onSave, listedIds, entities }) => {
    const [price, setPrice] = useState('');
    const [selectedEntity, setSelectedEntity] = useState(null);

    const {entitiesFromWallet} = useEntities();

  const EntityCard = ({ entity, onSelect, isSelected }) => (
    <div className={`entity-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(entity)}>
      <img src={entity.image} alt={entity.title} />
      <h3>{entity.title}</h3>
      <p>{entity.gender}</p>
      <p>Claimshare: {entity.claimshare}</p>
    </div>
  );

  const handleEntitySelection = (entity) => {
    setSelectedEntity(entity);
  };

  const handleSave = () => {
    if (!selectedEntity) {
      alert('Please select an Entity.');
      return;
    }

    if (selectedEntity.gender !== 'Sire') {
      alert('Only Sires can be listed for breeding, and breeders are not allowed.');
      return;
    }

    onSave({
      ...selectedEntity,
      id: Math.random().toString(36).substr(2, 9), 
      price: parseFloat(price) || 0,
    });

    setPrice('');
    setSelectedEntity(null);
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
            {entitiesFromWallet.filter(entity => !listedIds.includes(entity.id) && entity.gender === 'Sire').map(entity => (
              <EntityCard 
                key={entity.id} 
                entity={entity} 
                onSelect={handleEntitySelection} 
                isSelected={selectedEntity && entity.id === selectedEntity.id}
              />
            ))}
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


