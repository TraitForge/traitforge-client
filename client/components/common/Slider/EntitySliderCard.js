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
  currentGeneration,
}) => {
  const paddedEntropy = entropy.toString().padStart(6, '0');
  const generation = currentGeneration?.toString();
  const calculateUri = (paddedEntropy, generation) => {
    return `${paddedEntropy}_${generation}`;
  };
  const uri = calculateUri(paddedEntropy, generation);

  const { role, forgePotential, performanceFactor, nukeFactor } =
    calculateEntityAttributes(paddedEntropy);

  const wrapperClasses = classNames('mx-5', styles.cardContainer, wrapperClass);

  return (
    <div
      className={`${wrapperClasses} overflow-hidden items-center min-h-[300px] w-full 3xl:min-h-[400px]`}
      style={{
        backgroundImage: `url("${blueBorder.src}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        zIndex: 10,
      }}
    >
      <div className="mb-4 w-[70%] sm:w-[64%] md:w-[65%] 2xl:w-[80%] 3xl:w-[75%] mx-auto h-full pt-6 md:pt-4 2xl:pt-5 3xl:pt-10">
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
          <h3 className="card-name"> GEN{currentGeneration}</h3>
          {showPrice && <h4 className="">{price} ETH</h4>}
        </div>
        <div className="text-[14px] xl:text-base 3xl:text-[20px]">
          <h4>{role}</h4>
          <h4>Forge Potential: {forgePotential}</h4>
          <h4>Nuke Factor: {nukeFactor} %</h4>
          <h4>Performance Factor: {performanceFactor}</h4>
        </div>
      </div>
    </div>
  );
};
