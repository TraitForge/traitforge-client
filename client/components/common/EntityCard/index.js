import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';
import classNames from 'classnames';
import orangeBorder from '@/public/images/orangeborder.svg';
import blueBorder from '@/public/images/border.svg';
import purpleBorder from '@/public/images/purpleBorder.svg';
import greenBorder from '@/public/images/greenBorder.svg';
import styles from './styles.module.scss';

export const EntityCard = ({
  entity,
  onSelect,
  borderType = 'blue',
  wrapperClass,
  showPrice,
}) => {
  const calculateUri = (paddedEntropy, generation) => {
    return `${paddedEntropy}_${generation}`;
  };

  const {
    paddedEntropy,
    generation,
    role,
    forgePotential,
    performanceFactor,
    nukeFactor,
    price,
    fee,
  } = entity;

  const displayPrice = price || (fee ? ethers.formatEther(fee) : null);

  const uri = calculateUri(paddedEntropy, generation);

  let activeBorder;
  switch (borderType) {
    case 'orange':
      activeBorder = orangeBorder;
      break;
    case 'purple':
      activeBorder = purpleBorder;
      break;
    case 'green':
      activeBorder = greenBorder;
      break;
    default:
      activeBorder = blueBorder;
  }

  const wrapperClasses = classNames(styles.cardContainer, wrapperClass);

  return (
    <div
      onClick={onSelect}
      className={`${wrapperClasses} overflow-hidden items-center justify-center min-h-[300px] w-full 3xl:min-h-[400px]`}
      style={{
        backgroundImage: `url("${activeBorder.src}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
    >
      <div>
        <div className="mb-4 max-md:w-[70%] w-[65%] 2xl:w-[80%] mx-auto pt-9 md:pt-3 2xl:pt-6">
          <Image
            loading="lazy"
            src={`https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`}
            alt="IMG"
            className="w-full"
            width={250}
            height={350}
          />
        </div>
        <div className="mt-5 mb-5 h-full text-center text-sm md:text-[18px]">
          <div className={styles.cardInfo}>
            <h1 className="card-name"> GEN{generation}</h1>
            {showPrice && <h4 className="">{displayPrice} ETH</h4>}
          </div>
          {role && <h4>{role}</h4>}
          <div className="text-[14px] lg:text-base">
            <h4>Forge Potential: {forgePotential}</h4>
            <h4>Nuke Factor: {nukeFactor} %</h4>
            <h4>Performance Factor: {performanceFactor}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
