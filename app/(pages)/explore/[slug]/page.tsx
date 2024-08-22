'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import { icons } from '~/components/icons';

interface User {
  id: number;
  name: string;
  pfp: string;
  twitter: string;
  walletAddress: `0x${string}`;
}

const ExplorePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { slug } = useParams();

  useEffect(() => {
    // check user already registered
    (async () => {
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
        }
      }
    })();
  }, [slug]);

  console.log(user);

  return (
    <div
      className="py-10 h-full"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 0, 0, 0.8) 49%, rgba(0, 0, 0, 0.8) 100%), url('/images/marketplace-background.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="flex items-center gap-x-[28px] container">
        <div className='w-20 h-20'>
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
            <p className="text-[40px] py-[14px]">{user?.name}</p>
          </div>
          <div className="flex gap-x-3">
            <p className="text-xl">{`@${user?.twitter}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
