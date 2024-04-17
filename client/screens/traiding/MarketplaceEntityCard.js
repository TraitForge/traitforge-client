import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import orangeBorder from '@/public/images/orangeborder.png';
import blueBorder from '@/public/images/border.svg';

export const MarketplaceEntityCard = ({
  index,
  borderType = 'blue',
  wrapperClass,
}) => {
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
    case 'green':
      activeBorder = blueBorder;
      break;
  }

  const wrapperClasses = classNames(
    'card-container flex flex-col',
    wrapperClass
  );

  return (
    <div
      className={wrapperClasses}
      style={{
        backgroundImage: `url("${activeBorder.src}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        width: activeBorder.width,
      }}
    >
      <div className="w-full flex justify-center">
        <Image
          loading="lazy"
          src="/images/traitforgertransparent.png"
          alt="Entity"
          className="card-image scale-75"
          width={200}
          height={300}
        />
      </div>
      <div className="py-5 mb-5 px-5 flex-1">
        <h4 className="text-lg text-neon-green uppercase">Entity name #3468</h4>
        <p className="text-[18px] text-neutral-100">Breed count: 3</p>
      </div>
    </div>
  );
};
