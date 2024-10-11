'use client';

import { useState, useEffect } from 'react';
import { Button, Modal, LoadingSpinner, RewardModal } from '~/components';
import { calculateEntityAttributes } from '~/utils';
import { baseClient } from '~/lib/client';
import {
  useEntitiesForForging,
  useForgeWithListed,
  useListForForging,
  useOwnerEntities,
  useTokenEntropies,
  useTokenGenerations,
  useMintPrice,
} from '~/hooks';
import { useAccount } from 'wagmi';
import {
  ForgingArena,
  ListEntity,
  ListNow,
  SelectEntityList,
  WalletEntityModal,
  MobileForgingArena,
  ForgingReceipt,
} from '~/components/screens';
import { Entity, EntityForging } from '~/types';
import { parseEther } from 'viem';

const Forging = () => {
  const { address } = useAccount();
  const { data: mintPrice, refetch: refetchMintPrice } = useMintPrice();
<<<<<<< HEAD
  const { data: ownerEntities, refetch: refetchOwnerEntities } =
    useOwnerEntities(address || '0x0');
  const { data: entitiesForForging, refetch: refetchEntitiesForForging } =
    useEntitiesForForging(0, 1450);
  const {
    hash,
    onWriteAsync: onForge,
    isPending: isForgePending,
    isConfirmed: isForgeConfirmed,
  } = useForgeWithListed();
  const { onWriteAsync: onList, isPending: isListPending } =
    useListForForging();
=======
  const { data: ownerEntities, refetch: refetchOwnerEntities } = useOwnerEntities(address || '0x0');
  const { data: entitiesForForging, refetch: refetchEntitiesForForging } = useEntitiesForForging();
  const { hash, onWriteAsync: onForge, isPending: isForgePending, isConfirmed: isForgeConfirmed } = useForgeWithListed();
  const { onWriteAsync: onList, isPending: isListPending } = useListForForging();
>>>>>>> main
  const [step, setStep] = useState('one');
  const [isEntityListModalOpen, setIsEntityListModalOpen] = useState(false);
  const [isOwnerListOpen, setIsOwnerListOpen] = useState(false);
  const [selectedFromPool, setSelectedFromPool] =
    useState<EntityForging | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedForListing, setSelectedForListing] = useState<Entity | null>(
    null
  );
  const [areEntitiesForged, setEntitiesForged] = useState(false);
  const [processingText, setProcessingText] = useState('Forging');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoading = isForgePending || isListPending;
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');

  const [tokenID, setTokenID] = useState<number | null>(null);
  const { data: entityEntropyData, isFetching: isFetchingEntropy } =
    useTokenEntropies(tokenID ? [tokenID] : []);
  const { data: entityGenerationData, isFetching: isFetchingGeneration } =
    useTokenGenerations(tokenID ? [tokenID] : []);
  const [newlyCreatedEntity, setNewlyCreatedEntity] = useState<Entity | null>(
    null
  );

  const createNewEntity = (
    tokenID: number,
    entropy: number[],
    generation: number[]
  ) => {
    if (entropy.length > 0 && generation.length > 0) {
      const paddedEntropy = entropy.join('');
      const newGeneration = Number(generation[0]);
      const attributes = calculateEntityAttributes(paddedEntropy);
      return {
        tokenId: tokenID,
        paddedEntropy,
        generation: newGeneration,
        ...attributes,
      };
    }
    return null;
  };

  const handleSelectedFromPool = (entity: EntityForging) =>
    setSelectedFromPool(entity);
  const handleSelectedFromWallet = (entity: Entity) =>
    setSelectedEntity(entity);

  const handleEntityListModal = () =>
    setIsEntityListModalOpen(prevState => !prevState);
  const handleOwnerEntityList = () =>
    setIsOwnerListOpen(prevState => !prevState);
  const handleSortingFilter = (value: string) => setSortingFilter(value);
  const handleGenerationFilter = (value: string) => setGenerationFilter(value);

  const handleListingPage = () => setStep('two');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEntity(null);
    setSelectedFromPool(null);
  };

  const forgeEntity = async () => {
    if (!selectedFromPool || !selectedEntity) return;

    setProcessingText('Forging');
    const feeInWei = parseEther(String(selectedFromPool.fee));
    await onForge(selectedFromPool.tokenId, selectedEntity.tokenId, feeInWei);
    setEntitiesForged(true);
  };

  useEffect(() => {
    if (isForgeConfirmed) {
      setProcessingText('');
      refetchOwnerEntities();
      refetchEntitiesForForging();
    }
  }, [isForgeConfirmed]);

  useEffect(() => {
    if (hash && isForgeConfirmed) {
      (async () => {
        try {
          const res = await baseClient.getTransactionReceipt({ hash });
          if (res?.logs?.[1]?.topics?.[2]) {
            const hexString = res.logs[1].topics[2].toString();
            const tokenID = parseInt(hexString, 16);
            setTokenID(tokenID);
            if (!isFetchingEntropy && !isFetchingGeneration) {
              const newEntity = createNewEntity(
                tokenID,
                entityEntropyData,
                entityGenerationData
              );
              if (newEntity) {
                setNewlyCreatedEntity(newEntity);
                openModal();
              } else {
                console.error('Failed to create new entity.');
              }
            }
          } else {
            console.error('Log data not found or not enough logs.');
          }
        } catch (error) {
          console.error('Failed to fetch transaction receipt:', error);
        }
      })();
    }
  }, [hash, isForgeConfirmed, isFetchingEntropy, isFetchingGeneration]);

  const listEntityForForging = async (
    selectedForListing: Entity,
    fee: string
  ) => {
    setProcessingText('Listing entity');
    const feeInWei = parseEther(fee);
    await onList(selectedForListing.tokenId, feeInWei);
    refetchEntitiesForForging();
  };

  const isGenerationsDifferent =
    selectedEntity?.generation !== selectedFromPool?.generation;

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
        <div className="py-10 overflow-y-auto">
          <div className="h-full w-full">
            <div className="flex flex-col md:flex-row justify-center relative items-center">
              <h1 className="text-[36px] md:text-extra-large">Forging Arena</h1>
              <Button
                text="List for forging"
                bg="rgba(31, 15, 0,0.6)"
                variant="orange"
                onClick={handleListingPage}
                textClass="font-electrolize relative md:absolute md:top-1/2 md:-translate-y-1/2 !py-3 md:right-5 md:!px-10 !text-[18px] lg:!text-[24px] max-md:mt-5"
              />
            </div>
            <div className="py-7 md:py-10 3xl:py-20">
              <ForgingArena
                selectedFromPool={selectedFromPool}
                selectedFromWallet={selectedEntity}
                areEntitiesForged={areEntitiesForged}
                handleEntityListModal={handleEntityListModal}
                handleOwnerEntityList={handleOwnerEntityList}
              />
              <MobileForgingArena
                selectedFromPool={selectedFromPool}
                selectedFromWallet={selectedEntity}
                areEntitiesForged={areEntitiesForged}
                handleEntityListModal={handleEntityListModal}
                handleOwnerEntityList={handleOwnerEntityList}
              />
            </div>
            <div className="max-md:px-5 pb-6">
              <Button
                text={
                  isGenerationsDifferent
                    ? 'SAME GENERATION ONLY'
                    : 'FORGE ENTITY'
                }
                bg="rgba(31, 15, 0, 0.6)"
                width="408"
                height="92"
                variant={isGenerationsDifferent ? 'null' : 'orange'}
                textClass="md:!px-28 !py-2 capitalize !text-[18px] md:!text-[40px] pb-10"
                disabled={isGenerationsDifferent || isLoading}
                onClick={forgeEntity}
              />
            </div>
          </div>
          {isEntityListModalOpen && (
            <Modal
              isOpen={isEntityListModalOpen}
              closeModal={handleEntityListModal}
              modalClasses="items-end pb-4"
            >
              <SelectEntityList
                handleEntityListModal={handleEntityListModal}
                entitiesForForging={entitiesForForging}
                handleSelectedFromPool={handleSelectedFromPool}
                handleSortingFilter={handleSortingFilter}
                handleGenerationFilter={handleGenerationFilter}
                generationFilter={generationFilter}
                sortingFilter={sortingFilter}
              />
            </Modal>
          )}
          {isOwnerListOpen && (
            <Modal
              isOpen={isOwnerListOpen}
              closeModal={handleOwnerEntityList}
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
          entitiesForForging={entitiesForForging}
          setSelectedForListing={setSelectedForListing}
          handleStep={setStep}
        />
      );
      break;
    case 'three':
      content = selectedForListing && (
        <ListNow
          minimumForgeFee={mintPrice}
          selectedForListing={selectedForListing}
          listEntityForForging={listEntityForForging}
          handleStep={setStep}
        />
      );
      break;
  }

  return (
    <div
      className="mint-container h-full"
      style={{
        backgroundImage: "url('/images/forge-background.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {newlyCreatedEntity && selectedFromPool && address && (
        <RewardModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          modalClasses="pb-4"
          page="forging"
        >
          <ForgingReceipt
            tagColor="orange"
            offspring={newlyCreatedEntity}
            forgerOwner={selectedFromPool.account}
            mergerOwner={address}
          />
        </RewardModal>
      )}
      {content}
    </div>
  );
};

export default Forging;
