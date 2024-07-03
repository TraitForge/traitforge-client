import { useState, useEffect } from 'react';
import { Button, Modal, LoadingSpinner } from '~/components';
import {
  useEntitiesForForging,
  useForgeWithListed,
  useListForForging,
  useOwnerEntities,
} from '~/hooks';
import { useAccount } from 'wagmi';
import {
  ForgingArena,
  ListEntity,
  ListNow,
  SelectEntityList,
  WalletEntityModal,
} from '~/components/screens';
import { Entity, EntityForging } from '~/types';
import { parseEther } from 'viem';

const Forging = () => {
  const { address } = useAccount();
  const { data: ownerEntities, refetch: refetchOwnerEntities } =
    useOwnerEntities(address || '0x0');
  const { data: entitiesForForging, refetch: refetchEntitiesForForging } =
    useEntitiesForForging();
  const {
    onWriteAsync: onForge,
    isPending: isForgePending,
    isConfirmed: isForgeConfirmed,
  } = useForgeWithListed();
  const { onWriteAsync: onList, isPending: isListPending } =
    useListForForging();

  const isLoading = isForgePending || isListPending;
  const [step, setStep] = useState('one');
  const [isEntityListModalOpen, setIsEntityListModalOpen] = useState(false);
  const [isOwnerListOpen, setIsOwnerListOpen] = useState(false);
  const [selectedFromPool, setSelectedFromPool] =
    useState<EntityForging | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedForListing, setSelectedForListing] = useState<Entity | null>(
    null
  );
  const [processingText, setProcessingText] = useState('Forging');
  const [generationFilter, setGenerationFilter] = useState('');

  const handleSelectedFromPool = (entity: EntityForging) =>
    setSelectedFromPool(entity);
  const handleSelectedFromWallet = (entity: Entity) =>
    setSelectedEntity(entity);

  const handleEntityListModal = () =>
    setIsEntityListModalOpen(prevState => !prevState);
  const handleOwnerEntityList = () =>
    setIsOwnerListOpen(prevState => !prevState);

  const handleListingPage = () => setStep('two');

  const forgeEntity = async () => {
    if (!selectedFromPool || !selectedEntity) {
      return;
    }
    setProcessingText('Forging');
    const feeInWei = parseEther(String(selectedFromPool.fee));
    onForge(selectedFromPool.tokenId, selectedEntity.tokenId, feeInWei);
  };

  useEffect(() => {
    if (isForgeConfirmed) {
      setProcessingText('');
      setGenerationFilter('');
      setSelectedEntity(null);
      setSelectedFromPool(null);
      refetchOwnerEntities();
      refetchEntitiesForForging();
    }
  }, [isForgeConfirmed]);

  const listEntityForForging = async (
    selectedForListing: Entity,
    fee: string
  ) => {
    setProcessingText('Listing entity');
    const feeInWei = parseEther(fee);
    onList(selectedForListing.tokenId, feeInWei);
  };

  let content;

  if (isLoading)
    return (
      <div className="h-full w-full flex justify-center items-center flex-col">
        <LoadingSpinner color="#FF5F1F" />
        {processingText && (
          <p className="text-[#FF5F1F] mt-4">{processingText}</p>
        )}
      </div>
    );

  switch (step) {
    case 'one':
      content = (
        <div className="max-md:h-full py-10 pt-5">
          <div className="h-full w-full">
            <div className="flex flex-col md:flex-row justify-center relative items-center">
              <h1 className="text-[36px] md:text-extra-large">Forging Arena</h1>
              <Button
                text="List for forging"
                bg="rgba(31, 15, 0,0.6)"
                width="200"
                height="90"
                borderColor="#FD8D26"
                className="relative md:absolute md:top-0 md:right-5"
                onClick={handleListingPage}
                textClass="font-electrolize"
              />
            </div>
            <div className="py-7 md:py-10 3xl:py-20">
              <ForgingArena
                selectedFromPool={selectedFromPool}
                selectedFromWallet={selectedEntity}
                handleEntityListModal={handleEntityListModal}
                handleOwnerEntityList={handleOwnerEntityList}
              />
            </div>
            <div className="max-md:px-5">
              <Button
                text="forge entity"
                bg="rgba(31, 15, 0,0.6)"
                borderColor="#FD8D26"
                width="408"
                height="92"
                disabled={isLoading}
                onClick={forgeEntity}
                textClass="font-bebas text-[48px]"
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
                handleEntityListModal={handleEntityListModal}
                entitiesForForging={entitiesForForging}
                handleSelectedFromPool={handleSelectedFromPool}
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
                handleOwnerEntityList={handleOwnerEntityList}
                handleSelectedFromWallet={handleSelectedFromWallet}
              />
            </Modal>
          )}
        </div>
      );
      break;
    case 'two':
      content = (
        <ListEntity
          ownerEntities={ownerEntities}
          setSelectedForListing={setSelectedForListing}
          handleStep={step => setStep(step)}
        />
      );
      break;
    case 'three':
      content = selectedForListing && (
        <ListNow
          selectedForListing={selectedForListing}
          listEntityForForging={listEntityForForging}
          handleStep={step => setStep(step)}
        />
      );
      break;
  }

  return (
    <div
      className="mint-container h-full overflow-auto"
      style={{
        backgroundImage: "url('/images/forge-background.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {content}
    </div>
  );
};

export default Forging;
