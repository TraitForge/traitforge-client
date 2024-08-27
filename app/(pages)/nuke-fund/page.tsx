'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAccount } from 'wagmi';
import styles from '~/styles/honeypot.module.scss';
import { EntityCard, LoadingSpinner } from '~/components';
import { FiltersHeader } from '~/components';
import {
  useApproval,
  useApproveNft,
  useNukeEntity,
  useOwnerEntities,
  useIsNukeable
} from '~/hooks';
import { SingleValue } from 'react-select';
import { HoneyPotBody, HoneyPotHeader, NukeEntity } from '~/components/screens';
import { Entity } from '~/types';
import { CONTRACT_ADDRESSES } from '~/constants/address';

const HoneyPot = () => {
  const { address } = useAccount();
  const { data: ownerEntities, refetch } = useOwnerEntities(address || '0x0');
  const { data: isTokenNukeable} = useIsNukeable(ownerEntities);
  const [selectedForNuke, setSelectedForNuke] = useState<Entity | null>(null);
  const [step, setStep] = useState('one');
  const [sortOption, setSortOption] = useState('all');
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');
  const [loadingText, setLoadingText] = useState('');

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
    onWriteAsync: onNuke,
    isPending: isNukePending,
    isConfirmed: isNukeConfirmed,
  } = useNukeEntity();

  const isLoading = isApprovePending || isNukePending;
  
  useEffect(() => {
    if (isNukeConfirmed) {
      refetch();
      setSelectedForNuke(null);
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
                  isOwnedByUser={!canTokenBeNuked} // Set to true if the token cannot be nuked
                  onSelect={() => {
                  if (canTokenBeNuked) { // Allow selection only if the token can be nuked
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
        <HoneyPotHeader step={step} handleStep={setStep} />
        {content}
      </div>
    </div>
  );
};

export default HoneyPot;
