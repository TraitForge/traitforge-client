import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import '../styles/buysellModal.css';


import tradeContractAbi from '../contracts/EntityTrading.json';
import mintContractAbi from '../contracts/Mint.json';
import erc721ABI from '../contracts/ERC721.json'

const Modal = ({ open, onClose, onSave, userWallet }) => {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [price, setPrice] = useState('');
  const [isListed, setIsListed] = useState(false);
  const [error, setError] = useState('');

  const localProvider = 'https://goerli.infura.io/v3/3f27d7e6326b43c5b77e16ac62188640';

  const web3 = new Web3(new Web3.providers.HttpProvider(localProvider));
  const entityTradingContract = new web3.eth.Contract(tradeContractAbi.abi, '0x3155a7Db77C5a08103132b1915AF86fd6cD8B863');
  const mintContract = new web3.eth.Contract(mintContractAbi.abi, '0x4a634580371BB162f371616aec871Bc46201D937');


 
  const fetchUserEntities = useCallback(async () => {
    try {
        if (!userWallet) {
            return;
        }

        const erc721Contract = new web3.eth.Contract(erc721ABI, '0x4a634580371BB162f371616aec871Bc46201D937'); 
        const ownedTokenIds = await erc721Contract.methods.tokensOfOwner(userWallet).call();

        const userEntities = await Promise.all(ownedTokenIds.map(async (tokenId) => {
            const entityType = await mintContract.methods.getEntityType(tokenId).call();
            const claimShare = await mintContract.methods.getClaimShare(tokenId).call();
            const breedPotential = await mintContract.methods.getBreedPotential(tokenId).call();

            return {
                id: tokenId,
                entityType,
                claimShare,
                breedPotential,
            };
        }));

        setEntities(userEntities);
    } catch (error) {
        console.error('Could not retrieve data:', error);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
}, [userWallet]); 

  

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
        await entityTradingContract.methods.listEntityForSale(selectedEntity, web3.utils.toWei(price, 'ether')).send({ from: userWallet });
        onSave({ ...selectedEntityData, price: parseFloat(price) });
        setIsListed(true);
        setTimeout(() => {
          setIsListed(false);
          onClose();
        }, 6000);
      } catch (error) {
        setError('Failed to list Entity. Please try again.');
        console.error('List Entity error:', error);
      }
    } else {
      setError('Please select an Entity to list.');
    }
  };

  if (!open) return null;

  return (
    <div className='overlay'>
      <button className='closeBtn' onClick={onClose}>x</button>
      <div className='modalContainer'>
        <header>List Your Entity for Sale</header>
        <div className='nfts-display-container'>
          {entities.map(entity => (
            <div
              key={entity.id}
              className={`nfts-item ${selectedEntity === entity.id ? 'selected' : ''}`}
              onClick={() => setSelectedEntity(entity.id)}
            >
              <img src={entity.image} alt={entity.name} />
              <p>{entity.name}</p>
              <p>{entity.claimshare}</p>
              <p>{entity.gender}</p>
            </div>
          ))}
        </div>
        <div className='btnContainer'>
          <form onSubmit={handleSubmit}>
            <label>
              Set your Price for your Entity:
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                placeholder="Enter price in ETH"
              />
            </label>
            <button type="submit" className='btnPrimary'>
              <span className='bold'>List For Sale</span>
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isListed && <p style={{ color: 'green' }}>Entity Listed Successfully!</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
