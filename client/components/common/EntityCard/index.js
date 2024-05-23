import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import orangeBorder from '@/public/images/orangeborder.png';
import blueBorder from '@/public/images/border.svg';
import purpleBorder from '@/public/images/purpleBorder.svg';
import greenBorder from '@/public/images/greenBorder.svg';
import { calculateEntityAttributes, getEntityEntropyHook, calculateNukeFactor } from '@/utils/utils';
import { useContextState } from '@/utils/context';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import styles from './styles.module.scss';

export const EntityCard = ({
  entropy,
  entity,
  tokenId,
  listing,
  price,
  onSelect,
  borderType = 'blue',
  wrapperClass,
  showPrice,
}) => {
  const { walletProvider } = useWeb3ModalProvider();
  const [localEntropy, setLocalEntropy] = useState(entropy);
  const [finalNukeFactor, setFinalNukeFactor] = useState(null);

  const isEntropy = async () => {
    if (entropy) return;
    let newEntropy = null;
    let newNukeFactor = null;

    if (entity !== undefined && entity !== null) {
      console.log('Fetching entropy for entity:', entity);
      newEntropy = await getEntityEntropyHook(walletProvider, entity);
      newNukeFactor = await calculateNukeFactor(walletProvider, entity);
    } else if (listing !== undefined && listing !== null) {
      console.log('Fetching entropy for listing:', listing);
      newEntropy = await getEntityEntropyHook(walletProvider, listing);
      newNukeFactor = await calculateNukeFactor(walletProvider, listing);
    } else if (tokenId !== undefined && tokenId !== null) {
      console.log('Fetching entropy for tokenId:', tokenId);
      newEntropy = await getEntityEntropyHook(walletProvider, tokenId);
      newNukeFactor = await calculateNukeFactor(walletProvider, tokenId);
    }

    if (newNukeFactor) {
      setFinalNukeFactor(newNukeFactor);
    } else {
      console.error('Failed to get NukeFactor');
    }

    if (newEntropy) {
      setLocalEntropy(newEntropy.toString());
    } else {
      console.error('Failed to fetch entropy');
    }
  };

  useEffect(() => {
    if (!localEntropy && (entity !== undefined && entity !== null || listing !== undefined && listing !== null || tokenId !== undefined && tokenId !== null)) {
      isEntropy();
    }
  }, [entity, listing, localEntropy, tokenId]);

  if (!localEntropy) {
    return null; 
  }

  const paddedEntropy = localEntropy.toString().padStart(6, '0');
  const calculateUri = (paddedEntropy, localGeneration) => {
    return `${paddedEntropy}_${localGeneration}`;
  };
  const uri = calculateUri(paddedEntropy, '3');

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
