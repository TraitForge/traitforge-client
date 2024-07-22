import React from 'react';
import { icons } from '~/components/icons';
import { EntityCard } from '~/components';
import { Entity } from '~/types';

type ForgingReceiptTypes = {
    forger?: Entity;
    merger?: Entity;
    offspring?: Entity;
};

export const ForgingReceipt = ({
    forger,
    merger,
    offspring
  }: ForgingReceiptTypes) => {

  return (
    <div className="bg-black items-center w-[100vw] lg:w-[50vw] h-[90vh] sm:h-[60vh] sm:w-[80vw] rounded-[30px] py-10 px-10 flex sm:flex-row flex-col">
      <div className="md:w-6/12">
        <h2 className="text-center md:text-left pb-2 md:pb-10 text-[40px] xs:text-[50px] uppercase">
          Entity Forged
        </h2>
        <div className="hidden pt-4 sm:block"> 
         <div className="h-[80px] border rounded-lg w-10/12">
          {/* <AccountTag /> not made yet */} 
         </div>
         <div className="pt-4">
         <p className="pb-3">
          share with friends
         </p>
         <div className="flex-row flex gap-5">
         {icons.x()}
         </div>
         </div>
      </div>
      </div>
      {(offspring || forger || merger) && (
        <div className="flex justify-center w-8/12 sm:w-9/12 pt-8 md:pt-0">
          {offspring && (
            <EntityCard entity={offspring} />
          )}
          {forger && (
            <EntityCard entity={forger} />
          )}
          {merger && (
            <EntityCard entity={merger} />
          )}
        </div>
      )}
      <div className="sm:hidden w-full pt-6"> 
         <div className="h-[70px] border rounded-lg">
          {/* <AccountTag /> not made yet */} 
         </div>
         <div className="xs:hidden pt-5 ">
         <p className="pb-1">
          share with friends
         </p>
         <div className="flex-row flex">
         {icons.x()}
         </div>
         </div>
      </div>
    </div>
  );
};
