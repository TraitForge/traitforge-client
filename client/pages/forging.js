import React, { useState, useEffect, useRef } from 'react';
import { useContextState } from '@/utils/context';
import { appStore } from '@/utils/appStore';
import { observer } from 'mobx-react';
import { contractsConfig } from '@/utils/contractsConfig';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import styles from '@/styles/forging.module.scss';
import { LoadingSpinner, EntityCard, Modal } from '@/components';

const Forging = observer(() => {
  const {
    isOpen,
    openModal,
  } = useContextState();
  const { entitiesForForging, ownerEntities } = appStore;  

  const [modalContent, setModalContent] = useState(null);
  const entityList = useRef(null);
  const [selectedFromPool, setSelectedFromPool] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    appStore.getEntitiesForForging();
    appStore.getOwnersEntities('0x225b791581185B73Eb52156942369843E8B0Eec7');
  }, []); 


  const openModalWithContent = content => {
    setModalContent(content);
    openModal(true);
  };

  const forgeEntity = async () => {
    if (!walletProvider) return;
    setProcessing(true);
    setProcessingText('Forging');
    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const forgeContract = new ethers.Contract(
        contractsConfig.entityMergingAddress,
        contractsConfig.entityMergingContractAbi,
        signer
      );
      const transaction = await forgeContract.breedWithListed(Forger, Merger);
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
      console.error('Failed to Forge:', error);
    }
  };

  const ListToForgeEntity = async () => {
    if (!walletProvider) return;
    setProcessing(true);
    setProcessingText('Forging');
    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const forgeContract = new ethers.Contract(
        contractsConfig.entityMergingAddress,
        contractsConfig.entityMergingContractAbi,
        signer
      );
      const transaction = await forgeContract.listForBreeding(
        selectedEntity,
        fee
      );
      await transaction.wait();
      console.log('Listed Successfully');
    } catch (error) {
      console.error('Failed to List Entity:', error);
    }
  };

  const EntityList = ({ entities, setSelectedFromPool }) => (
    <div className="breeder-items-list">
      {entities.map((entity, index) => (
        <EntityCard
          key={entity.id}
          entity={entity}
          index={index}
          onClick={() => setSelectedFromPool(entity)}
        />
      ))}
    </div>
  );

  const modalContentToList = (
    <>
      <div className={styles.entityDisplay}>
        <h1>LIST YOUR ENTITY</h1>
        <ul>
          {Array.isArray(ownerEntities) && ownerEntities.length > 0 ? (
            ownerEntities.map((entity, index) => (
              <EntityCard
                key={index}
                entity={entity}
                onSelect={() => setSelectedEntity(entity)}
              />
            ))
          ) : (
            <li>You don't own an Entity!</li>
          )}
        </ul>
      </div>
      {selectedEntity && (
        <>
          <input type="number" step="0.0001" placeholder="Enter Your Fee" />
          <EntityCard entity={selectedEntity} />
          <ProcessingModal processing={processing} text={processingText} />
        </>
      )}
    </>
  );

  const modalContentToMerge = (
    <div className={styles.entityDisplay}>
      <h1>Select entity</h1>
      <ul>
        {Array.isArray(ownerEntities) && ownerEntities.length > 0 ? (
          ownerEntities.map((entity, index) => (
            <EntityCard entity={entity} index={index} />
          ))
        ) : (
          <li>You don't own an Entity!</li>
        )}
      </ul>
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

  const scrollToEntityList = () => {
    entityList.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.forgingPage}>
      <div className={styles.forgeArenaContainer}>
        <h1>Forging Arena</h1>
        <div className={styles.selectedEntityPlaceholder}>
          <div className={styles.forgecardsrow}>
            {selectedFromPool ? (
              <EntityCard
                entity={selectedFromPool}
                onSelect={() => setSelectedFromPool(null)}
              />
            ) : (
              <img
                src="/images/PoolSelectCard.png"
                alt="forge place holder"
                className={styles.otherEntities}
                onClick={scrollToEntityList}
              />
            )}
            <img src="/images/claimentity.png" alt="claim box" />
            <img
              src="/images/WalletSelectCard.png"
              alt="forge place holder"
              className={styles.yourEntities}
              onClick={() => openModalWithContent(modalContentToMerge)}
            />
            {isOpen && (
              <Modal background="/images/forge-background.jpg">
                {modalContentToMerge}
              </Modal>
            )}
          </div>
          {selectedEntity && (
            <div className={styles.selectedEntity}>
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
          src="/images/forgebutton.png"
          alt="forge"
          className={styles.forgeButton}
          onClick={() => forgeEntity()}
          disabled={processing}
        />
      </div>

      <div className={styles.entityListContainer} ref={entityList}>
        <div className={styles.breedSortingOptions}>
          <div className={styles.leftItems}>
            <button
              className={styles.breedEntityButton}
              onClick={() => openModalWithContent(modalContentToList)}
            >
              List Your Forger
            </button>
            {isOpen && (
              <Modal background="/images/forge-background.jpg">
                {modalContent}
              </Modal>
            )}
          </div>
          <div className={styles.rightItems}>
            <select
              className={styles.forgeSortingDropdown}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="">Select Sorting Option</option>
              <option value="priceLowHigh">Fee: Low to High</option>
              <option value="priceHighLow">Fee: High to Low</option>
            </select>
          </div>
        </div>
        <EntityList entities={sortedEntities} />
      </div>
    </div>
  );
});

export default Forging;
