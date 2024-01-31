import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import './buysellModal.css';


import tradeContractAbi from '/Users/hudsondungey/TFCREAM/updatedrepo/src/contracts/EntityTrading.json';
import mintContractAbi from '/Users/hudsondungey/TFCREAM/updatedrepo/src/contracts/Mint.json';


const Modal = ({ open, onClose, onSave, userWallet }) => {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [price, setPrice] = useState('');
  const [isListed, setIsListed] = useState(false);
  const [error, setError] = useState('');


  const web3 = new Web3(Web3.givenProvider);
  const entityTradingContract = new web3.eth.Contract(tradeContractAbi.abi, '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9');
  const mintContract = new web3.eth.Contract(mintContractAbi.abi, '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0');


  const fetchUserEntities = useCallback(async () => {
    try {
      const userEntities = await mintContract.methods.getUserEntities(userWallet).call();
      setEntities(userEntities.map(entity => ({ ...entity, id: entity[0] }))); 
    } catch (error) {
      console.error('Could not retrieve data:', error);
    }
  }, [userWallet, mintContract.methods]);

  useEffect(() => {
    if (open) {
      fetchUserEntities();
    } else {
      setPrice('');
      setSelectedEntity(null);
    }
  }, [open, fetchUserEntities]);

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!price) {
      setError('Please enter a price');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const selectedEntityData = entities.find(entity => entity.id === selectedEntity);
    if (selectedEntityData) {
      try {
        await entityTradingContract.methods.listNFTForSale(selectedEntity, web3.utils.toWei(price, 'ether')).send({ from: userWallet });
        onSave({ ...selectedEntityData, price: parseFloat(price) });
        setIsListed(true);
        setTimeout(() => {
          setIsListed(false);
          onClose();
        }, 6000);
      } catch (error) {
        setError('Failed to list Entity. Please try again.');
        console.error('List Entity error:', error);
      }
    } else {
      setError('Please select an Entity to list.');
    }
  };

  if (!open) return null;

  return (
    <div className='overlay'>
      <button className='closeBtn' onClick={onClose}>x</button>
      <div className='modalContainer'>
        <header>List Your Entity for Sale</header>
        <div className='nfts-display-container'>
          {entities.map(entity => (
            <div
              key={entity.id}
              className={`nfts-item ${selectedEntity === entity.id ? 'selected' : ''}`}
              onClick={() => setSelectedEntity(entity.id)}
            >
              <img src={entity.image} alt={entity.name} />
              <p>{entity.name}</p>
              <p>{entity.claimshare}</p>
              <p>{entity.gender}</p>
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isListed && <p style={{ color: 'green' }}>Entity Listed Successfully!</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
