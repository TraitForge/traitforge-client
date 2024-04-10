import { useState, useEffect } from 'react';

import { appStore } from '@/utils/appStore';
import { observer } from 'mobx-react';
import { contractsConfig } from '@/utils/contractsConfig';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import styles from '@/styles/forging.module.scss';
import { LoadingSpinner,  Button, Modal } from '@/components';

import { SelectEntityList } from '@/screens/forging/SelectEntityList';
import { FongingArena } from '@/screens/forging/ForgingArena';

const Forging = observer(() => {
  const { entitiesForForging, ownerEntities } = appStore;
  const [isEntityListModalOpen, setIsEntityListModalOpen] = useState(false);
  const { walletProvider } = useWeb3ModalProvider();
  const [selectedFromPool, setSelectedFromPool] = useState(null);
  const [processing, setProcessing] = useState(true);

  const [processingText, setProcessingText] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);

  useEffect(() => {
    appStore.getEntitiesForForging();
    appStore.getOwnersEntities();
  }, []);

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

  

  return (
    <div className={styles.forgingPage}>
      <div className={styles.forgeArenaContainer}>
        <h1 className="text-[64px]">Forging Arena</h1>
        <div className="py-20">
          <FongingArena
            selectedFromPool={selectedFromPool}
            ownerEntities={ownerEntities}
            handleEntityListModal={handleEntityListModal}
          />
          {/* {selectedEntity && (
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
          )}  */}
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
        <Modal
          isOpen={isEntityListModalOpen}
          closeModal={() => setIsEntityListModalOpen(false)}
        >
          <SelectEntityList
            entitiesForForging={entitiesForForging}
            handleSelectedFromPool={handleSelectedFromPool}
          />
        </Modal>
      )}
    </div>
  );
});

export default Forging;
