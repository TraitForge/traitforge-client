import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/EntitySlider.css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import EntropyGeneratorContractAbi from ''; 

const EntropyGeneratorContractAddress = '';
const totalSlots = 770;
const valuesPerSlot = 13;

const getEntityItems = async (walletProvider) => {
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const EntropyContract = new ethers.Contract(EntropyGeneratorContractAddress, EntropyGeneratorContractAbi.abi, ethersProvider);
    let allEntropies = [];
  
    for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
      const batchPromises = [];
      for (let numberIndex = 0; numberIndex < valuesPerSlot; numberIndex++) {
        batchPromises.push(EntropyContract.getPublicEntropy(slotIndex, numberIndex));
      }
  
      const batchResults = await Promise.allSettled(batchPromises);
      const processedBatch = batchResults.map((result) => {
        if (result.status === 'fulfilled') {
          return parseInt(result.value, 10);
        } else {
          console.error("Error fetching entropy:", result.reason);
          return 0; 
        }
      });
      allEntropies = [...allEntropies, ...processedBatch];
    }
    const trimmedEntropies = allEntropies.slice(0, -10);
    return trimmedEntropies.map((entropy, index) => ({
      id: index + 1, 
      entropy,
  }));
};


const calculateEntityPrice = (index) => {
    const pricePerEntity = 0.01; 
    const price = index * pricePerEntity;

    return price.toFixed(2); 
};

const Card = ({ entity }) => {
  const { role, forgePotential, nukeFactor, performanceFactor } = calculateEntityAttributes(entity.entropy);
  const entityPrice = calculateEntityPrice(index);
  return (
    <div className='card-container'>
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


const calculateEntityAttributes = (entropy) => {
  const performanceFactor = entropy % 10;
  const forgePotential = entropy % 100; 
  const nukeFactor = (entropy / 40000) * 100;
  const role = entropy % 3; 
  return { role, forgePotential, nukeFactor, performanceFactor };
};

const Slider = () => {
  const [entityItems, setEntityItems] = useState([]);
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
  if (walletProvider) {
  getEntityItems(walletProvider).then(setEntityItems);
  } else {
  console.error('Wallet provider is not available');
  }
  }, [walletProvider]);

  const splideRef = useRef();

  return (
    <div className="slider-container">
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
            {entityItems.map((entity) => (
              <SplideSlide key={entity.id}>
                <Card entity={entity} />
              </SplideSlide>
            ))}
          </Splide>
        )}
      </div>
      <div className="custom-arrows">
        <button onClick={() => splideRef.current.splide.go('<')} className="custom-arrow custom-arrow-left">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button onClick={() => splideRef.current.splide.go('>')} className="custom-arrow custom-arrow-right">
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default Slider;
