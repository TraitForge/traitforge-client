import { useState, useEffect, useRef } from 'react';

import { appStore } from '@/utils/appStore';
import { observer } from 'mobx-react';
import { contractsConfig } from '@/utils/contractsConfig';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import styles from '@/styles/forging.module.scss';
import { LoadingSpinner, EntityCard, Button, Modal } from '@/components';

import { SelectEntityList } from '@/screens/forging/SelectEntityList';
import { FongingArena } from '@/screens/forging/ForgingArena';

const Forging = observer(() => {
  const { entitiesForForging, ownerEntities } = appStore;
  const [isEntityListModalOpen, setIsEntityListModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState(null);
  const entityList = useRef(null);
  const [selectedFromPool, setSelectedFromPool] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const { walletProvider } = useWeb3ModalProvider();

  console.log(isEntityListModalOpen);

  useEffect(() => {
    appStore.getEntitiesForForging();
    appStore.getOwnersEntities();
  }, []);

  const openModalWithContent = content => setModalContent(content);

  const handleSelectedFromPool = entity => setSelectedFromPool(entity);

  const handleEntityListModal = () =>
    setIsEntityListModalOpen(prevState => !prevState);

  const forgeEntity = async () => {
    if (!walletProvider) return;
    setProcessing(true);
    setProcessingText('Forging');
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
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
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
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

  // const modalContentToList = (
  //   <>
  //     <div className={styles.entityDisplay}>
  //       <h1>LIST YOUR ENTITY</h1>
  //       <ul>
  //         {Array.isArray(ownerEntities) && ownerEntities.length > 0 ? (
  //           ownerEntities.map((entity, index) => (
  //             <EntityCard
  //               key={index}
  //               entity={entity}
  //               onSelect={() => setSelectedEntity(entity)}
  //             />
  //           ))
  //         ) : (
  //           <li>You don't own an Entity!</li>
  //         )}
  //       </ul>
  //     </div>
  //     {selectedEntity && (
  //       <>
  //         <input type="number" step="0.0001" placeholder="Enter Your Fee" />
  //         <EntityCard entity={selectedEntity} />
  //         <ProcessingModal processing={processing} text={processingText} />
  //       </>
  //     )}
  //   </>
  // );

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

  return (
    <div className={styles.forgingPage}>
      <div className={styles.forgeArenaContainer}>
        <h1 className="text-[64px]">Forging Arena</h1>
        <div className="py-20">
          <FongingArena
            selectedFromPool={selectedFromPool}
            openModalWithContent={openModalWithContent}
            ownerEntities={ownerEntities}
            handleEntityListModal={handleEntityListModal}
          />
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
        <Button
          text="forge entity"
          bg="rgba(31, 15, 0,0.6)"
          borderColor="#FD8D26"
          disabled={processing}
          onClick={forgeEntity}
        />
      </div>
      {isEntityListModalOpen && (
        <Modal isOpen={isEntityListModalOpen}>
          <SelectEntityList
            sortedEntities={sortedEntities}
            handleSelectedFromPool={handleSelectedFromPool}
            closeModal={handleEntityListModal}
          />
        </Modal>
      )}
    </div>
  );
});

export default Forging;
