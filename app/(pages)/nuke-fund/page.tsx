'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import styles from '~/styles/honeypot.module.scss';
import { EntityCard, LoadingSpinner, RewardModal } from '~/components';
import { FiltersHeader } from '~/components';
import {
  useApproval,
  useApproveNft,
  useNukeEntity,
  useOwnerEntities,
  useIsNukeable
} from '~/hooks';
import { SingleValue } from 'react-select';
import { HoneyPotBody, HoneyPotHeader, NukeEntity, NukingReceipt } from '~/components/screens';
import { Entity } from '~/types';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import { publicClient } from '~/lib/client';

const HoneyPot = () => {
  const { address } = useAccount();
  const { data: ownerEntities, refetch } = useOwnerEntities(address || '0x0');
  const { data: isTokenNukeable} = useIsNukeable(ownerEntities);
  const [selectedForNuke, setSelectedForNuke] = useState<Entity | null>(null);
  const [ethFromNuke, setEthFromNuke] = useState<string | null>(null);
  const [step, setStep] = useState('one');
  const [sortOption, setSortOption] = useState('all');
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);

  const { data: approved } = useApproval(
    CONTRACT_ADDRESSES.NukeFund,
    selectedForNuke?.tokenId || 0
  );
  const {
    onWriteAsync: onApprove,
    isPending: isApprovePending,
    isConfirmed: isApproveConfirmed,
  } = useApproveNft();
  const {
    hash,
    onWriteAsync: onNuke,
    isPending: isNukePending,
    isConfirmed: isNukeConfirmed,
  } = useNukeEntity();

  const isLoading = isApprovePending || isNukePending;
  
  useEffect(() => {
    if (isNukeConfirmed) {
      refetch();
    }
  }, [isNukeConfirmed]);

  const handleFilterChange = (
    selectedOption: SingleValue<
      { value: number; label: string } | { value: string; label: string }
    >,
    type: string
  ) => {
    if (type === 'generation') {
      setGenerationFilter(String(selectedOption?.value || ''));
    } else if (type === 'sorting') {
      setSortingFilter(String(selectedOption?.value || ''));
    }
  };

  const filteredAndSortedListings = useMemo(() => {
    let filtered = ownerEntities.filter(listing => {
      if (
        generationFilter &&
        String(listing.generation) !== String(generationFilter)
      ) {
        return false;
      }

      if (sortOption === 'all') return true;
      if (sortOption === 'forgers') return listing.role === 'Forger';
      if (sortOption === 'mergers') return listing.role === 'Merger';
      return true;
    });

    if (sortingFilter === 'NukeFactor_low_to_high') {
      filtered.sort((a, b) => Number(a.nukeFactor) - Number(b.nukeFactor));
    } else if (sortingFilter === 'NukeFactor_high_to_low') {
      filtered.sort((a, b) => Number(b.nukeFactor) - Number(a.nukeFactor));
    }

    return filtered;
  }, [sortOption, generationFilter, sortingFilter, ownerEntities]);

  const nukeEntity = async () => {
    if (!selectedForNuke) {
      return;
    }
    setLoadingText('Nuking entity...');
    if (!approved) {
      onApprove(CONTRACT_ADDRESSES.NukeFund, selectedForNuke.tokenId);
    } else {
      onNuke(selectedForNuke.tokenId);
    }
  };

  const fetchTransactionReceipt = async (hash: string, publicClient: any) => {
    try {
      const res = await publicClient.getTransactionReceipt({ hash });
      if (res && res.logs && res.logs.length > 1 && res.logs[1]) {
        const logData = res.logs[1].data;
        const weiValue = BigInt(logData);
        const etherValue = formatUnits(weiValue, 18);
        return parseFloat(etherValue).toFixed(4);
      } else {
        throw new Error('Log data not found or not enough logs.');
      }
    } catch (error) {
      console.error('Failed to fetch transaction receipt:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    if (hash && isNukeConfirmed) {
      fetchTransactionReceipt(hash, publicClient)
        .then((ethFromNuke) => {
          setEthFromNuke(ethFromNuke);
          setModalOpen(true);
        })
        .catch((error) => {
          console.error('Failed to process transaction receipt:', error);
        });
    }
  }, [hash, isNukeConfirmed, publicClient]);

  useEffect(() => {
    if (selectedForNuke && isApproveConfirmed) {
      onNuke(selectedForNuke.tokenId);
    }
  }, [selectedForNuke, isApproveConfirmed]);

  if (isLoading)
    return (
      <div className="h-full w-full flex justify-center items-center flex-col">
        <LoadingSpinner color="#9457EB" />
        {loadingText && <p className="mt-3 text-[#9457EB]">{loadingText}</p>}
      </div>
    );

  let content;

  switch (step) {
    case 'three':
      content = selectedForNuke && (
        <NukeEntity
          selectedForNuke={selectedForNuke}
          nukeEntity={nukeEntity}
          handleStep={setStep}
        />
      );
      break;
    case 'two':
      content = (
        <div className="overflow-y-auto flex-1 bg-custom-radial">
          <div className="container">
            <FiltersHeader
              pageType="nuke"
              sortOption={sortOption}
              handleSort={setSortOption}
              color="purple"
              handleFilterChange={(selectedOption, type) =>
                handleFilterChange(selectedOption, type)
              }
              generationFilter={generationFilter}
              sortingFilter={sortingFilter}
            />
            <div className="grid mt-10 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-[15px] gap-y-3 md:gap-y-4">
            {filteredAndSortedListings.map(entity => {
              const canTokenBeNuked = isTokenNukeable[entity.tokenId];
              return (
                <EntityCard
                  key={entity.tokenId}
                  entity={entity}
                  isOwnedByUser={!canTokenBeNuked} 
                  onSelect={() => {
                  if (canTokenBeNuked) { 
                    setSelectedForNuke(entity);
                    setStep('three');
                  }
                  }}
                />
                );
                })}
            </div>
          </div>
        </div>
      );
      break;
    default:
      content = <HoneyPotBody handleStep={() => setStep('two')} />;
  }

  return (
    <div className={styles.honeyPotContainer}>
      <div className="flex flex-col h-full w-full">
      {selectedForNuke && ethFromNuke && (
         <RewardModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            modalClasses="pb-4"
            page="nuke"
         >
             <NukingReceipt
             tagColor="purple"
              entityJustNuked={selectedForNuke}
               ethNuked={ethFromNuke}
             />
          </RewardModal>
          )}
        <HoneyPotHeader step={step} handleStep={setStep} />
        {content}
      </div>
    </div>
  );
};

export default HoneyPot;
