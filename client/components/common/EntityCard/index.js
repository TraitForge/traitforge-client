import React from 'react';
import Image from 'next/image';
import { useContextState } from '@/utils/context';

const EntityCard = ({ entity, index, calculateEntityPrice }) => {
  const { calculateEntityAttributes } = useContextState();
  const {
    role,
    forgePotential,
    performanceFactor,
    finalNukeFactor,
  } = calculateEntityAttributes(entity.entropy);

  const entityPrice = calculateEntityPrice(index);

  return (
    <div className="card-container" style={{ backgroundImage: "url('/images/border.svg')", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "contain" }}>
      <div className='w-full h-auto p-4'>
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
          <div className="card-info-always-visible">
            <h4 className="card-number">{entity.id}/10,000</h4>
            <h4 className="card-price">Price: {entityPrice} ETH</h4>
          </div>
        </div>
        <h4 className="card-name">Role: {role}</h4>
        <h4 className="card-name">Forge Potential: {forgePotential}</h4>
        <h4 className="card-parameters-h2">Nuke Factor: {finalNukeFactor} %</h4>
        <h4 className="card-parameters-h2">
          Performance Factor: {performanceFactor}
        </h4>
      </div>
    </div>
  );
};

export default EntityCard;
