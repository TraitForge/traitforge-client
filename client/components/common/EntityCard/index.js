import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';
import classNames from 'classnames';
import orangeBorder from '@/public/images/orangeborder.svg';
import blueBorder from '@/public/images/border.svg';
import purpleBorder from '@/public/images/purpleBorder.svg';
import greenBorder from '@/public/images/greenBorder.svg';
import styles from './styles.module.scss';

export const EntityCard = ({ entity, onSelect, borderType = 'blue', wrapperClass, showPrice }) => {
  const calculateUri = (paddedEntropy, generation) => {
    return `${paddedEntropy}_${generation}`;
  };

  const { paddedEntropy, generation, role, forgePotential, performanceFactor, nukeFactor, price, fee } = entity;

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

  const wrapperClasses = classNames(
    'overflow-hidden items-center justify-center min-h-[300px] w-full 2xl:min-h-[350px] 3xl:min-h-[400px]',
    styles.cardContainer,
    wrapperClass
  );

  const borderStyles = {
    borderWidth: '15px', // Set the border width to match the border image slice value
    borderStyle: 'solid', // Ensure a border style is set
    borderColor: 'transparent', // To avoid conflicts with borderColor, set it to transparent
    borderImage: `url(${activeBorder.src}) 15 stretch`,
  };

  return (
    <div onClick={onSelect} className={wrapperClasses} style={borderStyles}>
      <div>
        <div className="mb-4">
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
          <div className="text-[14px] lg:text-base 3xl:text-[18px]">
            <h4>Forge Potential: {forgePotential}</h4>
            <h4>Nuke Factor: {nukeFactor} %</h4>
            <h4>Performance Factor: {performanceFactor}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
