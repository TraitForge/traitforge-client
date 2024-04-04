import React, { useState, useEffect } from 'react';
import styles from '@/styles/trading.module.scss';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { EntityCard, Modal } from '@/components'; 
import { useContextState } from '@/utils/context';
import { contractsConfig } from '@/utils/contractsConfig'; 

const Marketplace = () => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [filter, setFilter] = useState('All');
  const [ownerEntities, setOwnerEntities] = useState([]);
  const { walletProvider } = useWeb3ModalProvider();
  
  const {
    openModal,
    isOpen,
    getEntitiesForSale,
    entitiesForSale, 
    getOwnersEntities 
  } = useContextState();
    
  useEffect(() => {
    getEntitiesForSale();
    const loadOwnerEntities = async () => {
      const entities = await getOwnersEntities();
      setOwnerEntities(entities);
    };
    loadOwnerEntities().catch(console.error);
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




  const modalContent = (
    <div className={styles.entityDisplay}>
      <h1>SELL YOUR ENTITY</h1>
      <ul>
        {Array.isArray(ownerEntities) && ownerEntities.length > 0 ? (
          ownerEntities.map((entity, index) => (
            <EntityCard className={styles.entitycard} key={index}>
              {entity.name} - {entity.description}
            </EntityCard>
          ))
        ) : (
          <li>You don't own an Entity!</li>
        )}
      </ul>
    </div>
  );
  



  return (
    <div className={styles.tradingPage}>
      <div className={styles.marketPageContainer}>
        <div className={styles.tradingTopButtons}>
          <div className={styles.tradingfilters}>
            <button className={filter === 'All' ? styles.activeFilter : ''} onClick={() => handleFilterChange('All')}>All</button>
            <button className={filter === 'Forger' ? styles.activeFilter : ''} onClick={() => handleFilterChange('Forger')}>Forgers</button>
            <button className={filter === 'Merger' ? styles.activeFilter : ''} onClick={() => handleFilterChange('Merger')}>Mergers</button>
          </div> 
          <div className={styles.sellandfilterbutton}>
          <img
              src= "/images/sellButton.png"
              alt="sell place holder"
              className={styles.sellEntity}
              onClick={() => openModal()}
            />
            {isOpen && (
             <Modal background = '/images/marketplace-background.jpg'>
             {modalContent}
            </Modal>
            )}
          <select className={styles.tradeSortingDropdown} 
          onChange={(e) => setSortOption(e.target.value)}>
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
