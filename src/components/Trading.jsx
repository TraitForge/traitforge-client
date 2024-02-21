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
        fetchListings(contract);
    }, [walletProvider, filter]); 

    const fetchListings = async (contract) => {
        try {
            const totalListings = await contract.totalListings(); 
            const listingData = [];

            for (let i = 0; i < totalListings.toNumber(); i++) {
                const listing = await contract.getListingDetails(i);
                listingData.push({
                    id: i,
                    seller: listing.seller,
                    price: ethers.utils.formatEther(listing.price),
                    gender: listing.gender,
                    claimshare: listing.claimshare,
                    breedPotential: listing.breedPotential,
                    isSire: listing.isSire,
                    agingSpeed: listing.agingSpeed,
                });
            }

            setListings(listingData);
        } catch (error) {
            console.error("Error fetching listings:", error);
        }
    };

    const handleSavedEntities = (newEntity) => {
        setListings(prevListings => [...prevListings, newEntity]);
    };
    
    const buyEntity = async (listingId, price) => {
        if (!isConnected || !walletProvider) {
            alert("Please connect your wallet first.");
            return;
        }
    
        try {
            const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
            const signer = ethersProvider.getSigner();
            const tradeContract = new ethers.Contract(tradeContractAddress, tradeContractABI.abi, signer);
    
            const transaction = await tradeContract.buyEntity(listingId, {
                value: ethers.utils.parseEther(price.toString())
            });
    
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
        let filtered = listings.filter(listing => {
            if (filter === 'All') return true;
            if (filter === 'Sire') return listing.isSire;
            if (filter === 'Breeder') return !listing.isSire;
            return false; 
        });

        switch (sortOption) {
            case 'highestClaimShare':
                return filtered.sort((a, b) => parseFloat(b.claimshare) - parseFloat(a.claimshare));
            case 'lowestClaimShare':
                return filtered.sort((a, b) => parseFloat(a.claimshare) - parseFloat(b.claimshare));
            case 'highestBreedPotential':
                return filtered.sort((a, b) => parseFloat(b.breedPotential) - parseFloat(a.breedPotential));
            case 'lowestBreedPotential':
                return filtered.sort((a, b) => parseFloat(a.breedPotential) - parseFloat(b.breedPotential));
            case 'highestAgingSpeed':
                return filtered.sort((a, b) => parseFloat(b.agingSpeed) - parseFloat(a.agingSpeed));
            case 'lowestAgingSpeed':
                return filtered.sort((a, b) => parseFloat(a.agingSpeed) - parseFloat(b.agingSpeed));
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
        <div className='Trading-page'>
            <div className="Trading-top-buttons">
                <button className='sellEntity' onClick={() => setModalOpen(true)}>Sell Your Entity</button>
            <Modal onSave={handleSavedEntities} open={modalOpen} onClose={() => setModalOpen(false)} />
            
                <h1 className='tradingfiltersh1'>Filter listings</h1>
                <div className="sorting-options">
                <select className="sorting-dropdown" onChange={(e) => setSortOption(e.target.value)}>
                        <option value="">Select Sorting Option</option>
                        <option value="highestPrice">Price high to low</option>
                        <option value="lowestPrice">Price low to high</option>
                        <option value="highestClaimShare">Nuke Factor highest</option>
                        <option value="lowestClaimShare">Nuke Factor lowest</option>
                        <option value="highestBreedPotential">Breed Potential highest</option>
                        <option value="lowestBreedPotential">Breed Potential lowest</option>
                        <option value="highestAgingSpeed">Aging Speed highest</option>
                        <option value="lowestAgingSpeed">Aging Speed lowest</option>
                    </select>
                </div>
                <div className="tradingfilters">
                    <button className={filter === 'All' ? 'active-filter' : ''} onClick={() => handleFilterChange('All')}>All</button>
                    <button className={filter === 'Sire' ? 'active-filter' : ''} onClick={() => handleFilterChange('Sire')}>Sires</button>
                    <button className={filter === 'Breeder' ? 'active-filter' : ''} onClick={() => handleFilterChange('Breeder')}>Breeders</button>
                </div>
            </div>
            <div className="listings">
                {filteredAndSortedListings.map(listing => (
                    <div key={listing.id} onClick={() => setSelectedListing(listing)}>
                        <p>Entity ID: {listing.id}</p>
                        <p>Price: {listing.price} ETH</p>
                        <p>NukeFactor%: {listing.claimshare}</p>
                        <p>Gender: {listing.gender}</p>
                        <p>BreedPotential: {listing.breedPotential}</p>
                        <p>Sire: {listing.isSire ? 'Yes' : 'No'}</p>
                    </div>
                ))}
            </div>
            {selectedListing && (
                <button onClick={() => buyEntity(selectedListing.id, selectedListing.price)}>
                    Buy Entity
                </button>
            )}
        </div>
    );
    
};

export default BuySellPage;