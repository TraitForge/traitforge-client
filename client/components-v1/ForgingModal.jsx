import React, { useState } from 'react';
import '../styles/TradingForgingModal.css';
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import forgeContractAbi from '../artifacts/contracts/EntityMerging.sol/EntityMerging.json';
import { useEntities } from './OwnerEntityContext'; // Import useEntities from your context
import EntityCards from './EntityCards'; // Ensure this import is correct

const forgeContractAddress = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853';

const ForgingModal = ({ open, onClose, onSave }) => {
  const { entities, isLoading } = useEntities(); // Use entities and isLoading from context
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const handlePriceChange = event => {
    setPrice(event.target.value);
    setError('');
  };

  const handleEntitySelect = tokenId => {
    setSelectedEntity(tokenId);
    setError('');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!price) {
      setError('Please enter a price');
      return;
    }
    if (!selectedEntity) {
      setError('Please select an entity to list.');
      return;
    }
    if (!isConnected) {
      setError('Wallet not connected');
      return;
    }
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const forgeContract = new ethers.Contract(
        forgeContractAddress,
        forgeContractAbi.abi,
        signer
      );
      const transaction = await forgeContract.listEntityForForge(
        selectedEntity,
        ethers.utils.parseEther(price)
      );
      await transaction.wait();

      onSave({
        tokenId: selectedEntity,
        price: parseFloat(price),
      });
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
        <header>List Your Entity for Forging</header>

        <div className="nfts-display-container">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            entities.map(entity => (
              <EntityCards
                key={entity.tokenId}
                entity={entity}
                isSelected={selectedEntity === entity.tokenId}
                onSelect={handleEntitySelect}
              />
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="btnContainer">
          <label>Set your Price:</label>
          <input
            type="text"
            value={price}
            onChange={handlePriceChange}
            placeholder="Enter price in ETH"
          />
          <button type="submit" className="btnPrimary">
            List For Forging
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgingModal;
