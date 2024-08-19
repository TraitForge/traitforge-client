import Image from 'next/image';

import { shortenAddress } from '~/utils';
import { icons } from '~/components/icons';

interface Props {
  users: {
    id: number;
    name: string;
    pfp: string;
    twitter: string;
    walletAddress: `0x${string}`;
  }[];
}

export const ExploreTable = ({ users }: Props) => {
  return (
    <section className="container overflow-y-auto">
      <table className="w-full my-20">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Twiter</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody className="">
          {users.map(item => (
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
                    icons.user({ className: 'w-full h-full object-cover text-[#AAFF3E]' })
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
    </section>
  );
};
