import React, { useState, useMemo, useEffect } from 'react';
import styles from '~/styles/honeypot.module.scss';
import { EntityCard, LoadingSpinner } from '~/components';
import { FiltersHeader } from '~/components';
import { useAccount } from 'wagmi';
import {
  useApproval,
  useApproveNft,
  useNukeEntity,
  useOwnerEntities,
} from '~/hooks';
import { SingleValue } from 'react-select';
import { HoneyPotBody, HoneyPotHeader, NukeEntity } from '~/components/screens';
import { BorderType, Entity } from '~/types';
import { CONTRACT_ADDRESSES } from '~/constants/address';

const HoneyPot = () => {
  const { address } = useAccount();
  const { data: ownerEntities, refetch } = useOwnerEntities(address || '0x0');

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
      <div className="h-full w-full flex justify-center items-center">
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
        <div className="overflow-y-scroll flex-1">
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
          <div className="grid mt-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-3 md:gap-y-10">
            {filteredAndSortedListings.map(entity => (
              <EntityCard
                key={entity.tokenId}
                entity={entity}
                borderType={BorderType.PURPLE}
                onSelect={() => {
                  setSelectedForNuke(entity);
                  setStep('three');
                }}
              />
            ))}
          </div>
        </div>
      );
      break;
    default:
      content = <HoneyPotBody handleStep={() => setStep('two')} />;
  }

  return (
    <div className={styles.honeyPotContainer}>
      <div className="container flex flex-col h-full ">
        <HoneyPotHeader step={step} handleStep={setStep} />
        {content}
      </div>
    </div>
  );
};

export default HoneyPot;
