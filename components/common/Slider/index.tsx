'use client';

import React, { useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import { EntitySliderCard } from './EntitySliderCard';
import { getEntityPrice } from '~/utils';
import { Entropy } from '~/types';
import { icons } from '~/components/icons';

type SliderTypes = {
  mintPrice: bigint;
  priceIncrement: bigint;
  currentGeneration: number;
  upcomingMints: Entropy[];
};

const Slider = ({
  mintPrice,
  priceIncrement,
  currentGeneration,
  upcomingMints,
}: SliderTypes) => {
  const [ref, setRef] = useState<SwiperClass | null>(null);

  const sliderOption = {
    loop: false,
    autoplay: {
      delay: 1000,
    },
    speed: 700,
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1.2,
        spaceBetween: 20,
        centeredSlides: true,
      },
      520: {
        slidesPerView: 2.2,
        spaceBetween: 15,
        centeredSlides: false,
      },
      // when window width is >= 640px
      769: {
        slidesPerView: 2,
        spaceBetween: 10,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 15,
        centeredSlides: false,
      },
      1224: {
        slidesPerView: 3,
        spaceBetween: 20,
        centeredSlides: false,
      },
      1440: {
        slidesPerView: 4,
        spaceBetween: 15,
        centeredSlides: false,
      },
    },
  };

  return (
    <div className="w-full md:w-[90%] md:mx-auto relative">
      <div className="md:px-10 lg:px-14 xl:px-[50px] w-90">
        <Swiper centeredSlides={true} {...sliderOption} onSwiper={setRef}>
          {upcomingMints.map((mint: any, index: number) => {
            const price = getEntityPrice(mintPrice, priceIncrement, index);
            return (
              <SwiperSlide key={mint.id}>
                <EntitySliderCard
                  currentGeneration={currentGeneration}
                  entropy={mint.entropy}
                  price={price}
                  showPrice
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <button
        onClick={() => ref?.slidePrev()}
        className={`custom-slider-arrow custom-slider-arrow-left hidden md:block px-6 py-5 rounded-md border border-neon-blue bg-[#023340] bg-opacity-80`}
      >
        {icons.arrow({ className: 'text-neon-blue' })}
      </button>
      <button
        onClick={() => ref?.slideNext()}
        className={`absolute top-1/2 right-0 custom-slider-arrow custom-slider-arrow-right hidden md:block px-6 py-5 rounded-md border border-neon-blue bg-[#023340] bg-opacity-80`}
      >
        {icons.arrow({ className: 'rotate-180 text-neon-blue' })}
      </button>
    </div>
  );
};

export default Slider;
