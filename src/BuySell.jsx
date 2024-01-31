import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Modal from './buysellModal';
import './BuySell.css';

import tradeContractABI from '/Users/hudsondungey/TFCREAM/updatedrepo/src/contracts/EntityTrading.json';
const tradeContractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";


const BuySellPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [entities, setEntities] = useState([]);
    const [listings, setListings] = useState([]);


    useEffect(() => {
        if (window.ethereum) {
            const web3 = new Web3(Web3.givenProvider);
            const tradeContract = new web3.eth.Contract(tradeContractABI.abi, tradeContractAddress);
            fetchEntities(tradeContract);
        } else {
            console.error("Cannot connect to Ethereum");
        }
    }, []);

    const fetchEntities = async (tradeContract) => {
    try {
    const entitiesForSale = await tradeContract.methods.getEntityListed().call();
      setEntities(entitiesForSale.map(entity => ({
            tokenId: entity.id,
            image: '',
            EntityType: entity.gender,
            generation: entity.generation,
            breedPotential: entity.breeds,
            
      })));
    } catch (error) {
        console.error("error fetching entities:", error);
    }
    };


    const handleSavedEntities = (listing) => {
        setListings(currentListings => [...currentListings, listings]);
    };

    return (
        <>
            <div className="buy-sell-page">
                <button onClick={() => setModalOpen(true)}>Sell Your Entity</button>
                <Modal Entities={entities} open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSavedEntities} />
            </div>
            <div>
                <h2>Current Listings</h2>
                <div className="cards-container2">
                    {entities.map(entity => (
                        <div key={entity.id} className="listing-cards">
                            <div className="cards-content">
                                <img className='cards-img' src={entity.image} alt={entity.name} />
                                <p>{entity.gender}</p>
                                <p>{entity.claimshare}</p>
                                <p className="cards-text">Price: {entity.price} ETH</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BuySellPage;


