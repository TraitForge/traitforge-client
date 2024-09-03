'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { EntityCardSkeleton } from '../EntityCardSkeleton';
import { Entity } from '~/types';
import { calculateUri } from '~/utils';
import { usePathname } from 'next/navigation';
import { useIsSafari } from '~/hooks/useIsSafari';
import { useEthPrice, useForgingCounts } from '~/hooks';

type EntityCardTypes = {
  entity: Entity;
  onSelect?: () => void;
  wrapperClass?: string;
  showPrice?: boolean;
  displayPrice?: string | number;
  isOwnedByUser?: boolean;
};

export const EntityCard = ({
  entity,
  onSelect,
  wrapperClass,
  showPrice,
  displayPrice,
  isOwnedByUser,
}: EntityCardTypes) => {
  const {
    tokenId,
    paddedEntropy,
    generation,
    role,
    forgePotential,
    performanceFactor,
    nukeFactor,
  } = entity;
  const { data: forgingCount } = useForgingCounts(tokenId);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [key, setKey] = useState<number>(0);
  const isSafari = useIsSafari();
  const asPath = usePathname();
  const { data: ethPrice } = useEthPrice();
  const usdAmount = Math.floor(Number(displayPrice) * ethPrice);

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2).replace(/\.0$/, '') + 'm';
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2).replace(/\.0$/, '') + 'm';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2).replace(/\.0$/, '') + 'k';
    }

    return num.toString();
  };

  const uri = calculateUri(paddedEntropy, generation);
  const imageUrl = `https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`;

  useEffect(() => {
    if (!imgLoaded) {
      const timer = setTimeout(() => {
        setKey(prevKey => prevKey + 1); 
      }, 5000);

      return () => clearTimeout(timer); 
    }
  }, [imgLoaded]);

  const wrapperClasses = classNames(
    ' border-[2.13px] rounded-[20px] px-2 md:px-4 pt-4 pb-5 md:pt-4 bg-gradient-to-bl to-light-dark',
    wrapperClass,
    {
      'opacity-1 h-full': imgLoaded,
      'opacity-0 h-0': !imgLoaded,
      'from-light-green border-neon-green shadow-custom-green':
        asPath === '/trading',
      'from-light-blue border-neon-blue shadow-custom-blue':
        asPath === '/profile',
      'from-light-orange border-neon-orange shadow-custom-forge':
        asPath === '/forging',
      'from-light-purple border-neon-purple shaow-custom-purple':
        asPath === '/nuke-fund',
      'bg-gray-800 opacity-50 pointer-events-none': isOwnedByUser,
      'cursor-pointer': onSelect,
    }
  );

  const gradientColors: { [key: string]: { from: string; to: string } } = {
    '/trading': { from: 'rgba(10, 150, 80, 0.59)', to: 'rgba(10, 150, 80, 0.89)' },
    '/profile': { from: 'rgba(20, 150, 130, 0.94)', to: 'rgba(20, 150, 130, 0.74)' }, 
    '/forging': { from: '#FF6600', to: '#FFCC00' },
    '/nuke-fund': { from: '#800080', to: '#FF00FF' },
  };

  const skeletonClasses = classNames({
    block: !imgLoaded,
    hidden: imgLoaded,
  });

  const currentColors = gradientColors[asPath] || gradientColors['/trading'];

  return (
    <div>
      {!isSafari && <EntityCardSkeleton className={skeletonClasses} />}
      <div className={wrapperClasses} onClick={onSelect}>
      <div className="flex justify-between items-center">
      <div className="relative w-full pt-2 md:pt-0">
          <div className="hidden md:block">
          <svg width="full" height="auto" viewBox="0 0 296 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 0.25H0.25V1.75H1V0.25ZM118.5 1L119.013 0.453058L118.797 0.25H118.5V1ZM159 39L158.487 39.5469L158.703 39.75H159V39ZM1 1.75H118.5V0.25H1V1.75ZM117.987 1.54694L158.487 39.5469L159.513 38.4531L119.013 0.453058L117.987 1.54694ZM159 39.75H296V38.25H159V39.75Z" fill="url(#paint0_linear_1401_7592)"/>
            <defs>
              <linearGradient id="paint0_linear_1401_7592" x1="-50.6222" y1="-41.8827" x2="292.622" y2="61.8827" gradientUnits="userSpaceOnUse">
                <stop stopColor={currentColors?.from || '#fff'}/>
                <stop offset="1" stopColor={currentColors?.to || '#fff'}/>
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
          <div className="pl-1 text-left py-1 flex flex-row gap-2">
            <h4 className="text-[14px] md:text-[24px]">{displayPrice} ETH</h4>
            <h4 className="text-[12px] md:text-[22px] truncate">
            ${formatNumber(usdAmount)}
            </h4>
          </div>
        )}
        <div className="relative">
          <h6 className="absolute top-20 left-0 bg-opacity-80 text- text-xs md:text-sm px-2 py-1 rounded">
           {nukeFactor}%
          </h6>
          <Image
            loading="lazy"
            src={`https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`}
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
        <div className="relative pt-1 pb-3">
        <svg width="full" height="auto" viewBox="0 0 296 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 0.25H0.25V1.75H1V0.25ZM118.5 1L119.013 0.453058L118.797 0.25H118.5V1ZM159 39L158.487 39.5469L158.703 39.75H159V39ZM1 1.75H118.5V0.25H1V1.75ZM117.987 1.54694L158.487 39.5469L159.513 38.4531L119.013 0.453058L117.987 1.54694ZM159 39.75H296V38.25H159V39.75Z" fill="url(#paint0_linear_1401_7592)"/>
        <defs>
          <linearGradient id="paint0_linear_1401_7592" x1="-50.6222" y1="-41.8827" x2="292.622" y2="61.8827" gradientUnits="userSpaceOnUse">
            <stop stopColor={currentColors?.from || '#000'} />
            <stop offset="1" stopColor={currentColors?.to || '#fff'} />
          </linearGradient>
        </defs>
      </svg>
         <div className="w-full absolute top-0 left-0 pt-[3px] text-[21px] xl:text-[20px] grid grid-cols-2 2xl:gap-x-3">
          <div className="flex flex-col text-left pl-2 gap-1 pt-2">
            <h6 className="text-[8px] lg:text-[11px]">Forge <br/> Potential</h6>
            <h6 className="text-base sm:text-xl">{forgePotential - forgingCount} / {forgePotential}</h6>
          </div>
          <div className="flex flex-col text-right pr-3 gap-2 pt-1 md:pt-2 lg:pt-2.5 xl:pt-[8px]">
            <h6 className="text-[8px] lg:text-[11px]">Performance <br/> Factor</h6>
            <h6 className="text-base sm:text-xl">{performanceFactor}</h6>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
