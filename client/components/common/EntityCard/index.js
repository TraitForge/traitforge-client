import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import orangeBorder from '@/public/images/orangeborder.png';
import blueBorder from '@/public/images/border.svg';
import purpleBorder from '@/public/images/purpleBorder.svg';
import greenBorder from '@/public/images/greenBorder.svg';
import { 
  calculateEntityAttributes,
  getEntityEntropyHook,
  calculateNukeFactor,
  getEntityGeneration,
} from '@/utils/utils';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import styles from './styles.module.scss';

export const EntityCard = ({
  entity,
  price,
  onSelect,
  borderType = 'blue',
  wrapperClass,
  showPrice,
}) => {
  const { walletProvider } = useWeb3ModalProvider();

  const [entropy, setEntropy] = useState('');
  const [nukeFactor, setNukeFactor] = useState('');
  const [generation, setGeneration] = useState('');

  const fetchEntropy = async (entity) => {
    try {
      const entropy = await getEntityEntropyHook(walletProvider, entity);
      console.log("Fetched entropy:", entropy);
      setEntropy(entropy);
    } catch (error) {
      console.error('Error fetching entropy:', error);
    }
  };

  const fetchNukeFactor = async (entity) => {
    try {
      const nukeFactor = await calculateNukeFactor(walletProvider, entity);
      console.log("Fetched nuke factor:", nukeFactor);
      setNukeFactor(nukeFactor);
    } catch (error) {
      console.error('Error fetching nuke factor:', error);
    }
  };

  const fetchGeneration = async (entity) => {
    try {
      const generation = await getEntityGeneration(walletProvider, entity);
      console.log("Fetched generation:", generation);
      setGeneration(generation);
    } catch (error) {
      console.error('Error fetching generation:', error);
    }
  };

  useEffect(() => {
      fetchEntropy(entity.toString());
      fetchNukeFactor(entity.toString());
      fetchGeneration(entity.toString());
  }, [entity]);

  const paddedEntropy = entropy.toString().padStart(6, '0');
    const calculateUri = (paddedEntropy, generation) => {
      return `${paddedEntropy}_${generation}`;
    };

   const uri = calculateUri(paddedEntropy, generation);

  const { role, forgePotential, performanceFactor } = calculateEntityAttributes(paddedEntropy);

  let activeBorder;
  switch (borderType) {
    case 'orange':
      activeBorder = orangeBorder;
      break;
    case 'purple':
      activeBorder = purpleBorder;
      break;
    case 'green':
      activeBorder = greenBorder;
      break;
    default:
      activeBorder = blueBorder;
  }

  const wrapperClasses = classNames('mx-5', styles.cardContainer, wrapperClass);

  return (
    <div
      onClick={onSelect}
      className={`${wrapperClasses} overflow-hidden items-center`}
      style={{
        backgroundImage: `url("${activeBorder.src}")`,
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
        {role && <h4 className="card-name">{role}</h4>}
        <h4 className="card-name">Forge Potential: {forgePotential}</h4>
        <h4 className="card-name">Nuke Factor: {nukeFactor} %</h4>
        <h4 className="card-name">Performance Factor: {performanceFactor}</h4>
      </div>
    </div>
  );
};
