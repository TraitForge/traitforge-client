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
    'overflow-hidden border border-neon-blue rounded-[20px] px-4 py-4 bg-gradient-to-bl from-light-blue to-light-dark shadow-custom-blue',
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
          <h6 className="text-[15px] lg:text-lg 3xl:text-[20px] py-2.5 px-[14px] bg-[#35FFE7] bg-opacity-20 rounded-xl">
            GEN{generation}
          </h6>
          <h6 className="text-[20px]">{role}</h6>
        </div>
        {showPrice && (
          <div className="text-left py-5">
            <h4 className="text-[24px] truncate">
              ${usdAmount.toLocaleString()}
            </h4>
            <div className="text-[14px]">{price} ETH</div>
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
         <div className="relative pt-5 pb-5">
          <svg width="250" height="40" viewBox="0 0 296 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 0.25H0.25V1.75H1V0.25ZM118.5 1L119.013 0.453058L118.797 0.25H118.5V1ZM159 39L158.487 39.5469L158.703 39.75H159V39ZM1 1.75H118.5V0.25H1V1.75ZM117.987 1.54694L158.487 39.5469L159.513 38.4531L119.013 0.453058L117.987 1.54694ZM159 39.75H296V38.25H159V39.75Z" fill="url(#paint0_linear_1401_7592)"/>
            <defs>
              <linearGradient id="paint0_linear_1401_7592" x1="-50.6222" y1="-41.8827" x2="292.622" y2="61.8827" gradientUnits="userSpaceOnUse">
                <stop stop-color="#14494C"/>
                <stop offset="1" stop-color="#0ADFDB"/>
              </linearGradient>
            </defs>
          </svg>
  <div className="absolute top-0 left-0 mt-5 text-[21px] xl:text-[20px] grid grid-cols-2 2xl:gap-x-3">
    <div className="flex flex-col text-left pl-2 gap-1 pt-3">
      <h6 className="text-[11px]">Forge <br/> Potential</h6>
      <h6 className="text-2xl xl:text-xl">{forgePotential}</h6>
    </div>
    <div className="flex flex-col text-right pr-2 gap-2 pt-3">
      <h6 className="text-[11px]">Performance <br/> Factor</h6>
      <h6 className="text-2xl xl:text-xl">{performanceFactor}</h6>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};
