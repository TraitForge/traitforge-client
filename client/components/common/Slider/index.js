import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Spinner from '../LoadingSpinner';
import EntityCard from '../EntityCard';
import { useContextState } from '@/utils/context';
import styles from './styles.module.scss';

const Slider = () => {
  const { upcomingMints , subscribeToMintEvent } =
    useContextState();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const splideRef = useRef();

  const calculateEntityPrice = (index) => {
    return (index * 0.01).toFixed(2);
};

function calculateEntityAttributes(entropy) {
  setIsLoading(true);
  const performanceFactor = entropy % 10;
  const lastTwoDigits = entropy % 100;
  const forgePotential = Math.floor(lastTwoDigits / 10);
  const nukeFactor = Number((entropy / 40000).toFixed(1));
  let role = entropy % 3 === 0 ? "sire" : "breeder";
  setIsLoading(false); 
  return { role, forgePotential, nukeFactor, performanceFactor };
}


  useEffect(() => {
    const handleMoved = (splide, newIndex) => {
      setIsBeginning(newIndex === 0);
      setIsEnd(newIndex >= upcomingMints.length - splide.options.perPage);
    };
    if (splideRef.current && splideRef.current.splide) {
      const splideInstance = splideRef.current.splide;
      splideInstance.on('mounted move', () =>
        handleMoved(splideInstance, splideInstance.index)
      );
      handleMoved(splideInstance, splideInstance.index);
      return () => splideInstance.off('mounted move', handleMoved);
    }
  }, [upcomingMints]);

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.sliderContainer}>
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
            },
          }}
        >
          {upcomingMints.map((mint, index) => (
         <SplideSlide key={entity.id}>
          <EntityCard entity={entity} index={index} />
        </SplideSlide>
          ))}
        </Splide>
        <button
          onClick={() => splideRef.current?.splide?.go('<')}
          className={`custom-slider-arrow custom-slider-arrow-left ${
            isBeginning ? 'hide' : ''
          }`}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <button
          onClick={() => splideRef.current?.splide?.go('>')}
          className={`custom-slider-arrow custom-slider-arrow-right ${
            isEnd ? 'hide' : ''
          }`}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default Slider;
