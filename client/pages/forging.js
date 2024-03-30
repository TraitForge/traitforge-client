import React, { useState, useEffect, useRef } from 'react';
import { useContextState } from '@/utils/context';
import { useContractContext } from '@/ContractContext'; // Import the contract context
import Modal from './ForgingModal';
import OwnerEntitiesModal from '@/OwnerEntities';
import EntityCard from '@/components/EntityCard';
import ClaimEntity from '@/utils/claimentity.png';
import PoolForgeCard from '@/utils/PoolSelectCard.png';
import WalletForgeCard from '@/utils/WalletSelectCard.png';
import ForgeButton from '@/utils/forgebutton.png';
import '@/styles/Forging.css';
import LoadingSpinner from '@/Spinner';

const Forging = () => {
  const {
    getEntitiesForForging,
    getOwnersEntities,
    isConnected,
  } = useContextState();
  const { forgeContractAddress, forgeContractAbi } = useContractContext(); 

  const entityList = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [openOwnerEntitiesModal, setOpenOwnerEntitiesModal] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);

  useEffect(() => {
    if (isConnected) {
      fetchEntitiesForForging();
    }
  }, [isConnected, getEntitiesForForging, getOwnersEntities]);

  const forgeEntity = async () => {
    if (!isConnected ) return;
    setProcessing(true);
    setProcessingText('Forging');
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const forgeContract = new ethers.Contract(
        forgeContractAddress,
        forgeContractAbi,
        signer
      );
      const transaction = await forgeContract.forgeEntity();
      await transaction.wait();

      setTimeout(() => {
        setProcessingText('Merging');
        setTimeout(() => {
          setProcessing(false);
          console.log('Process completed');
        }, 10000);
      }, 10000);
      console.log('Forged successfully');
    } catch (error) {
      console.error('Failed to fetch entities:', error);
    }
  };

  const EntityList = ({ entities, onEntitySelect }) => (
    <div className="breeder-items-list">
      {entities.map((entity, index) => (
        <EntityCard key={entity.id} entity={entity} index={index} onClick={() => onEntitySelect(entity)} />
      ))}
    </div>
  );

  const ProcessingModal = ({ processing, text }) => {
    if (!processing) return null;
    return (
      <div className="processing-modal">
        <div className="modal-content">
          <LoadingSpinner />
          <p>{text}</p>
        </div>
      </div>
    );
  };

  const getSortedEntities = () => {
    if (!sortOption) return entitiesForForging;
    return entitiesForForging.sort((a, b) => {
      if (sortOption === 'priceLowHigh') {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (sortOption === 'priceHighLow') {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      return 0;
    });
  };

  const sortedEntities = getSortedEntities();

  const openEntityToForge = entity => {
    setSelectedEntity(entity);
  };

  const toggleOwnerEntitiesModal = () => {
    console.log('Toggling OwnerEntitiesModal');
    setOpenOwnerEntitiesModal(true);
  };

  const scrollToEntityList = () => {
    entityList.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="TBG-page">
      <div className="forge-arena-container">
        <h1>Forging Arena</h1>
        <div className="selected-entity-placeholder">
          <div className="forgecardsrow">
            <img
              src={PoolForgeCard}
              alt="forge place holder"
              className="other-entities"
              onClick={scrollToEntityList}
            />
            <img src={ClaimEntity} alt="claim box" />
            <img
              src={WalletForgeCard}
              alt="forge place holder"
              className="your-entities"
              onClick={toggleOwnerEntitiesModal}
            />
            {openOwnerEntitiesModal && (
              <OwnerEntitiesModal
                isOpen={openOwnerEntitiesModal}
                onClose={() => setOpenOwnerEntitiesModal(false)}
              />
            )}
          </div>
          {selectedEntity && (
            <div className="selectedEntity">
              <img
                src={selectedEntity.image}
                alt={`Entity ${selectedEntity.title}`}
              />
              <div>
                <h5>{selectedEntity.title}</h5>
                <p>Price: {selectedEntity.price} ETH</p>
                <p>Gender: {selectedEntity.gender}</p>
              </div>
            </div>
          )}
        </div>
        <img
          src={ForgeButton}
          alt="forge"
          className="forge-button"
          onClick={() => forgeEntity()}
        />
      </div>

      <div className="entity-list-container" ref={entityList}>
        <div className="breed-sorting-options">
          <div className="left-items">
            {openModal && (
              <Modal open={openModal} onClose={() => setOpenModal(false)} />
            )}
            <button
              className="breed-entity-button"
              onClick={() => setOpenModal(true)}
            >
              List Your Forger
            </button>
          </div>
          <div className="right-items">
            <select
              className="forge-sorting-dropdown"
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="">Select Sorting Option</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </div>
        </div>
        <EntityList
          entities={sortedEntities}
          openSelectEntity={openEntityToForge}
        />
      </div>

      {selectedEntity && (
        <div className="detailed-card">
          <img
            src={selectedEntity.image}
            alt={`Entity ${selectedEntity.title}`}
          />
          <h5>{selectedEntity.title}</h5>
          <p>Price: {selectedEntity.price} ETH</p>
          <p>{selectedEntity.gender}</p>
          <p>Nuke Factor: {selectedEntity.nukefactor}</p>
          <button
            className="forge-button"
            onClick={() => forgeNewEntity(selectedEntity)}
          >
            Forge
          </button>
          <button
            className="close-button"
            onClick={() => setSelectedEntity(null)}
          >
            Close
          </button>
          <ProcessingModal processing={processing} text={processingText} />
        </div>
      )}
    </div>
  );
};

export default Forging;
