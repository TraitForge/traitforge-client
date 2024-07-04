import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import orangeBorder from '~/public/images/orangeborder.svg';
import blueBorder from '~/public/images/border.svg';
import purpleBorder from '~/public/images/purpleBorder.svg';
import greenBorder from '~/public/images/greenBorder.svg';
import styles from './styles.module.scss';
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

  let activeBorder;
  switch (borderType) {
    case BorderType.ORANGE:
      activeBorder = orangeBorder;
      break;
    case BorderType.PURPLE:
      activeBorder = purpleBorder;
      break;
    case BorderType.GREEN:
      activeBorder = greenBorder;
      break;
    default:
      activeBorder = blueBorder;
  }

  const wrapperClasses = classNames(
    'overflow-hidden  w-full',
    styles.cardContainer,
    wrapperClass,
    {
      'opacity-1': imgLoaded,
      'opacity-0': !imgLoaded,
    }
  );

  const skeletonClasses = classNames({
    block: !imgLoaded,
    hidden: imgLoaded,
  });

  const borderStyles = {
    borderWidth: '12px', // Set the border width to match the border image slice value
    borderStyle: 'solid', // Ensure a border style is set
    borderColor: 'transparent', // To avoid conflicts with borderColor, set it to transparent
    borderImage: `url(${activeBorder.src}) 15 stretch`,
  };

  const priceClasses = classNames(
    'absolute top-2 text-xs md:text-lg rounded-md left-1/2 -translate-x-1/2 py-1 px-2',
    {
      'bg-neon-orange bg-opacity-60': asPath === '/forging',
      'bg-neon-green bg-opacity-60': asPath === '/trading',
      'bg-neon-purple bg-opacity-60': asPath === '/nuke-fund',
      'bg-neon-primary bg-opacity-60': asPath === '/',
    }
  );

  const textClasses = classNames(
    'lg:pt-4 lg:pb-4 text-center text-sm md:text-[18px]',
    {
      'bg-[#1F0F00] bg-opacity-80 border-t-2 border-neon-orange rounded-b-lg':
        asPath === '/forging',
      'bg-[#081E0E] bg-opacity-80 border-t-2 border-neon-green':
        asPath === '/trading',
      'bg-[#0C001F] bg-opacity-80 border-t-2 border-neon-purple ':
        asPath === '/nuke-fund',
    }
  );

  return (
    <div>
      <EntityCardSkeleton className={skeletonClasses} />
      <div onClick={onSelect} className={wrapperClasses} style={borderStyles}>
        <div>
          <div className="max-h-[170px] md:max-h-[310px] relative">
            {showPrice && <h4 className={priceClasses}>{displayPrice} ETH</h4>}
            <Image
              loading="lazy"
              src={`https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`}
              alt="IMG"
              className="w-full"
              width={250}
              height={250}
              onLoad={e => {
                const { naturalWidth } = e.target as HTMLImageElement;
                setImgLoaded(!!naturalWidth);
              }}
            />
          </div>
          <div className={textClasses}>
            <div className={styles.cardInfo}>
              <h4 className="text-lg md:text-2xl 3xl:text-3xl"> GEN{generation}</h4>
              {role && <h4 className='mb-1'>{role}</h4>}
            </div>
            <div className="text-xs md:text-md lg:text-base 3xl:text-[18px] w-full">
              <p>Forge Potential: {forgePotential}</p>
              <p>Nuke Factor: {nukeFactor} %</p>
              <p>Performance Factor: {performanceFactor}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
