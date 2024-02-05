import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Modal from './TradingModal';
import '../styles/BuySell.css';

import tradeContractABI from '../contracts/EntityTrading.json';
const tradeContractAddress = "0x3155a7Db77C5a08103132b1915AF86fd6cD8B863";

const BuySellPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [listings, setListings] = useState([]);

    const localProvider = 'https://goerli.infura.io/v3/3f27d7e6326b43c5b77e16ac62188640';

    useEffect(() => {
        const web3 = new Web3(new Web3.providers.HttpProvider(localProvider));
        const contract = new web3.eth.Contract(tradeContractABI.abi, tradeContractAddress);
        fetchListings(contract);
    }, []);

    const fetchListings = async (contract) => {
        try {
            const totalListings = await contract.methods.listings().call(); 
            const listingData = [];

            for (let i = 0; i < totalListings; i++) {
                const listing = await contract.methods.getListingDetails(i).call();
                if (listing.isActive) { 
                    listingData.push({
                        id: i,
                        seller: listing.seller,
                        price: listing.price,
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

    const handleSavedEntities = (newListing) => {
        setListings(currentListings => [...currentListings, newListing]);
    };

    return (
        <>
            <div className="buy-sell-page">
                <button onClick={() => setModalOpen(true)}>Sell Your Entity</button>
                <Modal onSave={handleSavedEntities} open={modalOpen} onClose={() => setModalOpen(false)} />
            </div>
            <div>
                <h2>Current Listings</h2>
                <div className="cards-container2">
                    {listings.map((listing, index) => (
                        <div key={index} className="listing-cards">
                            <div className="cards-content">
                                <p>Seller: {listing.seller}</p>
                                <p>Price: {listing.price} ETH</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BuySellPage;
