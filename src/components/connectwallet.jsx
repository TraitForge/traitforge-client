import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import tradeContractAbi from '../artifacts/contracts/TradeEntities.sol/EntityTrading.json';
import forgeContractAbi from '../artifacts/contracts/EntityMerging.sol/EntityMerging.json';
import '../styles/ConnectWalletModal.css';

const tradeContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const forgeContractAddress = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853';

const ConnectWalletModal = ({ isOpen, onClose, children }) => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async (contractAddress, contractAbi) => {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
      const balance = await contract.ownerListedEntities(address);
      let tokenIds = [];
      for (let index = 0; index < balance.toNumber(); index++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address, index);
        tokenIds.push(tokenId.toString());
      }
      return tokenIds.map(id => ({ id, source: contractAddress === tradeContractAddress ? 'trade' : 'forge' }));
    } catch (error) {
      console.error('Could not retrieve listings:', error);
      setError('Failed to fetch listings');
      return [];
    }
  }, [address, walletProvider]);

  const fetchUserListings = useCallback(async () => {
    const tradeListings = await fetchListings(tradeContractAddress, tradeContractAbi);
    const forgeListings = await fetchListings(forgeContractAddress, forgeContractAbi);
    setEntities([...tradeListings, ...forgeListings]);
  }, [fetchListings]);

  useEffect(() => {
    if (isOpen) {
      fetchUserListings();
    }
  }, [isOpen, fetchUserListings]);

  const unlistEntity = useCallback(async () => {
    if (!isConnected || !selectedEntity) {
      alert("Wallet not connected or no entity selected");
      return;
    }
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(tradeContractAddress, tradeContractAbi.abi, signer);
      const unlist = await contract.unlistEntity(selectedEntity);
      await unlist.wait();
      fetchUserListings();
      setSelectedEntity(null);
    } catch (error) {
      console.error('Failed to unlist:', error);
      setError('Failed to unlist');
    }
  }, [isConnected, selectedEntity, walletProvider, fetchUserListings]);

  if (!isOpen) return null;

  return (
    <>
      <div className="connect-modal-overlay" onClick={onClose}>
        <div className="connect-modal-content" onClick={e => e.stopPropagation()}>
        <button className="connect-close-button" onClick={onClose}>X</button>
            <div className="connect-modalContent-header">
          {children}
          </div>
        <div className='unlist-modalContainer'>
          <header>Unlist an Entity</header>
          <div className='unlist-display-container'>
            {entities.length > 0 ? (
              entities.map(entity => (
                <div key={entity.id} className={`nfts-item ${selectedEntity === entity.id ? 'selected' : ''}`} onClick={() => setSelectedEntity(entity.id)}>
                  <img src={`https://example.com/${entity.id}.png`} alt={entity.id} />
                </div>
              ))
            ) : (<p>You have no entities listed.</p>)}
          </div>
          {selectedEntity && (
            <button className="unlist-button" onClick={unlistEntity}>Unlist</button>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectWalletModal;
