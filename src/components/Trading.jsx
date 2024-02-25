import React, { useState, useEffect } from 'react';
import Modal from './TradingModal';
import '../styles/Trading.css';
import { ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import tradeContractABI from '../artifacts/contracts/TradeEntities.sol/EntityTrading.json';

const tradeContractAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';

const BuySellPage = () => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [filter, setFilter] = useState('All');
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

useEffect(() => {
  if (!walletProvider) return;
  const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
  const contract = new ethers.Contract(tradeContractAddress, tradeContractABI.abi, ethersProvider);
  entitiesForSale(contract);
}, [walletProvider, filter]); 


const entitiesForSale = async (contract) => {
  try {
  const totalListings = await contract.entitiesForSale(); 
  const listingData = [];
  for (let tokenId = 0; tokenId < totalListings.toNumber(); tokenId++) {
  const listing = await contract.calculateAttributes(tokenId);
    listingData.push({
    tokenId: listing.tokenId.toString(),
    seller: listing.seller,
    price: ethers.utils.formatEther(listing.price),
    isForger: listing.isForger,
    performanceFactor: listing.performanceFactor.toString(),
    nukefactor: listing.nukeFactor.toString(),
    forgePotential: listing.forgePotential.toString(),
    });
  } setListings(listingData);
} catch (error) {
console.error("Error fetching listings:", error);
}};
    

const buyEntity = async (selectedListing) => {
    if (!isConnected || !walletProvider) {
    alert("Please connect your wallet first.");
    return;
    }
    try {
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = ethersProvider.getSigner();
    const tradeContract = new ethers.Contract(tradeContractAddress, tradeContractABI.abi, signer);
    
    const transaction = await tradeContract.buyEntity(selectedListing, {
        value: ethers.utils.parseEther(selectedListing.price.toString())
    });
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
    <div className="Trading-top-buttons">
    <button className='sellEntity' onClick={() => setModalOpen(true)}>Sell Your Entity</button>
    <Modal open={modalOpen} onClose={() => setModalOpen(false)} />
            
    <h1 className='tradingfiltersh1'>Filter listings</h1>
    <div className="sorting-options">
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


    <div className="tradingfilters">
        <button className={filter === 'All' ? 'active-filter' : ''} onClick={() => handleFilterChange('All')}>All</button>
        <button className={filter === 'Forger' ? 'active-filter' : ''} onClick={() => handleFilterChange('Forger')}>Forgers</button>
        <button className={filter === 'Merger' ? 'active-filter' : ''} onClick={() => handleFilterChange('Merger')}>Mergers</button>
    </div>
    </div>

    <div className="listings">
    {filteredAndSortedListings.map(listing => (
        <div key={listing.tokenId} onClick={() => setSelectedListing(listing)}>
        <p>Entity ID: {listing.tokenId}</p>
        <p>Price: {listing.price} ETH</p>
        <p>NukeFactor%: {listing.nukefactor}</p>
        <p>forgePotential: {listing.forgePotential}</p>
        <p>Forger: {listing.isForger ? 'Yes' : 'No'}</p>
    </div>
 ))}
</div>
{selectedListing && (
     <button onClick={() => buyEntity(selectedListing.tokenId, selectedListing.price)}> Buy Entity </button>
)}
</div>
)};

export default BuySellPage;