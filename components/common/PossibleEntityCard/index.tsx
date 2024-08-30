'use client';

import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { Entity } from '~/types';
import { usePathname } from 'next/navigation';

type EntityCardTypes = {
  entity: Entity;
  onSelect?: () => void;
  wrapperClass?: string;
  showPrice?: boolean;
  displayPrice?: string | number;
};

export const PossibleEntityCard = ({
  entity,
  onSelect,
  wrapperClass,
}: EntityCardTypes) => {
  const { generation, role, forgePotential, performanceFactor, nukeFactor } =
    entity;
  const pathname = usePathname();
  const wrapperClasses = classNames(
    'overflow-hidden border-[1.33px] border-orange rounded-[20px] px-2 md:px-4 py-3 md:py-5 bg-gradient-to-bl to-light-dark w-full',
    {
      'from-light-orange border-neon-orange shadow-custom-forge':
        pathname === '/forging',
    },
    wrapperClass
  );

  const badgeClasses = classNames(
    'text-[10px] lg:text-base 3xl:text-[20px] py-2.5 px-[14px] bg-opacity-20 rounded-xl'
  );

  return (
    <div className={wrapperClasses}>
      <div className="flex justify-between items-center mb-5">
        <p className={badgeClasses}>GEN{generation}</p>
        <p className="text-[20px]">{role}</p>
      </div>
      <Image
        loading="lazy"
        src="/images/questionmarkimage.png"
        alt="IMG"
        className="w-auto rounded-xl md:max-h-[250px] object-cover mt-5"
        width={250}
        height={250}
      />
      <div className="mt-5 text-base xl:text-[24px] flex max-md:flex-wrap gap-y-2 text-left 2xl:gap-x-3">
        <div className="flex flex-col gap-2 basis-1/3 flex-1">
          <h1>{nukeFactor}%</h1>
          <span className="text-xs md:text-sm ">
            Nuke <br /> Factor
          </span>
        </div>
        <div className="flex flex-col gap-2 basis-1/3 flex-1">
          <h1>{forgePotential}</h1>
          <span className="text-xs md:text-sm">Forge Potential</span>
        </div>
        <div className="flex flex-col gap-2 basis-1/3 flex-1">
          <h1>{performanceFactor}</h1>
          <span className="text-xs md:text-sm gap-2">Performance Factor</span>
        </div>
      </div>
    </div>
  );
};
