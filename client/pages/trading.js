import React, { useState, useEffect } from 'react';
import Modal from './TradingModal';
import '../styles/Trading.css';
import { ethers } from 'ethers';
import EntityCards from '@/EntityCards';
import { useContextState } from '@/context';
import { contractsConfig } from '@/contractsConfig'; 

const Marketplace = () => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [filter, setFilter] = useState('All');

  const {
    getEntitiesForSale,
    getOwnersEntities,
    walletProvider
  } = useContextState();
    
  useEffect(() => {
      getEntitiesForSale();
      getOwnersEntities();
  }, [ getEntitiesForSale, getOwnersEntities]);

const buyEntity = async (selectedListing) => {
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
      signer);
    const transaction = await tradeContract.buyEntity(selectedListing);
    await transaction.wait();
    alert("Entity purchased successfully!");
    } catch (error) {
     alert("Purchase failed. Please try again.");
}};


const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
};
    

const getSortedFilteredListings = () => {
    let filtered = listings.filter(listing => {
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
}};

const filteredAndSortedListings = getSortedFilteredListings();

return (
<div className='Trading-page'>
<div className='market-page-container'>
  <div className="Trading-top-buttons">
    <button className='sellEntity' onClick={() => setModalOpen(true)}>Sell Your Entity</button>
    <Modal open={modalOpen} onClose={() => setModalOpen(false)} />
    <div className="tradingfilters">
      <button className={filter === 'All' ? 'active-filter' : ''} onClick={() => handleFilterChange('All')}>All</button>
      <button className={filter === 'Forger' ? 'active-filter' : ''} onClick={() => handleFilterChange('Forger')}>Forgers</button>
      <button className={filter === 'Merger' ? 'active-filter' : ''} onClick={() => handleFilterChange('Merger')}>Mergers</button>
      <select className="sorting-dropdown" onChange={(e) => setSortOption(e.target.value)}>
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

       <div className="listings">
    {filteredAndSortedListings.map(listing => (
        <EntityCards 
            key={listing.tokenId} 
            entity={listing} 
            onSelect={() => setSelectedListing(listing)}
        />
    ))}
</div>

{selectedListing && (
     <button onClick={() => buyEntity(selectedListing.tokenId, selectedListing.price)}> Buy Entity </button>
)}
</div>
)};

export default Marketplace;
