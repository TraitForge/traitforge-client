import React from 'react';
import { useContextState } from '@/utils/context';

const EntityCard = ({ entity, index }) => {
  const { calculateEntityAttributes } = useContextState();
  const {
    role,
    forgePotential,
    nukeFactor,
    performanceFactor,
    finalNukeFactor,
  } = calculateEntityAttributes(entity.entropy);
  const entityPrice = calculateEntityPrice(index);

  return (
    <div className="card-container">
      <img
        loading="lazy"
        src="/images/traitforgertransparent.png"
        alt="Entity"
        className="card-image"
      />
      <div className="card-info">
        <div className="card-info-always-visible">
          <h2 className="card-number">{entity.id}/10,000</h2>
          <h1 className="card-price">Price: {entityPrice} ETH</h1>
        </div>
        <div className="card-info-on-hover">
          <div className="footer-top-level">
            <h3 className="card-type">Role: {role}</h3>
            <h3 className="card-name">Forge Potential: {forgePotential}</h3>
            <h2 className="card-parameters-h2">Nuke Factor: {nukeFactor} %</h2>
            <h2 className="card-parameters-h2">
              Nuke Factor: {finalNukeFactor} %
            </h2>
            <h2 className="card-parameters-h2">
              Performance Factor: {performanceFactor}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;
