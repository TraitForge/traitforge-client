import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './buysellModal.css';

import tradeContractAbi from '/Users/hudsondungey/TFCREAM/updatedrepo/artifacts/contracts/TradeEntities.sol/EntityTrading.json';
import mintContractAbi from '/Users/hudsondungey/TFCREAM/updatedrepo/artifacts/contracts/Mint.sol/Mint.json';


  const Modal = ({ open, onClose, onSave, userWallet }) => {
  const [entities, setEntities] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [price, setPrice] = useState('');
  const [isListed,setIsListed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchUserEntities();
      setIsListed(false);
    } else {
      setPrice('');
    }
  }, [open]);

  const web3 = new Web3(Web3.givenProvider);
  const entityTradingAddress = new web3.eth.Contract(tradeContractAbi.abi, '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9');
  const mintAddress = new web3.eth.Contract(mintContractAbi.abi, '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0');

  const fetchUserEntities = async () => {
    try {
      const userEntities = await contract.methods.getUserEntities(userWallet).call();
      return entities;
    } catch (error) {
      console.error('Could not retrieve data:', error);
      return[];
    }
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
