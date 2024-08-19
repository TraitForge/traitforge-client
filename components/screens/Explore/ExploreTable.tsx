import Image from 'next/image';

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
  const paginationNumber = Math.ceil(users.length / numberPerPage);

  return (
    <section className="container my-10 h-full">
      <div className="min-h-[631px]">
        <table className="w-full overflow-y-auto ">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Twiter</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody className="">
            {users
              .slice(page * numberPerPage, (page + 1) * numberPerPage)
              .map(item => (
                <tr key={item.id} className="h-[60px]">
                  <td>{item?.id}</td>
                  <td className="flex items-center gap-x-4">
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

                    <p>{item?.name}</p>
                  </td>
                  <td className="text-base">{item?.twitter}</td>
                  <td className="text-base">
                    {shortenAddress(item.walletAddress)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation example mx-auto">
        <ul className="flex items-center justify-center -space-x-px h-8 text-sm">
          <li onClick={() => setPage(prev => prev - 1)}>
            <a
              href="#"
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
            </a>
          </li>
          {[...Array(paginationNumber)].map((item, idx) => (
            <li key={idx} onClick={() => setPage(idx)}>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight"
              >
                {idx + 1}
              </a>
            </li>
          ))}
          <li onClick={() => setPage(prev => prev + 1)}>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight "
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
            </a>
          </li>
        </ul>
      </nav>
    </section>
  );
};
