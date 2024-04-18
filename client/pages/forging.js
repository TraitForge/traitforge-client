import { useState, useEffect } from 'react';

import { appStore } from '@/utils/appStore';
import { observer } from 'mobx-react';
import { contractsConfig } from '@/utils/contractsConfig';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import styles from '@/styles/forging.module.scss';
import { Button, Modal } from '@/components';

import { SelectEntityList } from '@/screens/forging/SelectEntityList';
import { ForgingArena } from '@/screens/forging/ForgingArena';

const Forging = observer(() => {
  const { entitiesForForging, ownerEntities } = appStore;
  const [isEntityListModalOpen, setIsEntityListModalOpen] = useState(false);
  const [selectedFromPool, setSelectedFromPool] = useState(null);
  const [processing, setProcessing] = useState(true);
  const { walletProvider } = useWeb3ModalProvider();

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

  return (
    <div className={styles.forgingPage}>
      <div className={styles.forgeArenaContainer}>
        <h1 className="text-[36px] md:text-extra-large">Forging Arena</h1>
        <div className="py-7 md:py-10 3xl:py-20">
          <ForgingArena
            selectedFromPool={selectedFromPool}
            ownerEntities={ownerEntities}
            handleEntityListModal={handleEntityListModal}
          />
        </div>
        <div className="max-md:px-5">
          <Button
            text="forge entity"
            bg="rgba(31, 15, 0,0.6)"
            borderColor="#FD8D26"
            disabled={processing}
          />
        </div>
      </div>
      {isEntityListModalOpen && (
        <Modal
          isOpen={isEntityListModalOpen}
          closeModal={() => setIsEntityListModalOpen(false)}
          modalClasses="items-end pb-4"
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
