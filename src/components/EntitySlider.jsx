import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/EntitySlider.css';
import Traitforger from '../utils/traitforgertransparent.png';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import mintContractAbi from '../artifacts/contracts/Mint.sol/Mint.json';

const mintContractAddress = '0x91680735BBb6243a001Be4c5c8d19AB2E846e00a';

const dummyEntities = [
    { id: 1, image: Traitforger, type: 'Forger', forgefactor: '9', nukefactor: '9%', price: '0.01', performancefactor: '20%' },
    { id: 2, image: Traitforger, type: 'Merger', forgefactor: '1', nukefactor: '5%', price: '0.02', performancefactor: '2%' },
    { id: 3, image: Traitforger, type: 'Merger', forgefactor: '12', nukefactor: '18%', price: '0.03', performancefactor: '12%' },
    { id: 4, image: Traitforger, type: 'Forger', forgefactor: '3', nukefactor: '5%', price: '0.04', performancefactor: '40%' },
    { id: 5, image: Traitforger, type: 'Merger', forgefactor: '8', nukefactor: '25%', price: '0.05', performancefactor: '11%' },
    { id: 6, image: Traitforger, type: 'Merger', forgefactor: '2', nukefactor: '14%', price: '0.06', performancefactor: '5%' },
    { id: 7, image: Traitforger, type: 'Merger', forgefactor: '4', nukefactor: '20%', price: '0.07', performancefactor: '6%' },
    { id: 8, image: Traitforger, type: 'Forger', forgefactor: '9', nukefactor: '9%', price: '0.08', performancefactor: '32%' },
    { id: 9, image: Traitforger, type: 'Forger', forgefactor: '1', nukefactor: '5%', price: '0.09', performancefactor: '12%' },
    { id: 10, image: Traitforger, type: 'Merger', forgefactor: '12', nukefactor: '18%', price: '0.10', performancefactor: '7%' },
    { id: 11, image: Traitforger, type: 'Forger', forgefactor: '3', nukefactor: '5%', price: '0.11', performancefactor: '18%' },
    { id: 12, image: Traitforger, type: 'Merger', forgefactor: '8', nukefactor: '25%', price: '0.12', performancefactor: '21%' },
    { id: 13, image: Traitforger, type: 'Merger', forgefactor: '2', nukefactor: '14%', price: '0.13', performancefactor: '1%' },
    { id: 14, image: Traitforger, type: 'Merger', forgefactor: '4', nukefactor: '20%', price: '0.14', performancefactor: '11%' },
];

const getEntityItems = async () => {
    return dummyEntities;
};

const Card = ({ entity }) => {
    const isFirstCard = entity.id === 1;
    return (
        <div className='cards-container'>
            <div className={`card-container ${isFirstCard ? 'first-card' : ''}`}>
                <img src={entity.image} alt="Entity" className="card-image" />
                <div className='card-info'>
                    <div className='card-info-always-visible'>
                        <h2 className="card-number">{entity.id}/10,000</h2>
                        <h1 className="card-price">Price: {entity.price} ETH</h1>
                    </div>
                    <div className='card-info-on-hover'>
                        <div className='footer-top-level'>
                            <h3 className='card-type'> Type: {entity.type} </h3>
                            <h3 className="card-name">Forge Potential: {entity.forgefactor}</h3>
                            <h2 className="card-parameters-h2">Nuke Factor: {entity.nukefactor}</h2>
                            <h2 className="card-parameters-h2"> Performance Factor: {entity.performancefactor}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Slider = () => {
    const [entityItems, setEntityItems] = useState([]);
    const { walletProvider } = useWeb3ModalProvider();

    useEffect(() => {
        getEntityItems().then(items => setEntityItems(items));

        if (!walletProvider) {
            console.error('Wallet provider is not available');
            return;
        }

        const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
        const signer = ethersProvider.getSigner();
        const contract = new ethers.Contract(mintContractAddress, mintContractAbi.abi, signer);

        const onMintEvent = (minter, tokenId, currentPrice, generation, event) => {
            console.log(`New token minted: ${tokenId.toString()}`);
        };

        contract.on("MintEvent", onMintEvent);

        return () => {
            contract.removeAllListeners("MintEvent");
        };
    }, [walletProvider]); 

    const SliderWithCustomArrows = () => {
        const splideRef = useRef();
    
        const handlePrev = () => {
            splideRef.current.splide.go('<');
        };
    
        const handleNext = () => {
            splideRef.current.splide.go('>');
        };

        return (
            <div className="slider-container">
                <div className="slider">
                    {entityItems.length > 0 && (
                        <>
                            <Splide
                                ref={splideRef}
                                options={{
                                    perPage: 8,
                                    rewind: true,
                                    gap: '0.5rem',
                                    pagination: false, 
                                    arrows: false, 
                                    breakpoints: {
                                        1350: {
                                            perPage: 6,
                                        },
                                        800: {
                                            perPage: 4,
                                        },
                                        500: { 
                                            perPage: 3, 
                                        }
                                    }
                                }}
                            >
                                {entityItems.map(entity => (
                                    <SplideSlide key={entity.id}>
                                        <Card entity={entity} />
                                    </SplideSlide>
                                ))}
                            </Splide>
                        </>
                    )}
                </div>
                <div className="custom-arrows">
                    <button onClick={handlePrev} className="custom-arrow custom-arrow-left">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <button onClick={handleNext} className="custom-arrow custom-arrow-right">
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </div>
        );
    };

    return <SliderWithCustomArrows />;
};

export default Slider;
