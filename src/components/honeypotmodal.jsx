import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import '../styles/honeypotmodal.css';
import NukeContractAbi from '../artifacts/contracts/NukeFund.sol/NukeFund.json';

const NukeContractAddress = '0x610178dA211FEF7D417bC0e6FeD39F05609AD788'; 

const HoneyPotModal = ({ showEntityModal, onClose }) => {
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();


  useEffect(() => {
    if (!showEntityModal || !isConnected) return;

    const fetchEntities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const contract = new ethers.Contract(NukeContractAddress, NukeContractAbi.abi, provider);


        const entitiesData = await contract.getAllEntities(); 
        
        setEntities(entitiesData.map((entity) => ({
          id: entity.id.toString(),
          image: entity.image,
          name: entity.name,
        })));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching entities:', err);
        setError('Failed to load entities.');
        setIsLoading(false);
      }
    };

    fetchEntities();
  }, [showEntityModal, isConnected, walletProvider]);

  const handleNftSelect = async (entityId) => {
    if (!isConnected) {
      setError("Please connect your wallet to proceed.");
      return;
    }

    setIsLoading(true);
    try {
      const signer = walletProvider.getSigner();
      const contractWithSigner = new ethers.Contract(NukeContractAddress, NukeContractAbi, signer);

      const transaction = await contractWithSigner.nuke(entityId);
      await transaction.wait();

      console.log(`Entity ${entityId} nuked successfully.`);
      setShowConfirmation(true);
    } catch (err) {
      console.error(`Failed to nuke entity ${entityId}:`, err);
      setError(`Failed to nuke entity ${entityId}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    onClose();
  };

  return (
    <div className={`honey-pot-modal ${showEntityModal ? 'show' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <div className="modal-content">
        <h2>Select an Entity to Nuke</h2>
        {isLoading ? (
          <p>Loading Entities...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : (
          <div className="nft-list">
            {entities.length > 0 ? (
              entities.map(entity => (
                <div key={entity.id} className="nft-item" onClick={() => handleNftSelect(entity.id)}>
                  <img src={entity.image} alt={entity.name} />
                  <p>{entity.name}</p>
                </div>
              ))
            ) : (
              <p>No entities available to nuke.</p>
            )}
          </div>
        )}
        {showConfirmation && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <h2>Action Confirmation</h2>
              <p>Entity nuked successfully.</p>
              <button className='confirm-close' onClick={handleCloseConfirmation}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoneyPotModal;

