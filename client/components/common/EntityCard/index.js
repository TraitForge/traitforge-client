import React from 'react';
import Image from 'next/image';
import { useContextState } from '@/utils/context';

const EntityCard = ({ entropy, index }) => {
  const { calculateEntityAttributes, entityPrice } =
    useContextState();

  const { role, forgePotential, performanceFactor, nukeFactor } =
    calculateEntityAttributes(entropy);

  const Price = entityPrice ? calculateEntityPrice(index) : 'N/A';

  return (
    <div
      className="card-container"
      style={{
        backgroundImage: "url('/images/border.svg')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
    >
      <div className="w-full h-auto p-4">
        <Image
          loading="lazy"
          src="/images/traitforgertransparent.png"
          alt="Entity"
          className="card-image"
          width={200}
          height={300}
        />
      </div>
      <div className="footer-top-level py-5">
        <div className="card-info text-white">
        <h4 className="card-price">Price: {Price} ETH</h4>
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

export default EntityCard;
