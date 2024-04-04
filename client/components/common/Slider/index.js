import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { LoadingSpinner, EntityCard } from '@/components';
import { useContextState } from '@/utils/context';
import styles from './styles.module.scss';

const Slider = () => {
  const { upcomingMints } = useContextState();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const splideRef = useRef();

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

  return (
    <div className={styles.sliderWrapper}>
      {upcomingMints.length === 0 && <LoadingSpinner />}
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
            <SplideSlide key={mint.id}>
              <EntityCard entity={mint} index={index} />
            </SplideSlide>
          ))}
        </Splide>
        <button
          onClick={() => splideRef.current?.splide?.go('<')}
          className={`custom-slider-arrow custom-slider-arrow-left ${isBeginning ? 'hide' : ''}`}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <button
          onClick={() => splideRef.current?.splide?.go('>')}
          className={`custom-slider-arrow custom-slider-arrow-right ${isEnd ? 'hide' : ''}`}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default Slider;
