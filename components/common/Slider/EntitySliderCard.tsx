import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { EntityCardSkeleton } from '../EntityCardSkeleton';
import { calculateEntityAttributes, calculateUri } from '~/utils';
import { useIsSafari } from '~/hooks/useIsSafari';
import { useEthPrice } from '~/hooks';
import { max } from 'lodash';

type EntitySliderCardTypes = {
  entropy: number;
  price?: number | string;
  wrapperClass?: string;
  showPrice?: boolean;
  currentGeneration: number;
};

export const EntitySliderCard = ({
  entropy,
  price,
  wrapperClass,
  showPrice,
  currentGeneration,
}: EntitySliderCardTypes) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const paddedEntropy = entropy.toString().padStart(6, '0');
  const generation = currentGeneration?.toString();
  const uri = calculateUri(paddedEntropy, generation);
  const isSafari = useIsSafari();
  const { data: ethPrice } = useEthPrice();
  const usdAmount = Math.floor(Number(price) * ethPrice);
  const isEMP = (Number(entropy) % 10) === 7;

  const { role, forgePotential, performanceFactor, nukeFactor, maxBidPotential } =
    calculateEntityAttributes(paddedEntropy);

  const wrapperClasses = classNames(
    'overflow-hidden border border-neon-blue rounded-[20px] px-4 pt-1.5 pb-3 bg-gradient-to-bl from-light-blue to-light-dark shadow-custom-blue',
    wrapperClass,
    {
      'opacity-1': imgLoaded,
      'opacity-0 h-0': !imgLoaded,
    }
  );

  const skeletonClasses = classNames({
    block: !imgLoaded,
    hidden: imgLoaded,
  });

  const imageUrl = `https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`;

  return (
    <div>
      {isSafari && <EntityCardSkeleton className={skeletonClasses} />}
      <div className={wrapperClasses}>
        <div className="flex justify-between items-center">
        <div className="relative w-full pt-2 md:pt-0">
          <div className="hidden md:block">
          <svg width="full" height="auto" viewBox="0 0 296 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 0.25H0.25V1.75H1V0.25ZM118.5 1L119.013 0.453058L118.797 0.25H118.5V1ZM159 39L158.487 39.5469L158.703 39.75H159V39ZM1 1.75H118.5V0.25H1V1.75ZM117.987 1.54694L158.487 39.5469L159.513 38.4531L119.013 0.453058L117.987 1.54694ZM159 39.75H296V38.25H159V39.75Z" fill="url(#paint0_linear_1401_7592)"/>
            <defs>
              <linearGradient id="paint0_linear_1401_7592" x1="-50.6222" y1="-41.8827" x2="292.622" y2="61.8827" gradientUnits="userSpaceOnUse">
                <stop stopColor="#14494C"/>
                <stop offset="1" stopColor="#0ADFDB"/>
              </linearGradient>
            </defs>
          </svg>
          </div>
          <div className="w-full text-[21px] xl:text-[20px] flex justify-between items-center md:absolute md:top-1 md:left-0">
        <h6 className="text-[15px] lg:text-lg 3xl:text-[20px] pl-1">
          GEN{generation}
        </h6>
          <h6 className="text-[16px] pt-1">{role}</h6>
        </div>
        </div>
        </div>
        {showPrice && (
          <div className="text-left py-2 flex flex-row gap-2">
            <h4 className="text-[24px]">{price} ETH</h4>
            <h4 className="text-[22px] truncate">
              ${usdAmount.toLocaleString()}
            </h4>
          </div>
        )}
        <div className="relative">
          <h6 className="absolute top-28 left-1 md:top-20 md:left-0 bg-opacity-80 text-sm px-2 py-1 rounded">
           {nukeFactor}%
          </h6>
          {isEMP && (
            <h6 className="absolute top-1 right-0 bg-opacity-80 text-sm rounded">
                <img src="/images/emp.svg" alt="EMP" className="inline-block w-[50px] h-[50px]" />
            </h6>
          )}
          <Image
            loading={window.innerWidth <= 768 ? "eager" : "lazy"}
            src={imageUrl}
            alt="IMG"
            className="w-full rounded-xl md:max-h-[250px] object-cover mt-1"
            width={250}
           height={250}
           onLoad={e => {
              const { naturalWidth } = e.target as HTMLImageElement;
              setImgLoaded(!!naturalWidth);
            }}
          />
        </div>
        <div className="relative pt-1 pb-8">
        <div className="w-full absolute top-0 left-0 pt-2 text-[21px] xl:text-[20px] grid grid-cols-3 gap-x-4">
          
            <div className="flex flex-col text-left items-center gap-1">
              <h6 className="text-[12px] lg:text-[17px] font-medium">FP:</h6>
              <h6 className="text-[12px] lg:text-[17px]">
                {forgePotential}
              </h6>
            </div>
          
            <div className="flex flex-col text-center items-center gap-1">
              <h6 className="text-[12px] lg:text-[17px] font-medium">BF:</h6>
              <h6 className="text-[12px] lg:text-[17px]">{maxBidPotential}</h6>
            </div>
          
            <div className="flex flex-col text-right items-center gap-1">
              <h6 className="text-[12px] lg:text-[17px] font-medium">PF:</h6>
              <h6 className="text-[12px] lg:text-[17px]">{performanceFactor}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};   
