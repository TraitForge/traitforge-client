import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useContextState } from '@/utils/context';
import { contractsConfig } from '@/utils/contractsConfig';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import styles from '@/styles/forging.module.scss';
import { Button, Button2, Modal } from '@/components';
import { SelectEntityList } from '@/screens/forging/SelectEntityList';
import { WalletEntityModal } from '@/screens/forging/WalletEntityModal';
import { ListEntity } from '@/screens/forging/ListEntity';
import { ForgingArena } from '@/screens/forging/ForgingArena';
import { ListNow } from '@/screens/forging/ListNow';
import { createContract } from '@/utils/utils';

const Forging = observer(() => {
  const { ownerEntities, entitiesForForging, getEntitiesForForging } = useContextState();
  const [step, setStep] = useState('one');
  const [isEntityListModalOpen, setIsEntityListModalOpen] = useState(false);
  const [generationFilter, setGenerationFilter] = useState('');
  const [isOwnerListOpen, setIsOwnerListOpen] = useState(false);
  const [selectedFromPool, setSelectedFromPool] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { walletProvider } = useWeb3ModalProvider();
  const [processingText, setProcessingText] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedForListing, setSelectedForListing] = useState(null);

  useEffect(() => {
    getEntitiesForForging();
  }, []);

  const handleSelectedFromPool = (entity) => setSelectedFromPool(entity);
  const handleSelectedFromWallet = (entity) => setSelectedEntity(entity);

  const handleEntityListModal = () => setIsEntityListModalOpen((prevState) => !prevState);
  const handleOwnerEntityList = () => setIsOwnerListOpen((prevState) => !prevState);
  const handleListingPage = () => setStep('two');

  const forgeEntity = async () => {
    setProcessing(true);
    setProcessingText('Forging');
    try {
      const forgeContract = await createContract(
        walletProvider,
        contractsConfig.entityMergingAddress,
        contractsConfig.entityMergingContractAbi
      );
      const transaction = await forgeContract.breedWithListed(selectedFromPool, selectedEntity);
      await transaction.wait();
      setProcessingText('Merging');
      setTimeout(() => {
        setProcessing(false);
        console.log('Process completed');
      }, 10000);
      console.log('Forged successfully');
    } catch (error) {
      console.error('Failed to Forge:', error);
    }
    setGenerationFilter('');
  };

  const ListEntityForForging = async (selectedForListing, fee) => {
    console.log("selected entity is:", selectedForListing);
    console.log("beginning forging");
    try {
      const forgeContract = await createContract(
        walletProvider,
        contractsConfig.entityMergingAddress,
        contractsConfig.entityMergingContractAbi
      );
      const transaction = await forgeContract.listForBreeding(
        selectedForListing,
        fee
      );
      await transaction.wait();
      console.log('Listed Successfully');
      handleStep('one');
    } catch (error) {
      console.error('Failed to List Entity:', error);
    }
  };

  let content;

  switch (step) {
    case 'one':
      content = (
        <div className={styles.forgingPage}>
          <div className={styles.forgeArenaContainer}>
            <div className="flex flex-row justify-center relative">
              <h1 className="text-[36px] md:text-extra-large">Forging Arena</h1>
              <Button2
                text="List for forging"
                bg="rgba(31, 15, 0,0.6)"
                borderColor="#FD8D26"
                className="absolute top-4 right-1"
                onClick={handleListingPage}
              />
            </div>
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
                onClick={forgeEntity}
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
                walletProvider={walletProvider}
                filterType="merger"
                handleSelectedFromWallet={handleSelectedFromWallet}
                generationFilter={generationFilter}
                setGenerationFilter={setGenerationFilter}
              />
            </Modal>
          )}
        </div>
      );
      break;
    case 'two':
      content = (
        <ListEntity
          closeModal={() => setStep('one')}
          ownerEntities={ownerEntities}
          walletProvider={walletProvider}
          setSelectedForListing={setSelectedForListing}
          handleStep={setStep}
        />
      );
      break;
    case 'three':
      content = (
        <ListNow 
          selectedForListing={selectedForListing} 
          ListEntityForForging={ListEntityForForging} 
          handleStep={setStep}
        />
      );
      break;
  }

  return <div className={styles.forgingPage}>{content}</div>;
});

export default Forging;
