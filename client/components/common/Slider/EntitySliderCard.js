import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import blueBorder from '@/public/images/border.svg';
import { calculateEntityAttributes } from '@/utils/utils';
import styles from './styles.module.scss';

export const EntitySliderCard = ({
  entropy,
  price,
  wrapperClass,
  showPrice,
  currentGeneration
}) => {

  const paddedEntropy = entropy.toString().padStart(6, '0');
  const calculateUri = (paddedEntropy, currentGeneration) => {
    return `${paddedEntropy}_${currentGeneration}`;
  };
  const uri = calculateUri(paddedEntropy, currentGeneration);

  const { role, forgePotential, performanceFactor, nukeFactor } = calculateEntityAttributes(paddedEntropy);

  const wrapperClasses = classNames('mx-5', styles.cardContainer, wrapperClass);
  return (
    <div
      className={`${wrapperClasses} overflow-hidden items-center`}
      style={{
        backgroundImage: {blueBorder},
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
    >
      <div className="w-11/12 mb-4 h-full 3xl:px-10 3xl:pt-10">
        <Image
          loading="lazy"
          src={`https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`}
          alt="IMG"
          className="z-1"
          width={250}
          height={350}
        />
      </div>
      <div className="mt-5 mb-5 h-full text-center text-sm md:text-[18px]">
        <div className={styles.cardInfo}>
          {showPrice && <h4 className="">{price} ETH</h4>}
        </div>
        <h4 className="card-name">{role}</h4> 
        <h4 className="card-name">Forge Potential: {forgePotential}</h4>
        <h4 className="card-name">Nuke Factor: {nukeFactor} %</h4>
        <h4 className="card-name">Performance Factor: {performanceFactor}</h4>
      </div>
    </div>
  );
};
