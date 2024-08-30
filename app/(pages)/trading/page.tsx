'use client';

import React, { useEffect, useState, useMemo } from 'react';
import styles from '~/styles/trading.module.scss';
import { EntityCard, LoadingSpinner } from '~/components';
import { FiltersHeader } from '~/components';
import { SingleValue } from 'react-select';
import { Entity, EntityTrading } from '~/types';
import {
  useApproval,
  useApproveNft,
  useBuyEntity,
  useEntitiesForSale,
  useListEntityForSale,
  useOwnerEntities,
} from '~/hooks';
import { useAccount } from 'wagmi';
import {
  BuyEntity,
  ListEntityTrading,
  SellEntity,
  TraidingHeader,
} from '~/components/screens';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import { parseEther } from 'viem';

const Marketplace = () => {
  const { address } = useAccount();
  const { data: ownerEntities, refetch: refetchOwnerEntities } =
    useOwnerEntities(address || '0x0');
  const { data: entitiesForSale, refetch: refetchEntitiesForSale } =
    useEntitiesForSale();
  const {
    onWriteAsync: onBuy,
    isPending: isBuyPending,
    isConfirmed: isBuyConfirmed,
  } = useBuyEntity();
  const {
    onWriteAsync: onList,
    isPending: isListPending,
    isConfirmed: isListConfirmed,
  } = useListEntityForSale();
  const {
    onWriteAsync: onApprove,
    isPending: isApprovePending,
    isConfirmed: isApproveConfirmed,
  } = useApproveNft();

  const isLoading = isBuyPending || isListPending || isApprovePending;

  const [selectedForSale, setSelectedForSale] = useState<Entity | null>(null);
  const [selectedListing, setSelectedListing] = useState<EntityTrading | null>(
    null
  );
  const [price, setPrice] = useState('');
  const [step, setStep] = useState('one');
  const [sortOption, setSortOption] = useState('all');
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');
  const [loadingText, setLoadingText] = useState('');

  const { data: approved } = useApproval(
    CONTRACT_ADDRESSES.EntityTrading,
    selectedForSale?.tokenId || 0
  );

  useEffect(() => {
    if (isBuyConfirmed || isListConfirmed) {
      refetchOwnerEntities();
      refetchEntitiesForSale();
    }
  }, [isBuyConfirmed, isListConfirmed]);

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
    let filtered = entitiesForSale.filter(listing => {
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

    if (sortingFilter === 'price_low_to_high') {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortingFilter === 'price_high_to_low') {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return filtered;
  }, [sortOption, generationFilter, sortingFilter, entitiesForSale]);

  const buyEntity = async () => {
    if (!selectedListing) {
      return;
    }
    setLoadingText('Buying entity...');
    const priceInWei = parseEther(String(selectedListing.price));
    onBuy(selectedListing.tokenId, priceInWei);
  };

  const listEntityForSale = async () => {
    if (!selectedForSale) {
      return;
    }
    setLoadingText('Listing entity...');
    if (!approved) {
      onApprove(CONTRACT_ADDRESSES.EntityTrading, selectedForSale.tokenId);
    } else {
      const priceInWei = parseEther(price);
      onList(selectedForSale.tokenId, priceInWei);
    }
  };

  useEffect(() => {
    if (selectedForSale && isApproveConfirmed) {
      const priceInWei = parseEther(price);
      onList(selectedForSale.tokenId, priceInWei);
    }
  }, [selectedForSale, isApproveConfirmed]);

  let content;

  if (isLoading)
    return (
      <div className="h-full w-full flex justify-center items-center flex-col">
        <LoadingSpinner color="#0EEB81" />
        {loadingText && <p className="text-[#0EEB81] mt-4">{loadingText}</p>}
      </div>
    );

  switch (step) {
    case 'four':
      content = selectedListing && (
        <BuyEntity
          handleStep={setStep}
          selectedListing={selectedListing}
          buyEntity={buyEntity}
        />
      );
      break;
    case 'three':
      content = selectedForSale && (
        <SellEntity
          handleStep={setStep}
          selectedForSale={selectedForSale}
          listEntityForSale={listEntityForSale}
          price={price}
          setPrice={setPrice}
        />
      );
      break;
    case 'two':
      content = (
        <ListEntityTrading
          ownerEntities={ownerEntities}
          handleStep={setStep}
          setSelectedForSale={setSelectedForSale}
        />
      );
      break;
    default:
      content = (
        <>
          <div className="container overflow-y-auto flex-1 border-t">
            <FiltersHeader
              sortOption={sortOption}
              handleSort={setSortOption}
              color="green"
              handleFilterChange={(selectedOption, type) =>
                handleFilterChange(selectedOption, type)
              }
              generationFilter={generationFilter}
              sortingFilter={sortingFilter}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-2 md:gap-x-[15px] mt-10 gap-y-3 lg:gap-y-10">
              {filteredAndSortedListings.map(entity => (
                <EntityCard
                  key={entity.tokenId}
                  entity={entity}
                  onSelect={() => {
                    setSelectedListing(entity);
                    setStep('four');
                  }}
                  showPrice
                  displayPrice={entity.price}
                />
              ))}
            </div>
          </div>
        </>
      );
  }

  return (
    <div className={styles.tradingPage}>
      <div className="flex flex-col h-full">
        <TraidingHeader handleStep={setStep} step={step} />
        {content}
      </div>
    </div>
  );
};

export default Marketplace;
