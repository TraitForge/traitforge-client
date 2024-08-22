import Image from 'next/image';
import { useState } from 'react';

import { icons } from '~/components/icons';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { shortenAddress } from '~/utils';

interface Props {
  searchQuery: string;
  handleSearch(text: string): void;
  users: {
    id: number;
    name: string;
    pfp: string;
    twitter: string;
    walletAddress: `0x${string}`;
  }[];
}

export const ExploreHeading = ({
  searchQuery,
  handleSearch,
  users = [],
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { ref } = useOutsideClick(() => setIsOpen(false));

  return (
    <div className="flex flex-col lg:flex-row justify-center relative items-center container gap-y-5 mb-10">
      <h1 className=" text-[36px] md:text-extra-large">Explore</h1>
      <div
        ref={ref}
        className="relative lg:absolute lg:top-1/2 lg:translate-y-[-50%] md:right-0 xl:right-20 w-full lg:w-[25%]"
      >
        <div className="relative">
          <input
            type="text"
            className="text-base rounded-md px-3 py-4 border-2 bg-transparent border-neon-green-yellow  text-white placeholder:text-white outline-none w-full z-10"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search"
            onFocus={() => setIsOpen(true)}
          />
          {icons.search({
            className: 'absolute right-4 top-1/2 -translate-y-1/2 z-0',
          })}
        </div>
        {isOpen && (
          <ul className="absolute -bottom-4 border border-neon-green-yellow z-10 right-0 min-w-full max-h-[200px] translate-y-full bg-black rounded-md overflow-y-auto">
            {users?.map(item => (
              <li
                className="flex gap-x-4 py-2 items-center hover:bg-neutral-700 cursor-pointer px-5"
                key={item.id}
                onClick={() => handleSearch(item.name)}
              >
                <div className="w-8 h-8">
                  {item.pfp ? (
                    <Image
                      alt={item?.name}
                      src={item?.pfp}
                      width={100}
                      height={100}
                      className=" object-cover rounded-xl w-full h-full"
                    />
                  ) : (
                    icons.user({
                      className: 'w-full h-full object-cover text-[#AAFF3E]',
                    })
                  )}
                </div>
                <p className="text-sm">{item.name ?? shortenAddress(item.walletAddress)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
