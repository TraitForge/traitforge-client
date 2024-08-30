import React, { useEffect, useState } from 'react';
import { EntityCard, AccountTag } from '~/components';
import { Entity } from '~/types';
import { useEthPrice } from '~/hooks';
import { useAccount } from 'wagmi';
import { shortenAddress } from '~/utils';


type NukingReceiptTypes = {
    entityJustNuked: Entity;
    ethNuked: String;
};

interface User {
  id: number;
  walletAddress: string;
  name: string | null;
  twitter: string | null;
  pfp: string | null;
}

const sadEmojis = [
  "💔", "😢", "😭", "😞", "😔", "😩", "😫", "😟", "😿", "😣",
  "😖", "😥", "😓", "😪", "😔", "😕", "😢", "😧", "😿", "😰"
];

const deathQuotes = [
  "Game over, man.",
  "Was nice knowin' ya.",
  "GG.",
  "Gonna miss you brav.",
  "Back to the lobby😂.",
  "Respawn in another life, or nah?",
  "West in Peace.",
  "Eliminated. Dropped all their loot.",
  "Night-night, forever.",
  "Time’s up, homie.",
  "Signal lost, connection terminated.",
  "Offline, but never forgotten.",
  "Gone too soon.",
  "I will miss you.",
  "RIP, you were a good man, or woman idk.",
  "Gone but never forgotten. 🕊️",
];


const getRandomEmoji = (emojiArray: String[]) => {
  return emojiArray[Math.floor(Math.random() * emojiArray.length)];
};


export const NukingReceipt = ({
    entityJustNuked,
    ethNuked
  }: NukingReceiptTypes) => {
    const { address } = useAccount();
    const { data: ethPrice } = useEthPrice();
    const dollarClaimed = (Number(ethNuked) * ethPrice).toFixed(2);
    const [user, setUser] = useState<User>();
    const [userName, setUserName] = useState(user?.name || 'User');
    const [twitterHandle, setTwitterHandle] = useState(
      user?.twitter || 'twitterhandle'
    );
    const [pfpUrl, setPfpUrl] = useState();
    const shortAddress = address ? shortenAddress(address) : 'Not connected';

    useEffect(() => {
      (async () => {
        if (address) {
          try {
            const response = await fetch(`/api/user?walletAddress=${address}`);
            const data = await response.json();
  
            if (data.error === 'User does not exist') {
            } else {
              setUser(data.user);
  
              const { name, pfp, twitter } = data.user;
              if (name) setUserName(name);
              if (twitter) setTwitterHandle(twitter);
              if (pfp) setPfpUrl(pfp);
            }
          } catch (err) {
            console.error('Failed to check user registration:', err);
          }
        }
      })();
    }, [address]);

  return (
    <div className="bg-black items-center w-[100vw] lg:w-[50vw] h-[90vh] sm:h-[60vh] sm:w-[80vw] rounded-[30px] py-10 px-10 flex sm:flex-row flex-col">
      <div className="md:w-6/12">
        <h2 className="text-center md:text-left pb-2 md:pb-10 text-[40px] xs:text-[50px] uppercase">
          RIP {getRandomEmoji(sadEmojis)}
        </h2>
        <p className="text-center md:text-left pb-2 md:pb-10 text-[10px] xs:text-[20px]">
        {getRandomEmoji(deathQuotes)}
        </p>
        <div>
        <h2 className="text-center  md:text-left text-[40px] xs:text-[50px] text-purple-400 uppercase">
          {ethNuked} ETH
        </h2>
        <p className="text-center md:text-left pt-3 text-purple-400 text-[15px] xs:text-[25px] uppercase">
          ${dollarClaimed} USD
        </p>
        </div>
        <div className="hidden pt-4 sm:block"> 
         <div className="z-50 h-[80px] rounded-lg w-10/12">
          <AccountTag
          bg="#023340"
          text={userName}
          twitterText={twitterHandle}
          variant="purple"
          pfpUrl={pfpUrl}
          address={shortAddress}
          /> 
         </div>
      </div>
      </div>
      <div className="flex justify-center w-7/12 sm:9/12 pt-8 md:pt-0">
        {( entityJustNuked && 
        <EntityCard
        entity={entityJustNuked}
        />
        )}
      </div>
      <div className="sm:hidden w-full pt-6"> 
         <div className="h-[70px] border rounded-lg">
          {/* <AccountTag /> not made yet */} 
         </div>
      </div>
    </div>
  );
};

