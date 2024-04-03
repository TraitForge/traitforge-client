import React, { useState, useEffect } from 'react';
import styles from '@/styles/trading.module.scss';
import { ethers } from 'ethers';
import { EntityCard } from '@/components'; 
import { useContextState } from '@/utils/context';
import { contractsConfig } from '@/utils/contractsConfig'; 

const Marketplace = () => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [filter, setFilter] = useState('All');

  const {
    openModal,
    getEntitiesForSale,
    entitiesForSale, 
    getOwnersEntities,
    walletProvider
  } = useContextState();
    
  useEffect(() => {
    getEntitiesForSale();
    getOwnersEntities();
  }, [getEntitiesForSale, getOwnersEntities]);

  const buyEntity = async (tokenId, price) => {
    if (!walletProvider) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const tradeContract = new ethers.Contract(
        contractsConfig.tradeContractAddress,
        contractsConfig.tradeContractAbi.abi, 
        signer
      );
      const transaction = await tradeContract.buyEntity(tokenId, price);
      await transaction.wait();
      alert("Entity purchased successfully!");
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getSortedFilteredListings = () => {
    let filtered = entitiesForSale.filter(listing => {
      if (filter === 'All') return true;
      if (filter === 'Forger') return listing.isForger;
      if (filter === 'Merger') return !listing.isForger;
      return false;
    });

    switch (sortOption) {
      case 'highestNukeFactor':
        return filtered.sort((a, b) => parseFloat(b.nukefactor) - parseFloat(a.nukefactor));
      case 'lowestNukeFactor':
        return filtered.sort((a, b) => parseFloat(a.nukefactor) - parseFloat(b.nukefactor));
      case 'highestForgePotential':
        return filtered.sort((a, b) => parseFloat(b.forgePotential) - parseFloat(a.forgePotential));
      case 'lowestForgePotential':
        return filtered.sort((a, b) => parseFloat(a.forgePotential) - parseFloat(b.forgePotential));
      case 'highestPerformanceFactor':
        return filtered.sort((a, b) => parseFloat(b.performanceFactor) - parseFloat(a.performanceFactor));
      case 'lowestPerformanceFactor':
        return filtered.sort((a, b) => parseFloat(a.performanceFactor) - parseFloat(b.performanceFactor));
      case 'highestPrice':
        return filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'lowestPrice':
        return filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      default:
        return filtered;
    }
  };

  const filteredAndSortedListings = getSortedFilteredListings();

  return (
    <div className={styles.tradingPage}>
      <div className={styles.marketPageContainer}>
        <div className={styles.tradingTopButtons}>
          <button className={styles.sellEntity} onClick={() => openModal(<div>*trading modal*</div>)}>Sell Your Entity</button>
          <div className={styles.tradingfilters}>
            <button className={filter === 'All' ? styles.activeFilter : ''} onClick={() => handleFilterChange('All')}>All</button>
            <button className={filter === 'Forger' ? styles.activeFilter : ''} onClick={() => handleFilterChange('Forger')}>Forgers</button>
            <button className={filter === 'Merger' ? styles.activeFilter : ''} onClick={() => handleFilterChange('Merger')}>Mergers</button>
            <select className={styles.sortingDropdown} onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Select Sorting Option</option>
              <option value="highestPrice">Price high to low</option>
              <option value="lowestPrice">Price low to high</option>
              <option value="highestNukeFactor">Nuke Factor highest</option>
              <option value="lowestNukeFactor">Nuke Factor lowest</option>
              <option value="highestForgePotential">Forge Potential highest</option>
              <option value="lowestForgePotential">Forge Potential lowest</option>
              <option value="highestPerformanceFactor">Performance Factor Speed highest</option>
              <option value="lowestPerformanceFactor">Performance Factor lowest</option>
            </select>
          </div> 
        </div>
      </div>

      <div className={styles.listings}>
        {filteredAndSortedListings.map((listing) => (
          <EntityCard 
              key={listing.tokenId} 
              entity={listing} 
              onSelect={() => setSelectedListing(listing)}
          />
        ))}
      </div>

      {selectedListing && (
        <button className={styles.buyButton} onClick={() => buyEntity(selectedListing.tokenId, selectedListing.price)}> Buy Entity </button>
      )}
    </div>
  );
};

export default Marketplace;
