import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import orangeBorder from '@/public/images/orangeborder.png';
import blueBorder from '@/public/images/border.svg';
import { calculateEntityAttributes } from '@/utils/utils';
import styles from './styles.module.scss';

export const EntityCard = ({
  entropy,
  entity,
  tokenId,
  price,
  borderType = 'blue',
  wrapperClass,
}) => {
  const paddedEntropy = entropy.toString().padStart(6, '0');
  const calculateUri = (paddedEntropy, generation) => {
    return `${paddedEntropy}_${generation}`;
  };
  const uri = calculateUri(entropy, 1); 

  const { role, forgePotential, performanceFactor, nukeFactor } =
  calculateEntityAttributes(paddedEntropy);


  let activeBorder;

  switch (borderType) {
    case 'orange':
      activeBorder = orangeBorder;
      break;
    case 'blue':
      activeBorder = blueBorder;
      break;
  }

  const wrapperClasses = classNames('mx-5', styles.cardContainer, wrapperClass);

  return (
    <div
      className={wrapperClasses}
      style={{
        backgroundImage: `url("${activeBorder.src}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
    >
      <div className="w-full h-full px-5 pt-5 3xl:px-10 3xl:pt-10">
        <Image
          loading="lazy"
          src={`https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`}
          alt="IMG"
          className="z-[-1]"
          width={200}
          height={300}
        />
      </div>
      <div className="py-5 mb-5 h-full text-sm md:text-[18px]">
        <div className={styles.cardInfo}>
          <h4 className="">{price} ETH</h4>
        </div>
        <h4 className="card-name">{tokenId}</h4> 
        <h4 className="card-name">{role}</h4> 
        <h4 className="">Forge Potential: {forgePotential}</h4>
        <h4 className="">Nuke Factor: {nukeFactor} %</h4>
        <h4 className="">Performance Factor: {performanceFactor}</h4>
      </div>
    </div>
  );
};
