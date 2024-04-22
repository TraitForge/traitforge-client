import React, { useState, useEffect, useMemo } from 'react';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { observer } from 'mobx-react';

import styles from '@/styles/trading.module.scss';
import { EntityCard } from '@/components';
import { appStore } from '@/utils/appStore';
import { contractsConfig } from '@/utils/contractsConfig';
import { useContextState } from '@/utils/context';
import { TraidingHeader } from '@/screens/traiding/TraidingHeader';
import { SellEntity } from '@/screens/traiding/SellEntity';
import { FiltersHeader } from '@/components';
// import { MarketplaceEntityCard } from '@/screens/traiding/MarketplaceEntityCard';

const Marketplace = observer(() => {
  const { ownerEntities, getOwnersEntities } = useContextState();
  const [selectedForSale, setSelectedForSale] = useState(null);
  const [sortOption, setSortOption] = useState('all');
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');

  const { walletProvider } = useWeb3ModalProvider();
  const [step, setStep] = useState('one');

  const { entitiesForSale } = appStore;

  const handleSort = type => setSortOption(type);

  const handleFilterChange = (selectedOption, type) => {
    if (type === 'generation') {
      setGenerationFilter(selectedOption.value);
    } else if (type === 'sorting') {
      setSortingFilter(selectedOption.value);
    }
  };

  useEffect(() => {
    getOwnersEntities();
    appStore.getEntitiesForSale();
  }, []);

  const buyEntity = async (tokenId, price) => {
    if (!walletProvider) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = ethersProvider.getSigner();
      const tradeContract = new ethers.Contract(
        contractsConfig.entityTradingContractAddress,
        contractsConfig.entityTradingAbi,
        signer
      );
      const transaction = await tradeContract.buyNFT(tokenId, price);
      await transaction.wait();
      alert('Entity purchased successfully!');
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const listEntityForSale = async (tokenId, price) => {
    if (!walletProvider) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = ethersProvider.getSigner();
      const tradeContract = new ethers.Contract(
        contractsConfig.entityTradingContractAddress,
        contractsConfig.entityTradingAbi,
        signer
      );
      const transaction = await tradeContract.listNFTForSale(tokenId, price);
      await transaction.wait();
      alert('Entity purchased successfully!');
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const filteredAndSortedListings = useMemo(() => {
    let filtered = entitiesForSale.filter(listing => {
      if (generationFilter && listing.generation !== generationFilter)
        return false;
      if (sortOption === 'all') return true;
      if (sortOption === 'forger') return listing.isForger;
      if (sortOption === 'merger') return !listing.isForger;
      return true;
    });
    if (sortingFilter === 'price_low_to_high') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortingFilter === 'price_high_to_low') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return filtered;
  }, [sortOption, generationFilter, sortingFilter, entitiesForSale]);

  const handleStep = step => setStep(step);

  let content;

  switch (step) {
    case 'three':
      content = <SellEntity selectedForSale={selectedForSale} />;
      break;
    case 'two':
      content = (
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 lg:gap-y-10">
          {ownerEntities.map(entity => (
                <EntityCard 
                key={entity.tokenId} 
                tokenId={entity.tokenId}
                entropy={entropy} 
                />
            ))}
        </div>
      );
      break;
    default:
      content = (
        <>
          <div className="flex justify-between items-center border-b mb-12">
            <FiltersHeader
              sortOption={sortOption}
              handleSort={handleSort}
              color="green"
              handleFilterChange={(selectedOption, type) =>
                handleFilterChange(selectedOption, type)
              }
              generationFilter={generationFilter}
              sortingFilter={sortingFilter}
            />
          </div>
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-col-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 lg:gap-y-10">
              {filteredAndSortedListings.map(listing => (
                <EntityCard
                  key={listing.tokenId}
                  entity={listing}
                  onSelect={() => setSelectedListing(listing)}
                />
              ))}
            </div>
          </div>
        </>
      );
  }

  return (
    <div className={styles.tradingPage}>
      <div className="container pt-16 md:pt-[134px] flex flex-col h-full">
        <TraidingHeader
          sortOption={sortOption}
          handleSort={handleSort}
          handleStep={handleStep}
          step={step}
        />
        {content}
      </div>
    </div>
  );
});

export default Marketplace;
