import React, { useState, useEffect, useCallback } from 'react';
import '../styles/TradingModal.css';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { ethers } from 'ethers';

import tradeContractAbi from '../artifacts/contracts/TradeEntities.sol/EntityTrading.json';
import mintContractAbi from '../artifacts/contracts/Mint.sol/Mint.json';


const tradeContractAddress = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82';
const mintContractAddress = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';

const Modal = ({ open, onClose, onSave }) => {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [price, setPrice] = useState('');
  const [isListed, setIsListed] = useState(false);
  const [error, setError] = useState('');
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
 
  const fetchUserEntities = useCallback(async () => {
    if (!isConnected || !address) {
        console.log("Wallet not connected or address not found");
        return;
    }

    try {
        const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
        const signer = ethersProvider.getSigner();
        const mintContract = new ethers.Contract(mintContractAddress, mintContractAbi.abi, signer);

        const balance = await mintContract.balanceOf(address);
        const tokenIds = await Promise.all([...Array(balance.toNumber()).keys()].map(async (index) => {
            return mintContract.tokenOfOwnerByIndex(address, index);
        }));


        const entitiesDetails = await Promise.all(tokenIds.map(async (tokenId) => {
          const details = await mintContract.getTokenDetails(tokenId);
          const { claimShare, breedPotential, generation, age } = details;

            return {
                id: tokenId.toString(),
                claimshare: claimShare.toString(),
                breedpotential: breedPotential.toString(),
                generation: generation.toString(),
                age: age.toString(),
            };
        }));

        setEntities(entitiesDetails);
    } catch (error) {
        console.error('Could not retrieve entities:', error);
        setError('Failed to fetch entities');
    }
}, [address, isConnected, walletProvider]);


  

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

     if (!isConnected || !address) {
      setError('wallet not connected');
      return;
     }

     const selectedEntityData = entities.find(entity => entity.id === selectedEntity);
     if (selectedEntityData) {
       try {
         const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
         const signer = ethersProvider.getSigner();
         const tradeContract = new ethers.Contract(tradeContractAddress, tradeContractAbi, signer);
 
         const transaction = await tradeContract.listEntityForSale(selectedEntity, ethers.utils.parseEther(price));
         await transaction.wait();

          const sellingEntity = {
            id: selectedEntity,
            price: parseFloat(price),
          };
         onSave(sellingEntity);
         setIsListed(true);
         setTimeout(() => {
           setIsListed(false);
           onClose();
         }, 3000); 
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
              <div>
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                placeholder="Enter price in ETH"
              />
              </div>
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
