import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import { EntityCardSkeleton } from '../EntityCardSkeleton';
import { BorderType, Entity } from '~/types';
import { calculateUri } from '~/utils';

type EntityCardTypes = {
  entity: Entity;
  onSelect?: () => void;
  borderType?: BorderType;
  wrapperClass?: string;
  showPrice?: boolean;
  displayPrice?: string | number;
};

export const EntityCard = ({
  entity,
  onSelect,
  borderType = BorderType.BLUE,
  wrapperClass,
  showPrice,
  displayPrice,
}: EntityCardTypes) => {
  const {
    paddedEntropy,
    generation,
    role,
    forgePotential,
    performanceFactor,
    nukeFactor,
  } = entity;
  const [imgLoaded, setImgLoaded] = useState(false);
  const { asPath } = useRouter();

  const uri = calculateUri(paddedEntropy, generation);

  const wrapperClasses = classNames(
    'overflow-hidden border-[1.33px] rounded-[20px] px-4 py-5 bg-gradient-to-tr to-light-dark',
    wrapperClass,
    {
      'opacity-1': imgLoaded,
      'opacity-0': !imgLoaded,
      'from-light-green border-neon-green': asPath === '/trading',
      'from-neon-orange border-neon-orange': asPath === '/forging',
      'from-neon-purple border-neon-purple': asPath === '/nuke-fund',
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
    }
  );

  return (
    <div>
      <EntityCardSkeleton className={skeletonClasses} />
      <div className={wrapperClasses} onClick={onSelect}>
        <div className="flex justify-between items-center">
          <p className={badgeClasses}>GEN{generation}</p>
          <p className="text-[20px]">{role}</p>
        </div>
        {showPrice && (
          <h4 className="text-[24px] text-left py-5">{displayPrice} ETH</h4>
        )}
        <Image
          loading="lazy"
          src={`https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`}
          alt="IMG"
          className="w-full rounded-xl max-h-[280px] object-cover"
          width={250}
          height={250}
          onLoad={e => {
            const { naturalWidth } = e.target as HTMLImageElement;
            setImgLoaded(!!naturalWidth);
          }}
        />
        <div className="mt-5 text-[24px] grid grid-cols-3 text-left 2xl:gap-x-3">
          <div className="flex flex-col">
            <span className="text-[24px]">{nukeFactor}</span>
            <span className="text-base">
              Nuke <br /> Factor
            </span>
          </div>
          <div className="flex flex-col">
            <span>{forgePotential}</span>
            <span className="text-base">Forge Potential</span>
          </div>
          <div className="flex flex-col">
            <span>{performanceFactor}</span>
            <span className="text-base">Performance Factor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
