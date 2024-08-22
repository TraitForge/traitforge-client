import Image from 'next/image';
import Link from 'next/link';

import { shortenAddress } from '~/utils';
import { icons } from '~/components/icons';
import { useState } from 'react';

interface Props {
  users: {
    id: number;
    name: string;
    pfp: string;
    twitter: string;
    walletAddress: `0x${string}`;
  }[];
}

const numberPerPage = 10;

export const ExploreTable = ({ users }: Props) => {
  const [page, setPage] = useState(0);

  const numOfPages = Math.ceil(users.length / numberPerPage);

  return (
    <section className="container">
      <div className="min-h-[631px]">
        <div className="w-full overflow-y-auto ">
          <ul className="grid w-full grid-cols-12">
            <li className="col-span-2">Rank</li>
            <li className="col-span-5 text-left">Name</li>
            <li className="col-span-3">Twiter</li>
            <li className="col-span-2">Address</li>
          </ul>
          <ul className="flex flex-col gap-y-2 mt-10">
            {users
              .slice(page * numberPerPage, (page + 1) * numberPerPage)
              .map(item => (
                <li className="h-[60px]">
                  <Link
                    href={`/explore/${item.walletAddress}`}
                    key={item.id}
                    className="grid grid-cols-12"
                  >
                    <p className="col-span-2 text-base">{item?.id}</p>
                    <div className="flex items-center gap-x-4 col-span-5">
                      <div className="w-12 h-12">
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
                            className:
                              'w-full h-full object-cover text-[#AAFF3E]',
                          })
                        )}
                      </div>
                      <p className="text-base">
                        {item?.name ? item.name : 'User'}
                      </p>
                    </div>
                    <p className="text-base col-span-3">
                      {item?.twitter ? `@${item.twitter}` : '-'}
                    </p>
                    <p className="text-base col-span-2">
                      {shortenAddress(item.walletAddress)}
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <nav aria-label="Page navigation example" className="py-5">
        <ul className="flex items-center justify-center -space-x-px h-8 text-sm">
          <li
            onClick={() => page > 0 && setPage(prev => prev - 1)}
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </li>
          {[...Array(numOfPages)].map((item, idx) => (
            <li
              key={idx}
              onClick={() => setPage(idx)}
              className="flex items-center justify-center px-3 h-8 leading-tight cursor-pointer"
            >
              {idx + 1}
            </li>
          ))}
          <li
            onClick={() => page < numOfPages - 1 && setPage(prev => prev + 1)}
            className="flex items-center justify-center px-3 h-8 leading-tight"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </li>
        </ul>
      </nav>
    </section>
  );
};
