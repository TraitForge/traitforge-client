import React, { useState } from 'react';
import '../styles/HoneyPotModal.css';
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import NukeContractAbi from '../artifacts/contracts/NukeFund.sol/NukeFund.json';
import { useEntities } from './OwnerEntityContext';

const NukeContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

const HoneyPotModal = ({ showEntityModal, onClose }) => {
  const { entities, isLoading } = useEntities();
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const { isConnected, walletProvider } = useWeb3ModalProvider();

  const handleEntitySelect = entity => {
    setSelectedEntity(entity);
    setShowConfirmModal(true);
  };

  const handleConfirmNuke = async () => {
    if (!isConnected) {
      setError('Please connect your wallet to proceed.');
      return;
    }

    try {
      const signer = walletProvider.getSigner();
      const contractWithSigner = new ethers.Contract(
        NukeContractAddress,
        NukeContractAbi,
        signer
      );
      const transaction = await contractWithSigner.nuke(selectedEntity);
      await transaction.wait();
      console.log(`Entity ${selectedEntity} nuked successfully.`);
      setShowConfirmModal(false);
      onClose();
    } catch (err) {
      console.error(`Failed to nuke entity ${selectedEntity}:`, err);
      setError(`Failed to nuke entity ${selectedEntity}.`);
    }
  };

  if (!showEntityModal) return null;

  return (
    <div className={`honey-pot-modal ${showEntityModal ? 'show' : ''}`}>
      <button className="close-button" onClick={onClose}>
        X
      </button>
      <div className="modal-content">
        <h2>Select an Entity to Nuke</h2>
        {isLoading ? (
          <p>Loading Entities...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : (
          <div className="nft-lists">
            {entities.length > 0 ? (
              entities.map(entity => (
                <div
                  key={entity.tokenId}
                  className="nft-items"
                  onClick={() => handleEntitySelect(entity)}
                >
                  <img src={entity.image} alt={`Entity ${entity.tokenId}`} />
                </div>
              ))
            ) : (
              <p>No entities available to nuke.</p>
            )}
          </div>
        )}

        {showConfirmModal && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <h2>Confirm Action</h2>
              <p>Are you sure you want to nuke this entity?</p>
              <button className="confirm-action" onClick={handleConfirmNuke}>
                Confirm
              </button>
              <button
                className="cancel-action"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoneyPotModal;
