import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import '../styles/OwnerEntities.css'; 

import ERC721ContractAbi from '../artifacts/contracts/CustomERC721.sol/CustomERC721.json';

const ERC721ContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const OwnerEntitiesModal = ({ isOpen, onClose }) => {
  const [userEntities, setUserEntities] = useState([]);
  const [error, setError] = useState('');
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    const fetchUserEntities = async () => {
      if (!isConnected || !address) {
        alert("Wallet not connected");
        console.log("Wallet not connected or address not found");
        return;
      }

      try {
        const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
        const signer = ethersProvider.getSigner();
        const ERC721Contract = new ethers.Contract(ERC721ContractAddress, ERC721ContractAbi.abi, signer);
        const balance = await ERC721Contract.balanceOf(address);
        let tokenIds = [];
        for (let index = 0; index < balance.toNumber(); index++) {
          const tokenId = await ERC721Contract.tokenOfOwnerByIndex(address, index);
          tokenIds.push(tokenId.toString());
        }
    
        const entitiesDetails = await Promise.all(tokenIds.map(async (tokenId) => {
          const entropy = await ERC721Contract.getEntropyForToken(tokenId);
          const [nukeFactor, breedPotential, performanceFactor, isSire] = await ERC721Contract.deriveTokenParameters(entropy);
          return {
            tokenId,
            nukeFactor: nukeFactor.toString(),
            breedPotential: breedPotential.toString(),
            performanceFactor: performanceFactor.toString(),
            isSire: isSire,
          };
        }));

        setUserEntities(entitiesDetails);
      } catch (error) {
        console.error('Could not retrieve entities:', error);
        setError('Failed to fetch entities');
      }
    };

    if (isOpen) {
      fetchUserEntities();
    }
  }, [isOpen, address, isConnected, walletProvider]);

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="OwnerModal">
        <button className="close-modal-button" onClick={onClose}>X</button>
        <div className="OwnerCards">
          {userEntities.length > 0 ? (
            userEntities.map((entity) => (
              <div key={entity.tokenId}>
                <p>Token ID: {entity.tokenId}</p>
                {/* Display more entity details as needed */}
              </div>
            ))
          ) : (
            <p>No entities found or waiting for fetch</p>
          )}
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default OwnerEntitiesModal;

