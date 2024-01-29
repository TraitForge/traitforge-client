import React, { useState, useEffect } from 'react';
import importedNfts from './Entity-data'; 
import './buysellModal.css';

const Modal = ({ open, onClose, onSave }) => {
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [price, setPrice] = useState('');
  const [isListed,setIsListed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchUserNFTs();
      setIsListed(false);
    } else {
      setPrice('');
    }
  }, [open]);

  const fetchUserNFTs = () => {
    setNfts(importedNfts);
    setSelectedNFT(importedNfts.length > 0 ? importedNfts[0].id : null);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    setError('')
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
  
    if (!price) {
      setError('Please enter a price');
      setTimeout(()=> setError(''), 3000);
      return;
    }
  
    const selectedNFTData = nfts.find(nft => nft.id === selectedNFT);
    if (selectedNFTData) {
      onSave({ ...selectedNFTData, price: parseFloat(price) });
      setIsListed(true);
      setTimeout(() => setIsListed(false), 3000);
      onClose();
    } else {
      setError('Please select an NFT to list.');
    }
  };

  if (!open) return null;

  return (
    <div className='overlay'>
      <button className='closeBtn' onClick={onClose} > x </button>
      <div className='modalContainer'>
        <header> List Your Entity for Sale </header>
        <div className='nfts-display-container'>
          {nfts.map(nft => (
            <div 
              key={nft.id} 
              className={`nfts-item ${selectedNFT === nft.id ? 'selected' : ''}`} 
              onClick={() => setSelectedNFT(nft.id)}
            >
              <img src={nft.image} alt={nft.name} />
              <p>{nft.name}</p>
              <p>{nft.claimshare}</p>
              <p>{nft.gender}</p>
            </div>
          ))}
        </div>
        <div className='btnContainer'>
          <form onSubmit={handleSubmit}>
            <label>
              Set your Price for your Entity:
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                placeholder="Enter price in ETH"
              />
            </label>
            <button type="submit" className='btnPrimary'>
              <span className='bold'>List For Sale</span>
            </button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {isListed}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
