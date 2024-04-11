import React from 'react';
import Image from 'next/image';
import { useContextState } from '@/utils/context';

import orangeBorder from '@/public/images/orangeborder.png';
import blueBorder from '@/public/images/border.svg';

export const EntityCard = ({ entropy, index, borderType = 'blue' }) => {
  const { calculateEntityAttributes } = useContextState();

  const { role, forgePotential, performanceFactor, nukeFactor } =
    calculateEntityAttributes(entropy);

  const calculateEntityPrice = index => {
    return ((index + 1) * 0.01).toFixed(2);
  };

  let activeBorder;

  switch (borderType) {
    case 'orange':
      activeBorder = orangeBorder;
      break;
    case 'blue':
      activeBorder = blueBorder;
      break;
    default:
      activeBorder = orangeBorder;
      break;
  }

  return (
    <div
      className="card-container "
      style={{
        backgroundImage: `url("${activeBorder.src}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        width: orangeBorder.width,
        height: orangeBorder.height,
      }}
    >
      <div className="w-full h-full px-10 pt-10">
        <Image
          loading="lazy"
          src="/images/traitforgertransparent.png"
          alt="Entity"
          className="card-image"
          width={200}
          height={300}
        />
      </div>
      <div className="py-5 mb-5 h-full">
        <div className="card-info text-white">
          <h4 className="card-price">{calculateEntityPrice(index)} ETH</h4>
        </div>
        <h4 className="card-name">{role}</h4>
        <h4 className="card-name">Forge Potential: {forgePotential}</h4>
        <h4 className="card-parameters-h2">Nuke Factor: {nukeFactor} %</h4>
        <h4 className="card-parameters-h2">
          Performance Factor: {performanceFactor}
        </h4>
      </div>
    </div>
  );
};
