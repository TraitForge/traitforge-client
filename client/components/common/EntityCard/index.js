import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import orangeBorder from '@/public/images/orangeborder.png';
import blueBorder from '@/public/images/border.svg';
import { calculateEntityAttributes } from '@/utils/utils';
import styles from './styles.module.scss';

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

  let activeBorder;

  switch (borderType) {
    case 'orange':
      activeBorder = orangeBorder;
      break;
    case 'blue':
      activeBorder = blueBorder;
      break;
  }

  const wrapperClasses = classNames('mx-5', styles.cardContainer, wrapperClass);

  return (
    <div
      className={wrapperClasses}
      style={{
        backgroundImage: `url("${activeBorder.src}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
    >
      <div className="w-full h-full px-5 pt-5 3xl:px-10 3xl:pt-10">
        <Image
          loading="lazy"
          src="/images/traitforgertransparent.png"
          alt="Entity"
          className="z-[-1]"
          width={200}
          height={300}
        />
      </div>
      <div className="py-5 mb-5 h-full text-[18px]">
        <div className={styles.cardInfo}>
          <h4 className="">{calculateEntityPrice(index)} ETH</h4>
        </div>
        {/* <h4 className="card-name">{role}</h4> */}
        <h4 className="">Forge Potential: {forgePotential}</h4>
        <h4 className="">Nuke Factor: {nukeFactor} %</h4>
        <h4 className="">Performance Factor: {performanceFactor}</h4>
      </div>
    </div>
  );
};
