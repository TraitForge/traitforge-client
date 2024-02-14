import React, { useState, useEffect } from 'react';
import Modal from './TradingModal';
import '../styles/BuySell.css';
import { ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import tradeContractABI from '../artifacts/contracts/TradeEntities.sol/EntityTrading.json';

const tradeContractAddress = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82';

const BuySellPage = () => {
    const [selectedListing, setSelectedListing] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [listings, setListings] = useState([]);
    const { isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    useEffect(() => {
        if (!walletProvider) return;

        const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
        const contract = new ethers.Contract(tradeContractAddress, tradeContractABI.abi, ethersProvider);
        fetchListings(contract);
    }, [walletProvider]);

    const fetchListings = async (contract) => {
        try {
            const totalListings = await contract.listings(); 
            const listingData = [];

            for (let i = 0; i < totalListings; i++) {
                const listing = await contract.getListingDetails(i);
                if (listing.isActive) { 
                    listingData.push({
                        id: i,
                        seller: listing.seller,
                        price: ethers.utils.formatEther(listing.price),
                        gender: listing.gender, 
                        claimshare: listing.claimshare,
                        breedPotential: listing.breedPotential,
                    });
                }
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

        const handleListingSelection = (listing) => {
            setSelectedListing(listing);
        };




        return (
            <>
                <div className="buy-sell-page">
                    <button onClick={() => setModalOpen(true)}>Sell Your Entity</button>
                    <Modal onSave={handleSavedEntities} open={modalOpen} onClose={() => setModalOpen(false)} />
                </div>
                <div className="listings">
                    {listings.map(listing => (
                        <div key={listing.id} onClick={() => handleListingSelection(listing)}>
                            <p>Entity ID: {listing.id}</p>
                            <p>Price: {listing.price} ETH</p>
                            <p>ClaimShare%: {listing.claimshare}</p>
                            <p>Gender: {listing.gender}</p>
                            <p>BreedPotential: {listing.breedPotential}</p>
                        </div>
                    ))}
                </div>
                {selectedListing && (
                    <button onClick={() => buyEntity(selectedListing.id, selectedListing.price)}>
                        Buy Entity
                    </button>
                )}
            </>
        );
    };
    
    export default BuySellPage;