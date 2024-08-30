import React from 'react';
import { icons } from '~/components/icons';
import { EntityCard } from '~/components';
import { Entity } from '~/types';

type ForgingReceiptTypes = {
    offspring: Entity;
};

export const ForgingReceipt = ({
    offspring
  }: ForgingReceiptTypes) => {
    
    const parentNames = {
      forger: [
        "Dad",
        "Padre",
        "Daddy",
        "Daddio",
        "Gramps",
        "Forger",
        "Papa",
        "Papi",
      ],
      merger: [
        "Mom",
        "Merger",
        "Madre",
        "Mommy",
        "Mamacita",
        "Mama",
        "Mami",
      ]
    };
    
    const getRandomEmoji = (emojiArray: String[]) => {
      return emojiArray[Math.floor(Math.random() * emojiArray.length)];
    };

  return (
    <div className="bg-black items-center w-full lg:w-[70vw] 2xl:w-[50vw] h-[80vh] sm:h-[60vh] sm:w-[80vw] rounded-[30px] py-10 px-10 flex sm:flex-row flex-col">
      <div className="md:w-7/12 h-full">
        <h2 className="text-center md:text-left pb-2 md:pb-7 text-[40px] xs:text-[50px] uppercase">
          Entity Forged
        </h2>
        <div className="hidden pt-4 sm:block"> 
         <p> {getRandomEmoji(parentNames.forger)} </p>
         <div className="h-[80px] border my-5 rounded-lg w-10/12">
          {/* <AccountTag /> not made yet */} 
         </div>
         <p> {getRandomEmoji(parentNames.merger)} </p>
         <div className="h-[80px] border my-5 rounded-lg w-10/12">
          {/* <AccountTag /> not made yet */} 
         </div>
         <div className="pt-4">
         <p className="pb-3">
          share with friends
         </p>
         <div className="flex-row flex">
         {icons.x()}
         </div>
         </div>
      </div>
      </div>
      {offspring && (
        <div className="flex justify-center w-8/12 sm:w-9/12 pt-6 md:pt-0">
            <EntityCard entity={offspring} />
        </div>
      )}
      <div className="sm:hidden py-6"> 
      <div className="flex flex-row w-[85vw] justify-between">
      <div className="w-5/12">
        <p>{getRandomEmoji(parentNames.forger)}</p>
         <div className="h-[70px] mt-2 border rounded-lg">
          {/* <AccountTag /> not made yet */} 
         </div>
         </div>
         <div className="w-5/12">
         <p>{getRandomEmoji(parentNames.merger)}</p>
         <div className="h-[70px] mt-2 border rounded-lg">
          {/* <AccountTag /> not made yet */} 
         </div>
         </div>
         </div>
      </div>
    </div>
  );
};

