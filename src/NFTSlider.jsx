import React, { useState, useEffect } from 'react';
import './NFTSlider.css';
import TFLogo from './TFLogo.png';

const dummyNfts = [
    { id: 1, image: TFLogo, name: 'Entity 1', parameters: 'Parameters', price: '0.1' },
    { id: 2, image: TFLogo, name: 'Entity 2', parameters: 'Parameters', price: '0.2' },
    { id: 3, image: TFLogo, name: 'Entity 3', parameters: 'Parameters', price: '0.3' },
    { id: 4, image: TFLogo, name: 'Entity 4', parameters: 'Parameters', price: '0.4' },
    { id: 5, image: TFLogo, name: 'Entity 5', parameters: 'Parameters', price: '0.5' },
    { id: 6, image: TFLogo, name: 'Entity 6', parameters: 'Parameters', price: '0.6' },
    { id: 7, image: TFLogo, name: 'Entity 7', parameters: 'Parameters', price: '0.7' },
    { id: 8, image: TFLogo, name: 'Entity 8', parameters: 'Parameters', price: '0.8' },
    { id: 9, image: TFLogo, name: 'Entity 9', parameters: 'Parameters', price: '0.9' },
    { id: 10, image: TFLogo, name: 'Entity 10', parameters: 'Parameters', price: '0.10' },
    { id: 11, image: TFLogo, name: 'Entity 11', parameters: 'Parameters', price: '0.11' },
    { id: 12, image: TFLogo, name: 'Entity 12', parameters: 'Parameters', price: '0.12' },
    { id: 13, image: TFLogo, name: 'Entity 13', parameters: 'Parameters', price: '0.13' },
    { id: 14, image: TFLogo, name: 'Entity 14', parameters: 'Parameters', price: '0.14' },
    { id: 15, image: TFLogo, name: 'Entity 15', parameters: 'Parameters', price: '0.15' },
    { id: 16, image: TFLogo, name: 'Entity 16', parameters: 'Parameters', price: '0.16' },
    { id: 17, image: TFLogo, name: 'Entity 17', parameters: 'Parameters', price: '0.17' },
    { id: 18, image: TFLogo, name: 'Entity 18', parameters: 'Parameters', price: '0.18' },
];

const getNftItems = async () => {
    return dummyNfts;
};

const Card = ({ nft }) => {
    return (
        <div className="slider-container">
        <div className="card-container">
        <p className="card-price">Price: {nft.price} ETH</p>
            <img src={nft.image} alt="NFT" className="card-image" />
            <h3 className="card-name">{nft.name}</h3>
            <h2 className="card-parameters-h2">Parameters:</h2>
            <p className="params">  {nft.parameters}  </p>
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
        <div className="cards-container">
            {nftItems.length > 0 ? (
                nftItems.map(nft => <Card key={nft.id} nft={nft} />)
            ) : (
                <p>Cannot Load Entity Array Slider</p>
            )}
        </div>
    </div>
    );
};

export default Slider;
