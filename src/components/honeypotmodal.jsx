import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; 
import { Web3Context } from '../utils/Web3Context';
import '../styles/honeypotmodal.css';
import Web3 from 'web3';
import NukeFundAbi from '../contracts/NukeFund.json';

const HoneyPotModal = ({ showEntityModal, onClose }) => {
  const { userWallet } = useContext(Web3Context);
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ethWon, setEthWon] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const graphEndpoint = 'YOUR_SUBGRAPH_ENDPOINT_HERE';

  useEffect(() => {
    if (!showEntityModal || !userWallet) return;

    const fetchEntities = async () => {
      setIsLoading(true);
      setError(null);

      const query = `
        query {
          entities(where: { owner: "${userWallet.toLowerCase()}" }) {
            id
            image
            name
          }
        }
      `;

      try {
        const response = await axios.post(graphEndpoint, { query });
        const { data } = response.data;
        setEntities(data.entities || []);
      } catch (err) {
        setError('Failed to load entities');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntities();
  }, [showEntityModal, userWallet]);

  const nukeEntity = async (entityId) => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(NukeFundAbi.abi, NukeFundAbi.networks[5777].address);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
      const accounts = await web3.eth.getAccounts();
      const response = await contract.methods.nuke(entityId).send({ from: accounts[0] });
      const ethAmount = response.events.ClaimShare.returnValues.amount;
      setEthWon(web3.utils.fromWei(ethAmount, 'ether'));
      setShowConfirmation(true);
    } catch (err) {
      console.error('Nuking entity failed:', err);
      setError('Failed to nuke entity');
    }
  };

  const handleNftSelect = async (entityId) => {
    const confirmation = window.confirm('This action is irreversible. Press OK to confirm.');
    if (confirmation) {
      await nukeEntity(entityId);
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
              <p>You need an Entity to procced this function!</p>
            )}
          </div>
        )}
        {showConfirmation && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <h2>Congratulations!</h2>
              <p>You've Claimed {ethWon} ETH!</p>
              <button className='confirm-close' onClick={handleCloseConfirmation}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoneyPotModal;
