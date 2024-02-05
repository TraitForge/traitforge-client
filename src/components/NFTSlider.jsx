import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import '../styles/NFTSlider.css';
import TFLogo from '../utils/TFLogo.png';

const dummyNfts = [
    { id: 1, image: TFLogo, gender: 'Sire', breeds: '9', claimshare: '9%', price: '0.01' },
    { id: 2, image: TFLogo, gender: 'Breeder', breeds: '1', claimshare: '5%', price: '0.02' },
    { id: 3, image: TFLogo, gender: 'Breeder', breeds: '12', claimshare: '18%', price: '0.03' },
    { id: 4, image: TFLogo, gender: 'Sire', breeds: '3', claimshare: '5%', price: '0.04' },
    { id: 5, image: TFLogo, gender: 'Sire', breeds: '8', claimshare: '25%', price: '0.05' },
    { id: 6, image: TFLogo, gender: 'Non-Binary', breeds: '2', claimshare: '14%', price: '0.06' },
    { id: 7, image: TFLogo, gender: 'Breeder', breeds: '4', claimshare: '20%', price: '0.07' },
];

const getNftItems = async () => {
    return dummyNfts;
};

const Card = ({ nft }) => {
    const isFirstCard = nft.id === 1;
    return (
        <div className='cards-container'>
        <div className={`card-container ${isFirstCard ? 'first-card' : ''}`}>
            <img src={nft.image} alt="NFT" className="card-image" />
            <div className='card-info'>
                <div className='card-info-always-visible'>
                    <h2 className="card-number">{nft.id}/10,000</h2>
                    <h1 className="card-price">Price: {nft.price} ETH</h1>
                </div>
                <div className='card-info-on-hover'>
                    <div className='footer-top-level'>
                        <h3> Gender: {nft.gender} </h3>
                        <h3 className="card-name">Breeds per Year: {nft.breeds}</h3>
                        <h2 className="card-parameters-h2">Claimshare:  {nft.claimshare}</h2>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};


const Slider = () => {
    const [nftItems, setNftItems] = useState([]);

    useEffect(() => {
        getNftItems().then(items => setNftItems(items));
    }, []);

    return (
        <div className="slider">
            {nftItems.length > 0 && (
                <>
                    <h1 className='slider-text-h1'>Available Entity</h1>
                    <FontAwesomeIcon className='slider-arrow' icon={faArrowDown} />
                </>
            )}
            <div className="cards-container">
                {nftItems.map((nft, index) => <Card key={nft.id} nft={nft} isFirst={index === 0} />)}
            </div>
        </div>
    );
};

export default Slider;