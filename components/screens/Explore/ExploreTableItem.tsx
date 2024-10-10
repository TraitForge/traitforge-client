import Link from 'next/link';
import Image from 'next/image';

import { shortenAddress } from '~/utils';
import { icons } from '~/components/icons';

interface Props {
  id: number;
  name: string;
  pfp: string;
  twitter: string;
  walletAddress: `0x${string}`;
  entities: {
    entropy: number;
    id: number;
    userId: number;
  }[];
}

export const ExploreTableItem = ({
  walletAddress,
  id,
  pfp,
  name,
  twitter,
  entities
}: Props) => {
  return (
    <li>
      <Link
        href={`/explore/${walletAddress}`}
        className="grid grid-cols-12 items-center"
      >
        <div className="flex items-center gap-x-4 col-span-6">
          <div className="w-12 h-12">
            {pfp ? (
              <Image
                alt={name}
                src={pfp}
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
          <p className="text-base">{name ?? walletAddress}</p>
        </div>
        <p className="text-base col-span-6 text-right">{twitter ? `@${twitter}` : '-'}</p>
      </Link>
    </li>
  );
};
