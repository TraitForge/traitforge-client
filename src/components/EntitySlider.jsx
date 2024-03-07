import React, { useRef, useEffect, createContext, useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Traitforger from '../utils/traitforgertransparent.png';
import '../styles/EntitySlider.css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { ethers } from 'ethers';
import Spinner from './Spinner';
import EntropyGeneratorContractAbi from '../artifacts/contracts/EntropyGenerator.sol/EntropyGenerator.json';
import customERC721Abi from '../artifacts/contracts/CustomERC721.sol/CustomERC721.json';

const customERC721Address = '0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2';
const EntropyGeneratorContractAddress = '0x51A1ceB83B83F1985a81C295d1fF28Afef186E02';
const totalSlots = 770; //change later
const valuesPerSlot = 13;

const EntityContext = createContext();

export const useEntities = () => useContext(EntityContext);

const calculateEntityPrice = (index) => {
    return (index * 0.01).toFixed(2);
};

function calculateEntityAttributes(entropy) {
    const performanceFactor = entropy % 10;
    const lastTwoDigits = entropy % 100;
    const forgePotential = Math.floor(lastTwoDigits / 10);
    const nukeFactor = Number((entropy / 40000).toFixed(1));
    let role; 
    const result = entropy % 3;
    if (result === 0) {
        role = "sire"; 
    } else {
        role = "breeder"; 
    }
    
    return { role, forgePotential, nukeFactor, performanceFactor };
}

const Card = ({ entity, index }) => {
    const { role, forgePotential, nukeFactor, performanceFactor } = calculateEntityAttributes(entity.entropy);
    const entityPrice = calculateEntityPrice(index);
    return (
        <div className='card-container'>
            <img loading="lazy" src={Traitforger} alt="Entity" className='card-image' />
            <div className='card-info'>
                <div className='card-info-always-visible'>
                    <h2 className="card-number">{entity.id}/10,000</h2>
                    <h1 className="card-price">Price: {entityPrice} ETH</h1>
                </div>
                <div className='card-info-on-hover'>
                    <div className='footer-top-level'>
                        <h3 className='card-type'>Role: {role}</h3>
                        <h3 className="card-name">Forge Potential: {forgePotential}</h3>
                        <h2 className="card-parameters-h2">Nuke Factor: {nukeFactor} %</h2>
                        <h2 className="card-parameters-h2">Performance Factor: {performanceFactor}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Slider = () => {
    const [entityItems, setEntityItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const splideRef = useRef();

    const initializeEthersProvider = () => {
        if (window.ethereum) {
            try {
                return new ethers.providers.Web3Provider(window.ethereum);
            } catch (error) {
                console.error("Failed to create a Web3Provider:", error);
            }
        } else {
            console.warn("Ethereum object (window.ethereum) not found. This application requires an Ethereum browser extension like MetaMask.");
            return null;
        }
    };
   
    useEffect(() => {
        const getEntityItems = async () => {
            const ethersProvider = initializeEthersProvider();
            if (!ethersProvider) return;
            setIsLoading(true);

            const contract = new ethers.Contract(EntropyGeneratorContractAddress, EntropyGeneratorContractAbi.abi, ethersProvider);
            let allEntropies = [];

            for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
                const batchPromises = [];
                for (let numberIndex = 0; numberIndex < valuesPerSlot; numberIndex++) {
                    batchPromises.push(contract.getPublicEntropy(slotIndex, numberIndex));
                }

                const batchResults = await Promise.allSettled(batchPromises);
                const processedBatch = batchResults.map(result => result.status === 'fulfilled' ? parseInt(result.value, 10) : 0);
                allEntropies = [...allEntropies, ...processedBatch];
            }

            const entities = allEntropies.slice(0, 150).map((entropy, index) => ({
                id: index + 1,
                entropy,
            }));
            setIsLoading(false);
            setEntityItems(entities);
        };

        getEntityItems();
    }, []);

    useEffect(() => {
        const subscribeToMintEvent = async () => {
            const ethersProvider = initializeEthersProvider();
            if (!ethersProvider) return;

            const contract = new ethers.Contract(customERC721Address, customERC721Abi.abi, ethersProvider.getSigner());
    
            contract.on("Minted", (to, newItemId, entropyValue) => {
                setEntityItems(prevItems => {
                    if (prevItems.length >= 150) {
                        const updatedItems = [...prevItems.slice(1), { id: newItemId, entropy: entropyValue }];
                        return updatedItems;
                    } else {
                        return [...prevItems, { id: newItemId, entropy: entropyValue }];
                    }
                });
            });
    
            return () => {
                contract.removeAllListeners("Minted"); 
            };
        };
    
        subscribeToMintEvent();
    }, []); 
    

    useEffect(() => {
        if (splideRef.current && splideRef.current.splide) {
        }
    }, [entityItems]);

    return (
        <EntityContext.Provider value={entityItems}>
            <div className={`slider-container ${isLoading ? 'loading' : ''}`}>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="slider">
                            {entityItems.length > 0 && (
                                <Splide
                                    ref={splideRef}
                                    options={{
                                        perPage: 8,
                                        rewind: true,
                                        gap: '0.5rem',
                                        pagination: false,
                                        arrows: false,
                                        breakpoints: {
                                            1350: { perPage: 6 },
                                            800: { perPage: 4 },
                                            500: { perPage: 3 },
                                        },
                                    }}
                                >
                                    {entityItems.map((entity, index) => (
                                        <SplideSlide key={entity.id}>
                                            <Card entity={entity} index={index + 1} />
                                        </SplideSlide>
                                    ))}
                                </Splide>
                            )}
                        </div>
                        <div className="custom-arrows">
                            <button onClick={() => splideRef.current?.splide?.go('<')} className="custom-arrow custom-arrow-left">
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <button onClick={() => splideRef.current?.splide?.go('>')} className="custom-arrow custom-arrow-right">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </EntityContext.Provider>
    );
};

export default Slider;
