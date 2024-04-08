import React, { useState } from 'react';
import '../styles/TradingForgingModal.css';
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import { useEntities } from './OwnerEntityContext';
import tradeContractAbi from '../artifacts/contracts/TradeEntities.sol/EntityTrading.json';
import EntityCards from './EntityCards';

const tradeContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

const TradingModal = ({ open, onClose }) => {
  const { entities, isLoading } = useEntities();
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const handlePriceChange = event => {
    setPrice(event.target.value);
    setError('');
  };

  const handleEntitySelect = entityId => {
    setSelectedEntity(entityId);
    setError('');
  };

  const listEntity = async event => {
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
      const tradeContract = new ethers.Contract(
        tradeContractAddress,
        tradeContractAbi.abi,
        signer
      );

      const transaction = await tradeContract.listEntityForSale(
        selectedEntity,
        ethers.utils.parseEther(price)
      );
      await transaction.wait();

      alert('Entity Listed Successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to list Entity. Please try again.', error);
      setError('Failed to list Entity. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div className="overlay">
      <div className="modalContainer">
        <button className="closeBtn" onClick={onClose}>
          x
        </button>
        <header>List Your Entity for Sale</header>

        <div className="nfts-display-container">
          {isLoading ? (
            <Spinner />
          ) : entities.length > 0 ? (
            entities.map(entity => (
              <EntityCards
                key={entity.tokenId}
                entity={entity}
                isSelected={selectedEntity === entity.tokenId}
                onSelect={handleEntitySelect}
              />
            ))
          ) : (
            <p>No entities available for listing.</p>
          )}
        </div>

        <form onSubmit={listEntity} className="btnContainer">
          <label>Set your Price for your Entity:</label>
          <input
            type="text"
            value={price}
            onChange={handlePriceChange}
            placeholder="Enter price in ETH"
          />
          <button type="submit" className="btnPrimary">
            List For Sale
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default TradingModal;
