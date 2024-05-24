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
  getCurrentGeneration
  } from '@/utils/utils';

import { useContextState } from '@/utils/context';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import styles from './styles.module.scss';

export const EntityCard = ({
  entropy,
  entity,
  price,
  onSelect,
  borderType = 'blue',
  wrapperClass,
  showPrice,
}) => {
  const { walletProvider } = useWeb3ModalProvider();
  const [localEntropy, setLocalEntropy] = useState(entropy);
  const [finalNukeFactor, setFinalNukeFactor] = useState(null);
  const [localGeneration, setLocalGeneration] = useState(null);

  const isGeneration = async () => {
    let generation = null;
  
    if (entity !== undefined && entity !== null) {
      generation = await getEntityGeneration(walletProvider, entity);
    } else if (listing !== undefined && listing !== null) {
      generation = await getEntityGeneration(walletProvider, listing);
    } else if (tokenId !== undefined && tokenId !== null) {
      generation = await getEntityGeneration(walletProvider, tokenId);
    } else {
      generation = await getCurrentGeneration();
    }
  
    if (generation) {
      return generation;
    } else {
      console.error('Failed to fetch generation');
      return null;
    }
  };
  
  const fetchEntropy = async () => {
    if (entropy) return;

    try {
      const newEntropy = await getEntityEntropyHook(walletProvider, entity);
      const newNukeFactor = await calculateNukeFactor(walletProvider, entity);
      if (newNukeFactor !== null) {
        setFinalNukeFactor(newNukeFactor);
      } else {
        console.error('Failed to get NukeFactor');
      }
      if (newEntropy !== null) {
        setLocalEntropy(newEntropy.toString());
      } else {
        console.error('Failed to fetch entropy');
      }
    } catch (error) {
      console.error('Error fetching entropy or nuke factor:', error);
    }
  };

  useEffect(() => {
    const fetchEntropyAndGeneration = async () => {
      if (!localEntropy && entity) {
        await fetchEntropy();
      }

      if (!localGeneration && entity) {
        const generation = await isGeneration();
        setLocalGeneration(generation);
      }
    };

    fetchEntropyAndGeneration();
  }, [entity, localEntropy, localGeneration]);

  console.log(localEntropy);
  console.log(localGeneration);

  
  if (!localEntropy) {
    return null; 
  }

  const paddedEntropy = localEntropy.toString().padStart(6, '0');
  const calculateUri = (paddedEntropy, localGeneration) => {
    return `${paddedEntropy}_${localGeneration}`;
  };
  const uri = calculateUri(paddedEntropy, localGeneration);

  const { role, forgePotential, performanceFactor, nukeFactor } = calculateEntityAttributes(paddedEntropy);
  const displayedNukeFactor = finalNukeFactor !== null ? finalNukeFactor : nukeFactor;

  let activeBorder;

  switch (borderType) {
    case 'orange':
      activeBorder = orangeBorder;
      break;
    case 'blue':
      activeBorder = blueBorder;
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
        <h4 className="card-name">{role}</h4> 
        <h4 className="card-name">Forge Potential: {forgePotential}</h4>
        <h4 className="card-name">Nuke Factor: {displayedNukeFactor} %</h4>
        <h4 className="card-name">Performance Factor: {performanceFactor}</h4>
      </div>
    </div>
  );
};
