import React, { useRef, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import EntropyGeneratorContractAbi from '../artifacts/contracts/EntropyGenerator.sol/EntropyGenerator.json';
import '../styles/EntitySlider.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Spinner from './Spinner';
import EntityCards from './EntityCards'; 

const EntropyGeneratorContractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
const totalSlots = 770;
const valuesPerSlot = 13;

const Slider = () => {
    const [entities, setEntities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const splideRef = useRef();

    useEffect(() => {
    const initializeEthersProvider = () => window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null;
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
    const entities = allEntropies.slice(0, 100).map((entropy, index) => ({
        id: index + 1,
        entropy,
    }));
    setEntities(entities);
    setIsLoading(false);
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
    }});
    });
    return () => {
    contract.removeAllListeners("Minted"); 
    }};
    subscribeToMintEvent();
    }, []); 

    useEffect(() => {
    const handleMoved = (splide, newIndex) => {
    setIsBeginning(newIndex === 0);
    setIsEnd(newIndex >= entities.length - splide.options.perPage);
    };
    if (splideRef.current && splideRef.current.splide) {
    const splideInstance = splideRef.current.splide;
    splideInstance.on('mounted move', () => handleMoved(splideInstance, splideInstance.index));
    handleMoved(splideInstance, splideInstance.index); 
    return () => splideInstance.off('mounted move', handleMoved);
    }}, [entities]);



    if (isLoading) return <Spinner />;

return (
    <div className="slider-wrapper">
        <div className="slider-container">
            <Splide
                ref={splideRef}
                options={{
                perPage: 5,
                rewind: true,
                gap: '0.4rem',
                pagination: false,
                arrows: false,
                breakpoints: {
                1350: { perPage: 5 },
                800: { perPage: 4 },
                500: { perPage: 3 },
                }}}
                >
                {entities.map((entity, index) => (
                    <SplideSlide key={entity.id}>
                    <EntityCards entity={entity} index={index} />
                    </SplideSlide>
                ))}
                    </Splide>
        <button
            onClick={() => splideRef.current?.splide?.go('<')}
            className={`custom-slider-arrow custom-slider-arrow-left ${isBeginning ? 'hide' : ''}`}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <button onClick={() => splideRef.current?.splide?.go('>')}
            className={`custom-slider-arrow custom-slider-arrow-right ${isEnd ? 'hide' : ''}`}>
            <FontAwesomeIcon icon={faArrowRight} />
        </button>
        </div>
</div>
)};

export default Slider;
