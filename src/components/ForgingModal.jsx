import React, { useState, useEffect, useCallback } from 'react';
import '../styles/TradingForgingModal.css';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { ethers } from 'ethers';
import forgeContractAbi from '../artifacts/contracts/EntityMerging.sol/EntityMerging.json';
import ERC721ContractAbi from '../artifacts/contracts/CustomERC721.sol/CustomERC721.json';

const ERC721ContractAddress = '0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2';
const forgeContractAddress = ' 0x202CCe504e04bEd6fC0521238dDf04Bc9E8E15aB';

const ForgingModal = ({ open, onClose, onSave }) => {
  const [entities, setEntities] = useState([]);
  const [error, setError] = useState('');
  const [isListed, setIsListed] = useState(null);
  const [price, setPrice] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const fetchUserEntities = useCallback(async () => {
  if (!isConnected) {
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
  const selectedEntityData = entities.find(entity => entity.id === selectedEntity);
  if (selectedEntityData) {
  try {
  const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
  const signer = ethersProvider.getSigner();
  const tradeContract = new ethers.Contract(forgeContractAddress, forgeContractAbi, signer);
  const transaction = await tradeContract.listEntityForForge(selectedEntity, ethers.utils.parseEther(price));
  await transaction.wait();

  const forgeEntity = {
    id: selectedEntity,
    price: parseFloat(price),
  };
  onSave(forgeEntity);
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
}};
 
if (!open) return null;

return (
<div className='overlay'>

  <button className='closeBtn' onClick={onClose}>x</button>

<div className='modalContainer'>
  <header>List Your Entity for Forging</header>
  <div className='nfts-display-container'>
    {entities.length > 0 ? (entities.map(entity => (
    <div key={entity.id} className={`nfts-item ${selectedEntity === entity.id ? 'selected' : ''}`} onClick={() => setSelectedEntity(entity.id)}>
    <img src={entity.image} alt={entity.name} />
    <p>{entity.performanceFactor}</p>
    <p>{entity.breedPotential}</p>
    <p>{entity.nukeFactor}</p>
    <p>{entity.isSire}</p>
    </div>
    ))
    ) : (
    <p>No entities available for listing.</p>)}
  </div>


<div className='btnContainer'>
  <div onSubmit={handleSubmit}>
    <label> Set your Price:
    <div>
      <input
      type="text"
      value={price}
      onChange={handlePriceChange}
      placeholder="Enter price in ETH"
      />
    </div>
    </label>


<button type="submit" className="btnPrimary">List For Forging</button>
  {error && <p style={{ color: 'red' }}>{error}</p>}
  {isListed && <p style={{ color: 'green' }}>Entity Listed Successfully!</p>}
</div>
</div>
</div>
</div>
)};

export default ForgingModal;