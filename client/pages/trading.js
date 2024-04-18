import React, { useState, useEffect, useMemo } from 'react';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';

import styles from '@/styles/trading.module.scss';
import { ethers } from 'ethers';
import { EntityCard } from '@/components';
import { appStore } from '@/utils/appStore';
import { observer } from 'mobx-react';
import { contractsConfig } from '@/utils/contractsConfig';
import { TraidingHeader } from '@/screens/traiding/TraidingHeader';
import { SellEntity } from '@/screens/traiding/SellEntity';
import { FiltersHeader } from '@/components';
import { MarketplaceEntityCard } from '@/screens/traiding/MarketplaceEntityCard';

const Marketplace = observer(() => {
  const [selectedForSale, setSelectedForSale] = useState(null);
  const [sortOption, setSortOption] = useState('all');
  const { walletProvider } = useWeb3ModalProvider();
  const [step, setStep] = useState('one');

  const { ownerEntities, entitiesForSale } = appStore;

  const handleSort = type => setSortOption(type);

  useEffect(() => {
    appStore.getEntitiesForSale();
    appStore.getOwnersEntities();
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
      if (sortOption === 'all') return true;
      if (sortOption === 'forger') return listing.isForger;
      if (sortOption === 'merger') return !listing.isForger;
      return false;
    });
    return filtered;
  }, [sortOption]);

  const handleStep = step => setStep(step);

  let content;

  switch (step) {
    case 'three':
      content = <SellEntity selectedForSale={selectedForSale} />;
      break;
    case 'two':
      content = (
        <div className="grid grid-cols-5 gap-x-[40px]">content goes here</div>
      );
      break;
    default:
      content = (
        <>
          <div className="flex justify-between items-center border-b mb-12">
            <FiltersHeader
              handleSort={handleSort}
              sortOption={sortOption}
              color="green"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-5 gap-x-[15px] gap-y-">
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
      <div className="container pt-[134px] flex flex-col h-full">
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
