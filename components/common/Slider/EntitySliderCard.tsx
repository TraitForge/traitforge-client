import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { EntityCardSkeleton } from '../EntityCardSkeleton';
import { calculateEntityAttributes, calculateUri } from '~/utils';
import { useIsSafari } from '~/hooks/useIsSafari';
import { useEthPrice } from '~/hooks';

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
  const isSafari = useIsSafari();
  const { data: ethPrice } = useEthPrice();
  const usdAmount = Number(price) * ethPrice;

  const { role, forgePotential, performanceFactor, nukeFactor } =
    calculateEntityAttributes(paddedEntropy);

  const wrapperClasses = classNames(
    'overflow-hidden border border-neon-blue rounded-[20px] px-4 py-5 bg-gradient-to-bl from-light-blue to-light-dark shadow-custom-blue',
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

  const imageUrl = `https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`;

  return (
    <div>
      {!isSafari && <EntityCardSkeleton className={skeletonClasses} />}
      <div className={wrapperClasses}>
        <div className="flex justify-between items-center">
          <p className="text-[10px] lg:text-base 3xl:text-[20px] py-2.5 px-[14px] bg-[#35FFE7] bg-opacity-20 rounded-xl">
            GEN{generation}
          </p>
          <p className="text-[20px]">{role}</p>
        </div>
        {showPrice && (
          <div className="flex items-center justify-between">
            <h4 className="flex-1 text-[24px] text-left py-5">{price} ETH</h4>
            <h4 className="flex-1 text-[24px] text-right truncate py-5">
              ${usdAmount.toLocaleString()}
            </h4>
          </div>
        )}
        <Image
          loading="lazy"
          src={imageUrl}
          alt="IMG"
          className="w-full rounded-xl max-h-[280px] object-cover"
          width={250}
          height={250}
          onLoad={e => {
            const { naturalWidth } = e.target as HTMLImageElement;
            setImgLoaded(!!naturalWidth);
          }}
        />
        <div className="mt-5 text-[21px] xl:text-[20px] grid grid-cols-3 text-left 2xl:gap-x-3">
          <div className="flex flex-col gap-2">
            <h1>{nukeFactor}%</h1>
            <span className="text-xs xl:text-sm">
              Nuke <br /> Factor
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h1>{forgePotential}</h1>
            <span className="text-xs xl:text-sm">Forge Potential</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1>{performanceFactor}</h1>
            <span className="text-xs xl:text-sm">Performance Factor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
