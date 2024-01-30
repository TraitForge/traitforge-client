import React, { useState } from 'react';
import Modal from './buysellModal';
import nfts from './Entity-data';
import './BuySell.css';

const BuySellPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [listings, setListings] = useState([]);

    const handleSavePrice = (listing) => {
        setListings(currentListings => [...currentListings, listing]);
    };

    return (
        <>
            <div className="buy-sell-page">
                <button onClick={() => setModalOpen(true)}>Sell Your Entity</button>
                <Modal nfts={nfts} open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSavePrice} />
            </div>
            <div>
                <h2>Current Listings</h2>
                <div className="cards-container2">
                    {listings.map(listing => (
                        <div key={listing.id} className="listing-cards">
                            <div className="cards-content">
                                <img className='cards-img' src={listing.image} alt={listing.name} />
                                <p>{listing.gender}</p>
                                <p>{listing.claimshare}</p>
                                <p className="cards-text">Price: {listing.price} ETH</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BuySellPage;


