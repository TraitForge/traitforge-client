'use client';

import { LoadingSpinner } from '~/components';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Entity } from '~/types';

import { icons } from '~/components/icons';
import { useOwnerEntities } from '~/hooks';
import { EntityCard } from '~/components';

interface User {
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

const ExplorePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const { data: ownerEntities, refetch: refetchOwnerEntities } =
    useOwnerEntities( slug as `0x${string}`  || '0x0');
  useEffect(() => {
    // check user already registered
    (async () => {
      setLoading(true);
      if (slug) {
        try {
          const response = await fetch(`/api/user?walletAddress=${slug}`);
          const data = await response.json();

          if (data.error === 'User does not exist') {
          } else {
            setUser(data.user);
          }
        } catch (err) {
          console.error('Failed to check user registration:', err);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [slug]);

  return (
    <div
      className="py-10 min-h-screen"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 0, 0, 0.8) 49%, rgba(0, 0, 0, 0.8) 100%), url('/images/marketplace-background.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {loading ? (
        <div className="h-[700px] w-full flex justify-center items-center flex-col">
          <LoadingSpinner color="#AAFF3E" />
        </div>
      ) : (
        <div className=" container">
          <div className="flex items-center gap-x-[28px]">
          <button
            className=" -translate-y-1/2 max-md:h-auto bg-[#0C001F] bg-opacity-80 px-4 rounded-md "
            onClick={() =>  window.location.href = '/explore'}
          >
            {icons.arrow({ className: 'text-neon-green' })}
          </button>
            <div className="w-20 h-20">
              {user?.pfp ? (
                <Image
                  alt={user?.name}
                  src={user?.pfp}
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
            <div className="flex flex-col gap-4 justify-center">
              <div className="flex items-center gap-x-4">
                <p className="text-[40px]">{user?.name}</p>
              </div>
              <div className="flex gap-x-3">
                <p className="text-xl">{`@${user?.twitter}`}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-2 md:gap-x-[10px] mt-10 gap-y-2 lg:gap-y-2">
            {ownerEntities.map((entity: Entity) => {
              return (
                <EntityCard
                entity={entity}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
