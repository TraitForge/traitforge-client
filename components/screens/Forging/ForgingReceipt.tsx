import React, { useEffect, useState } from 'react';
import { icons } from '~/components/icons';
import { EntityCard, AccountTag } from '~/components';
import { Entity } from '~/types';
import { shortenAddress } from '~/utils';

type ForgingReceiptTypes = {
    offspring: Entity | null;
    forgerOwner: `0x${string}`;
    mergerOwner: `0x${string}`;
    tagColor: "orange";
};

interface User {
  id: number;
  walletAddress: string;
  name: string | null;
  twitter: string | null;
  pfp: string | null;
}

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

export const ForgingReceipt = ({
    offspring,
    forgerOwner,
    mergerOwner,
    tagColor
  }: ForgingReceiptTypes) => {
    const [forgerUser, setForgerUser] = useState<User | null>(null);
    const [mergerUser, setMergerUser] = useState<User | null>(null);
    const [newEntity, setNewEntity] = useState<Entity | null>(offspring);
    const [mergerName, setMergerName] = useState("");
    const [forgerName, setForgerName] = useState("");
  
    const fetchUserData = async (walletAddress: string): Promise<User | null> => {
      try {
        const response = await fetch(`/api/user?walletAddress=${walletAddress}`);
        const data = await response.json();
    
        if (data.error === 'User does not exist') {
          return null;
        } else {
          return data.user;
        }
      } catch (err) {
        console.error('Failed to check user registration:', err);
        return null;
      }
    };
  
    useEffect(() => {
      const fetchUsers = async () => {
        if (forgerOwner) {
          const forgerData = await fetchUserData(forgerOwner);
          setForgerUser(forgerData);
        }
  
        if (mergerOwner) {
          const mergerData = await fetchUserData(mergerOwner);
          setMergerUser(mergerData);
        }
      };
  
      fetchUsers();
    }, [forgerOwner, mergerOwner]);

    useEffect(() => {
      if (offspring) {
        const forger = getRandomEmoji(parentNames.forger);
        const merger = getRandomEmoji(parentNames.merger)
        setMergerName(merger as string);
        setForgerName(forger as string);
      }
    }, [offspring]);
  
    const forgerDisplayName = forgerUser?.name || shortenAddress(forgerOwner);
    const mergerDisplayName = mergerUser?.name || shortenAddress(mergerOwner);
  
    const forgerTwitter = forgerUser?.twitter || '';
    const mergerTwitter = mergerUser?.twitter || '';
  
    const forgerPfpUrl = forgerUser?.pfp || '';
    const mergerPfpUrl = mergerUser?.pfp || '';
    
    const getRandomEmoji = (emojiArray: String[]) => {
      return emojiArray[Math.floor(Math.random() * emojiArray.length)];
    };

  return (
    <div className="bg-black items-center w-full lg:w-[70vw] 2xl:w-[50vw] h-[75vh] sm:h-[65vh] sm:w-[80vw] rounded-[30px] py-10 px-10 flex sm:flex-row flex-col">
      <div className="md:w-7/12 h-full">
        <h2 className="text-center md:text-left pb-2 md:pb-7 text-[40px] xs:text-[50px] uppercase">
          Entity Forged
        </h2>
        <div className="hidden pt-4 sm:block"> 
         <p> {forgerName} </p>
         <div className="h-[80px] my-5 rounded-lg w-10/12">
         <AccountTag
            bg="#023340"
            text={forgerDisplayName}
            twitterText={forgerTwitter}
            variant={tagColor}
            pfpUrl={forgerPfpUrl}
            address={shortenAddress(forgerOwner)}
          /> 
         </div>
         <p> {mergerName} </p>
         <div className="h-[80px] my-5 rounded-lg w-10/12">
         <AccountTag
            bg="#023340"
            text={mergerDisplayName}
            twitterText={mergerTwitter}
            variant={tagColor}
            pfpUrl={mergerPfpUrl}
            address={shortenAddress(mergerOwner)}
          />
         </div>
      </div>
      </div>
      {newEntity && (
        <div className="flex justify-center w-6/12 sm:w-10/12 pt-2 md:pt-0">
            <EntityCard entity={newEntity} />
        </div>
      )}
      <div className="sm:hidden py-6"> 
      <div className="flex flex-row w-[85vw] justify-between">
      <div className="w-5/12">
        <p>{getRandomEmoji(parentNames.forger)}</p>
         <div className="h-[70px] mt-2 rounded-lg">
         <AccountTag
            bg="#023340"
            text={forgerDisplayName}
            twitterText={forgerTwitter}
            variant={tagColor}
            pfpUrl={forgerPfpUrl}
            address={shortenAddress(forgerOwner)}
          /> 
         </div>
         </div>
         <div className="w-5/12">
         <p>{getRandomEmoji(parentNames.merger)}</p>
         <div className="h-[70px] mt-2 rounded-lg">
         <AccountTag
            bg="#023340"
            text={mergerDisplayName}
            twitterText={mergerTwitter}
            variant={tagColor}
            pfpUrl={mergerPfpUrl}
            address={shortenAddress(mergerOwner)}
          /> 
         </div>
         </div>
         </div>
      </div>
    </div>
  );
};

