'use client';

import React, { useState } from 'react';
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
  const isSafari = useIsSafari();
  const asPath = usePathname();
  const { data: ethPrice } = useEthPrice();
  const usdAmount = Number(displayPrice ?? 0) * ethPrice;

  const uri = calculateUri(paddedEntropy, generation);


  const wrapperClasses = classNames(
    ' border-[1.33px] rounded-[20px] px-2 md:px-4 py-2 md:py-5 bg-gradient-to-bl to-light-dark',
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

  const skeletonClasses = classNames({
    block: !imgLoaded,
    hidden: imgLoaded,
  });

  const badgeClasses = classNames(
    'text-[10px] lg:text-base 3xl:text-[20px] py-2.5 px-[14px] bg-opacity-20 rounded-xl',
    {
      'bg-[#0EEB81]': asPath === '/trading',
      'bg-[#FD8D26]': asPath === '/forging',
      'bg-neon-purple': asPath === '/nuke-fund',
      'bg-neon-blue': asPath === '/profile',
    }
  );

  return (
    <div>
      {!isSafari && <EntityCardSkeleton className={skeletonClasses} />}
      <div className={wrapperClasses} onClick={onSelect}>
        <div className="flex justify-between items-center pb-3">
          <p className={badgeClasses}>GEN{generation}</p>
          <p className="text-[20px]">{role}</p>
        </div>
        {showPrice && (
          <div className="text-left">
            <h4 className="text-[24px] truncate">
              ${usdAmount.toLocaleString()}
            </h4>
            <div className="text-[16px]">{displayPrice} ETH</div>
          </div>
        )}
        <Image
          loading="lazy"
          src={`https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`}
          alt="IMG"
          className="w-full rounded-xl md:max-h-[250px] object-cover mt-3"
          width={250}
          height={250}
          onLoad={e => {
            const { naturalWidth } = e.target as HTMLImageElement;
            setImgLoaded(!!naturalWidth);
          }}
        />
        <div className="mt-3 text-base xl:text-[24px] flex max-xl:flex-wrap gap-y-2 md:gap-x-2 text-left 2xl:gap-x-3 overflow-hidden">
          <div className="flex flex-col gap-1 basis-1/3 flex-1">
            <h1>{nukeFactor}%</h1>
            <span className="text-xs md:text-sm ">
              Nuke <br /> Factor
            </span>
          </div>
          <div className="flex flex-col gap-1 basis-1/3 flex-1">
            <h1>
              {forgePotential - forgingCount}/{forgePotential}
            </h1>
            <span className="text-xs md:text-sm sm:pr-4 md:pr-0">
              Forge Potential
            </span>
          </div>
          <div className="flex flex-col gap-1 basis-1/3 flex-1">
            <h1>{performanceFactor}</h1>
            <span className="text-xs md:text-sm gap-2">Performance Factor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
