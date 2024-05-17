import React, { useState, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react';

import styles from '@/styles/trading.module.scss';
import { EntityCard } from '@/components';
import { contractsConfig } from '@/utils/contractsConfig';
import { useContextState } from '@/utils/context';
import { TraidingHeader } from '@/screens/traiding/TraidingHeader';
import { SellEntity } from '@/screens/traiding/SellEntity';
import { FiltersHeader } from '@/components';
import { createContract } from '@/utils/utils';
// import { MarketplaceEntityCard } from '@/screens/traiding/MarketplaceEntityCard';

const Marketplace = observer(() => {
  const { ownerEntities, entitiesForSale, getEntitiesForSale } =
    useContextState();
  const [selectedForSale, setSelectedForSale] = useState(null);
  const [sortOption, setSortOption] = useState('all');
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');
  const [step, setStep] = useState('one');

  const handleSort = type => setSortOption(type);

  const handleFilterChange = (selectedOption, type) => {
    if (type === 'generation') {
      setGenerationFilter(selectedOption.value);
    } else if (type === 'sorting') {
      setSortingFilter(selectedOption.value);
    }
  };

  useEffect(() => {
    getEntitiesForSale();
    console.log(entitiesForSale);
  }, []);

  const buyEntity = async (tokenId, price) => {
    if (!walletProvider) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      const tradeContract = await createContract(
        walletProvider,
        contractsConfig.entityTradingContractAddress,
        contractsConfig.entityTradingAbi
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
      const tradeContract = await createContract(
        walletProvider,
        contractsConfig.entityTradingContractAddress,
        contractsConfig.entityTradingAbi
      );
      const transaction = await tradeContract.listNFTForSale(tokenId, price);
      await transaction.wait();
      alert('Entity purchased successfully!');
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

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
              entropy={entity.entropy}
              entity={entity.tokenId}
              onSelect={() => setSelectedForSale(entity)}
            />
          ))}
        </div>
      );
      break;
    default:
      content = (
        <>
          <div className="flex justify-between items-center border-b mb-12">
          </div>
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-col-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 lg:gap-y-10">
              {entitiesForSale?.map(listing => (
                <EntityCard
                  key={listing.tokenId}
                  entity={listing.tokenId}
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
