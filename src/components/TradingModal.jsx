import React, { useState, useEffect, useCallback } from 'react';
import '../styles/TradingBreedingModal.css';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { ethers } from 'ethers';

import tradeContractAbi from '../artifacts/contracts/TradeEntities.sol/EntityTrading.json';
import ERC721ContractAbi from '../artifacts/contracts/Mint.sol/Mint.json';


const tradeContractAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
const ERC721ContractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';

const TradingModal = ({ open, onClose, onSave }) => {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [price, setPrice] = useState('');
  const [isListed, setIsListed] = useState(false);
  const [error, setError] = useState('');
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
 
  const fetchUserEntities = useCallback(async () => {
    if (!isConnected || !address) {
        alert("Wallet not connected");
        console.log("Wallet not connected or address not found");
        return;
    }

    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const mintContract = new ethers.Contract(ERC721ContractAddress, ERC721ContractAbi.abi, signer);

      const balance = await mintContract.balanceOf(address);
      let tokenIds = [];
      for (let index = 0; index < balance.toNumber(); index++) {
        const tokenId = await mintContract.tokenOfOwnerByIndex(address, index);
        tokenIds.push(tokenId);
      }

      const entitiesDetails = await Promise.all(tokenIds.map(async (tokenId) => {
        const details = await mintContract.getEntityAttributes(tokenId);
        const { nukeFactor, forgePotential, generation, age, type } = details;

        return {
          id: tokenId.toString(),
          nukefactor: nukeFactor.toString(),
          forgepotential: forgePotential.toString(),
          generation: generation.toString(),
          type: type,
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
    } 
  }, [open, fetchUserEntities]);




  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    setError('');
  };

  const listEntity = async (event) => {
    event.preventDefault();

    if (!isConnected || !address) {
      setError('Wallet not connected');
      return;
    }

    if (!selectedEntity) {
      setError('Please select an Entity to list.');
      return;
    }

    if (!price) {
      setError('Please enter a price');
      return;
    }

    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const tradeContract = new ethers.Contract(tradeContractAddress, tradeContractAbi.abi, signer);

      const transaction = await tradeContract.listEntityForSale(selectedEntity, ethers.utils.parseEther(price));
      await transaction.wait();

      setIsListed(true);
      setTimeout(() => {
        setIsListed(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to list Entity. Please try again.', error);
      setError('Failed to list Entity. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div className='overlay'>
      <button className='closeBtn' onClick={onClose}>x</button>
      <div className='modalContainer'>
        <header>List Your Entity for Sale</header>
        <div className='nfts-display-container'>
          {entities.length > 0 ? (
            entities.map(entity => (
              <div
                key={entity.id}
                className={`nfts-item ${selectedEntity === entity.id ? 'selected' : ''}`}
                onClick={() => setSelectedEntity(entity.id)}
              >
                <img src={entity.image} alt={entity.id} />
                <p>{entity.forgepotential}</p>
                <p>{entity.nukefactor}</p>
                <p>{entity.type}</p>
              </div>
            ))
          ) : (
            <p>No entities available for listing.</p>
          )}
        </div>
        <div className='btnContainer'>
          <div onSubmit={listEntity}>
            <label>
              Set your Price for your Entity:
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                placeholder="Enter price in ETH"
              />
            </label>
            <button type="submit" className="btnPrimary">List For Sale</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isListed && <p style={{ color: 'green' }}>Entity Listed Successfully!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingModal;
