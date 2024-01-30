import React, { useState, useEffect } from 'react';
import TFLogo from './TFLogo.png';
import './honeypotmodal.css';

const HoneyPotModal = ({ showNFTModal, onClose }) => {
  const [nfts, setNfts] = useState([
    { id: 1, image: TFLogo, name: 'Garlic Arioli' },
    { id: 2, image: TFLogo, name: 'Whipped Cream' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ethWon, setEthWon] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!showNFTModal) return;
    const fetchNFTsFromWallet = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedNFTs = [
          { id: 1, image: TFLogo, name: 'Garlic Arioli' },
          { id: 2, image: TFLogo, name: 'Whipped Cream' },
        ];
        setNfts(fetchedNFTs);
      } catch (err) {
        setError('Failed to load NFTs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };


    fetchNFTsFromWallet();
  }, [showNFTModal]);

  const handleNftSelect = async (nftId) => {
    const confirmation = window.confirm('This action is irreversible. Press OK to confirm.');
    if (confirmation) {
      setShowConfirmation(true); 
      const ethAmount = await nukeEntity(nftId);
      setEthWon(ethAmount);
    }
  };

  const nukeEntity = async (nftId) => {
    return "100";
  };

const handleCloseConfirmation = () => {
  setShowConfirmation(false);
  onClose();
};
  const ConfirmationModal = () => (
    <div className="confirmation-modal">
      <div className="confirmation-content">
        <h2>Congratulations!</h2>
        <p>You've Claimed {ethWon} ETH!</p>
        <button className='confirm-close' onClick={handleCloseConfirmation}>Close</button>
      </div>
    </div>
  );


  return (
    <div className={`honey-pot-modal ${showNFTModal ? 'show' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <div className="modal-content">
        <h2>Select an Entity to Nuke</h2>

        {isLoading ? (
          <p>Loading Entities...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : (
          <div className="nft-list">
            {nfts.length > 0 ? (
              nfts.map(nft => (
                <div key={nft.id} className="nft-item" onClick={() => handleNftSelect(nft.id)}>
                  <img src={nft.image} alt={nft.name} />
                  <p>{nft.name}</p>
                </div>
              ))
            ) : (
              <p>No entities found.</p>
            )}
          </div>
        )}

        {showConfirmation && <ConfirmationModal />}
          </div>
      </div>
  );
};

export default HoneyPotModal;
