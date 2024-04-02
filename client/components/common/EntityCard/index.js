import React from 'react';
import { useContextState } from '@/utils/context';

const EntityCard = ({ entity, index }) => {
  // const { calculateEntityAttributes } = useContextState();
  // const {
  //   role,
  //   forgePotential,
  //   nukeFactor,
  //   performanceFactor,
  //   finalNukeFactor,
  // } = calculateEntityAttributes(entity.entropy);
  // const entityPrice = calculateEntityPrice(index);

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
          <h2 className="card-number">2/10,000</h2>
          <h1 className="card-price">10ETH</h1>
        </div>
        <div className="card-info-on-hover">
          <div className="footer-top-level">
            <h3 className="card-name">Forge Potential: 2</h3>
            <h2 className="card-parameters-h2">Nuke Factor: 2 %</h2>
            <h2 className="card-parameters-h2">
              Performance Factor
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;
