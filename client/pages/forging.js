import { useState, useEffect, useContext } from 'react';

import { observer } from 'mobx-react';
import { useContextState } from '@/utils/context';
import { contractsConfig } from '@/utils/contractsConfig';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import styles from '@/styles/forging.module.scss';
import { Button, Modal } from '@/components';
import { appStore } from '@/utils/appStore';
import { SelectEntityList } from '@/screens/forging/SelectEntityList';
import { WalletEntityModal } from '@/screens/forging/WalletEntityModal';
import { ForgingArena } from '@/screens/forging/ForgingArena';
import { createContract } from '@/utils/utils';

const Forging = observer(() => {
  const { entitiesForForging } = appStore;
  const { ownerEntities, getOwnersEntities } = useContextState();
  const [isEntityListModalOpen, setIsEntityListModalOpen] = useState(false);
  const [generationFilter, setGenerationFilter] = useState('');
  const [isOwnerListOpen, setIsOwnerListOpen] = useState(false);
  const [selectedFromPool, setSelectedFromPool] = useState(null);
  const [processing, setProcessing] = useState(true);
  const { walletProvider } = useWeb3ModalProvider();

  const [processingText, setProcessingText] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);

  useEffect(() => {
    appStore.getEntitiesForForging();
    getOwnersEntities();
  }, []);

  const handleSelectedFromPool = entity => setSelectedFromPool(entity);
  const handleSelectedFromWallet = entity => setSelectedFromWallet(entity);

  const handleEntityListModal = () =>
    setIsEntityListModalOpen(prevState => !prevState);

  const handleOwnerEntityList = () =>
    setIsOwnerListOpen(prevState => !prevState);

  const forgeEntity = async () => {
    setProcessing(true);
    setProcessingText('Forging');
    try {
      const forgeContract = await createContract(
        walletProvider,
        contractsConfig.entityMergingAddress,
        contractsConfig.entityMergingContractAbi
      );
      const transaction = await forgeContract.breedWithListed(Forger, Merger);
      await transaction.wait();

      // TODO: remove this latter
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
    setGenerationFilter('');
  };

  const ListToForgeEntity = async () => {
    setProcessing(true);
    setProcessingText('Forging');
    try {
      const forgeContract = await createContract(
        walletProvider,
        contractsConfig.entityMergingAddress,
        contractsConfig.entityMergingContractAbi
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
            handleOwnerEntityList={handleOwnerEntityList}
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
            generationFilter={generationFilter}
            setGenerationFilter={setGenerationFilter}
          />
        </Modal>
      )}
      {isOwnerListOpen && (
        <Modal
          isOpen={isOwnerListOpen}
          closeModal={() => setIsOwnerListOpen(false)}
          modalClasses="items-end pb-4"
        >
          <WalletEntityModal
            ownerEntities={ownerEntities}
            filterType="merger"
            handleSelectedFromWallet={handleSelectedFromWallet}
            generationFilter={generationFilter}
            setGenerationFilter={setGenerationFilter}
          />
        </Modal>
      )}
    </div>
  );
});

export default Forging;
