import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';
import { contractsConfig } from '@/utils/contractsConfig';
import { useContextState } from '@/utils/context';

const EntityCard = ({ entity, index }) => {
  const { calculateEntityAttributes, entityPrice, infuraProvider } = useContextState();
  const [entropy, setEntropy] = useState(null);

  const getEntropy = async () => {
    if (!infuraProvider) {
      console.error('Infura provider is not set');
      return;
    }

    try {
      const provider = infuraProvider;
      const contract = new ethers.Contract(
        contractsConfig.traitForgeNftAddress,
        contractsConfig.traitForgeNftAbi,
        provider
      );
      const entropyValue = await contract.getTokenEntropy(entity.id);
      setEntropy(entropyValue.toString());
    } catch (error) {
      console.error('Error fetching entropy:', error);
    }
  };
  
  useEffect(() => {
    getEntropy();
  }, [entity]); 

  const {
    role,
    forgePotential,
    performanceFactor,
    finalNukeFactor,
  } = calculateEntityAttributes(entropy);

  const Price = entityPrice ? calculateEntityPrice(index) : "N/A";

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
            <h4 className="card-price">Price: {Price} ETH</h4>
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
