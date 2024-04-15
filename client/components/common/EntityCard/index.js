import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import orangeBorder from '@/public/images/orangeborder.png';
import blueBorder from '@/public/images/border.svg';
import { calculateEntityAttributes } from '@/utils/utils';

export const EntityCard = ({
  entropy,
  index,
  borderType = 'blue',
  wrapperClass,
}) => {
    const { role, forgePotential, performanceFactor, nukeFactor } =
    calculateEntityAttributes(entropy);

  const calculateEntityPrice = index => {
    return ((index + 1) * 0.01).toFixed(2);
  };
  const calculateUri = (entropy, generation) => {
    console.log(entropy);
    const paddedEntropy = entropy.toString().padStart(6, '0');
    return `${paddedEntropy}_${generation}`;
  };
  const uri = calculateUri(entropy, 1); 
  console.log(uri);
  

  let activeBorder;

  switch (borderType) {
    case 'orange':
      activeBorder = orangeBorder;
      break;
    case 'blue':
      activeBorder = blueBorder;
      break;
  }

  const wrapperClasses = classNames('mx-5 card-container', wrapperClass);

  return (
    <div
      className={wrapperClasses}
      style={{
        backgroundImage: `url("${activeBorder.src}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        width: activeBorder.width,
        height: activeBorder.height,
      }}
    >
      <div className="w-full h-full px-5 pt-5 xl:px-10 xl:pt-10">
        <Image
          loading="lazy"
          src={`https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`}
          alt="Entity"
          className="card-image"
          width={200}
          height={300}
        />
      </div>
      <div className="py-5 mb-5 h-full">
        <div className="card-info text-white">
          <h4 className="card-price">wecewc ETH</h4>
        </div>
        <h4 className="card-name">{role}</h4>
        <h4 className="card-name">Forge Potential: {forgePotential}</h4>
        <h4 className="card-parameters-h2">Nuke Factor: {nukeFactor} %</h4>
        <h4 className="card-parameters-h2">
          Performance Factor: {performanceFactor}x
        </h4>
      </div>
    </div>
  );
};
