import React, { useState, useEffect, useMemo } from 'react';
import styles from '@/styles/trading.module.scss';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { EntityCard, Modal } from '@/components';
import { appStore } from '@/utils/appStore';
import { observer } from 'mobx-react';
import { contractsConfig } from '@/utils/contractsConfig';

const Marketplace = observer(() => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedForSale, setSelectedForSale] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [filter, setFilter] = useState('All');
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const { walletProvider } = useWeb3ModalProvider();
  const [isOpen, setIsOpen] = useState(false);

  const { entitiesForSale, ownerEntities } = appStore;

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

  const handleFilterChange = newFilter => {
    setFilter(newFilter);
  };

  const filteredAndSortedListings = useMemo(() => {
    let filtered = entitiesForSale.filter(listing => {
      if (filter === 'All') return true;
      if (filter === 'Forger') return listing.isForger;
      if (filter === 'Merger') return !listing.isForger;
      return false;
    });

    switch (sortOption) {
      case 'highestNukeFactor':
        return filtered.sort(
          (a, b) => parseFloat(b.nukefactor) - parseFloat(a.nukefactor)
        );
      case 'lowestNukeFactor':
        return filtered.sort(
          (a, b) => parseFloat(a.nukefactor) - parseFloat(b.nukefactor)
        );
      case 'highestForgePotential':
        return filtered.sort(
          (a, b) => parseFloat(b.forgePotential) - parseFloat(a.forgePotential)
        );
      case 'lowestForgePotential':
        return filtered.sort(
          (a, b) => parseFloat(a.forgePotential) - parseFloat(b.forgePotential)
        );
      case 'highestPerformanceFactor':
        return filtered.sort(
          (a, b) =>
            parseFloat(b.performanceFactor) - parseFloat(a.performanceFactor)
        );
      case 'lowestPerformanceFactor':
        return filtered.sort(
          (a, b) =>
            parseFloat(a.performanceFactor) - parseFloat(b.performanceFactor)
        );
      case 'highestPrice':
        return filtered.sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price)
        );
      case 'lowestPrice':
        return filtered.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );
      default:
        return filtered;
    }
  }, [entitiesForSale, filter, sortOption]);

  const openListModal = () => {
    setIsListModalOpen(true);
  };
  const closeListModal = () => {
    setIsListModalOpen(false);
  };

  const listModal = () => {
    if (!isListModalOpen) return null;
    return (
      <div style={styles.listmodalcontainer}>
        <button onClick={closeListModal}>Close</button>
        <div style={styles.listmodalinput}>
          <h2>set a price for your entity</h2>
          <input type="number" step="0.0001" placeholder="Enter price in ETH" />
        </div>
        <EntityCard key={selectedListing.tokenId} entity={selectedListing} />
        <img
          src="/images/sellButton.png"
          alt="sell place holder"
          onClick={() => listEntityForSale(selectedForSale)}
          disabled={processing}
        />
      </div>
    );
  };

  const modalContent = (
    <div className={styles.entityDisplay}>
      <h1>SELL YOUR ENTITY</h1>
      <ul>
        {Array.isArray(ownerEntities) && ownerEntities.length > 0 ? (
          ownerEntities.map((entity, index) => (
            <EntityCard
              entity={entity}
              key={index}
              onSelect={() => {
                setSelectedForSale(entity);
                openListModal();
              }}
            />
          ))
        ) : (
          <li>You don't own an Entity!</li>
        )}
      </ul>
      {isListModalOpen && listModal()}
    </div>
  );

  return (
    <div className={styles.tradingPage}>
      <div className={styles.marketPageContainer}>
        <div className={styles.tradingTopButtons}>
          <div className={styles.tradingfilters}>
            <button
              className={filter === 'All' ? styles.activeFilter : ''}
              onClick={() => handleFilterChange('All')}
            >
              All
            </button>
            <button
              className={filter === 'Forger' ? styles.activeFilter : ''}
              onClick={() => handleFilterChange('Forger')}
            >
              Forgers
            </button>
            <button
              className={filter === 'Merger' ? styles.activeFilter : ''}
              onClick={() => handleFilterChange('Merger')}
            >
              Mergers
            </button>
          </div>
          <div className={styles.sellandfilterbutton}>
            <img
              src="/images/sellButton.png"
              alt="sell place holder"
              className={styles.sellEntity}
              onClick={() => setIsOpen(true)}
            />
            {isOpen && (
              <Modal background="/images/marketplace-background.jpg">
                {modalContent}
              </Modal>
            )}
            <select
              className={styles.tradeSortingDropdown}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="">Select Sorting Option</option>
              <option value="highestPrice">Price high to low</option>
              <option value="lowestPrice">Price low to high</option>
              <option value="highestNukeFactor">Nuke Factor highest</option>
              <option value="lowestNukeFactor">Nuke Factor lowest</option>
              <option value="highestForgePotential">
                Forge Potential highest
              </option>
              <option value="lowestForgePotential">
                Forge Potential lowest
              </option>
              <option value="highestPerformanceFactor">
                Performance Factor Speed highest
              </option>
              <option value="lowestPerformanceFactor">
                Performance Factor lowest
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.listings}>
        {filteredAndSortedListings.map(listing => (
          <EntityCard
            key={listing.tokenId}
            entity={listing}
            onSelect={() => setSelectedListing(listing)}
          />
        ))}
      </div>

      {selectedListing && (
        <button
          className={styles.buyButton}
          onClick={() =>
            buyEntity(selectedListing.tokenId, selectedListing.price)
          }
          disabled={processing}
        >
          {' '}
          Buy Entity{' '}
        </button>
      )}
    </div>
  );
});

export default Marketplace;
