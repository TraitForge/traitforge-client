import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import styles from './styles.module.scss';
import blueBorder from '~/public/images/border.svg';
import { EntityCardSkeleton } from '../EntityCardSkeleton';
import { calculateEntityAttributes, calculateUri } from '~/utils';

type EntitySliderCardTypes = {
  entropy: number;
  price: number | string;
  wrapperClass?: string;
  showPrice: boolean;
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

  const { role, forgePotential, performanceFactor, nukeFactor } =
    calculateEntityAttributes(paddedEntropy);

  const wrapperClasses = classNames(
    'overflow-hidden items-center w-full  min-h-[300px] 3xl:min-h-[400px]',
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
    borderWidth: '15px', // Set the border width to match the border image slice value
    borderStyle: 'solid', // Ensure a border style is set
    borderColor: 'transparent', // To avoid conflicts with borderColor, set it to transparent
    borderImage: `url("${blueBorder.src}") 15 stretch`,
  };

  const imageUrl = `https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`;

  const textClasses = classNames(
    'pt-5 pb-5 text-center text-sm md:text-[18px] bg-[#00181F] bg-opacity-80 w-full'
  );

  return (
    <div className="mx-4">
      <EntityCardSkeleton className={skeletonClasses} />
      <div className={wrapperClasses} style={borderStyles}>
        <div className="h-full w-full">
          <Image
            loading="lazy"
            src={imageUrl}
            alt="IMG"
            className="w-full max-h-[170px] md:max-h-[310px]"
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
            <h3 className="card-name mb-2"> GEN{currentGeneration}</h3>
            {showPrice && <h4 className="">{price} ETH</h4>}
          </div>
          <div className="text-[14px] md:text-base 3xl:text-[18px] !font-electrolize">
            <p>{role}</p>
            <p>Forge Potential: {forgePotential}</p>
            <p>Nuke Factor: {nukeFactor} %</p>
            <p>Performance Factor: {performanceFactor}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
