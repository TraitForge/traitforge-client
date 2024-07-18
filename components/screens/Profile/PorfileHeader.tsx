import { useAccount } from 'wagmi';
import { useState } from 'react';

import { shortenAddress } from '~/utils';
import { FaWallet } from 'react-icons/fa';
import { icons } from '~/components/icons';
import { ImageUpload } from './UploadImage';

export const ProfileHeader = () => {
  const { address } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('User');

  const shortAddress = address ? shortenAddress(address) : 'Not connected';

  return (
    <section className="flex max-md:flex-col gap-y-10 justify-between items-center container mt-16">
      <div className="flex items-center gap-x-[28px]">
        <ImageUpload />
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex items-center gap-x-4">
            <span
              className="bg-blue rounded-full p-2 "
              onClick={() => setIsEditing(p => !p)}
            >
              {icons.pen()}
            </span>
            {isEditing ? (
              <input
                className="bg-transparent focus-within:outline-none inline text-[40px] py-[10.5px]"
                onChange={e => setUserName(e.target.value)}
                value={userName}
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <p className="text-[40px] py-[14px]">{userName}</p>
            )}
          </div>
          <div className="flex gap-x-3">
            {icons.x()} <p className="text-xl">@twitterhandle</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-14 flex-wrap gap-y-4">
        <div className="flex flex-1 items-center gap-x-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="46"
            height="46"
            fill="none"
            viewBox="0 0 46 46"
          >
            <path
              fill="#FC62FF"
              fillOpacity="0.4"
              d="M23 46c12.703 0 23-10.297 23-23S35.703 0 23 0 0 10.297 0 23s10.297 23 23 23z"
            ></path>
            <path
              fill="#FEC8FF"
              d="M22.996 30.449L14 25l8.996 13L32 25l-9.004 5.449z"
            ></path>
            <path
              fill="#FEC8FF"
              d="M32 23.485L23 29l-9-5.515L23 8l9 15.485z"
            ></path>
            <path
              fill="#F866FB"
              fillOpacity="0.96"
              d="M31.995 23.273l-8.997-4.09V8.343l8.997 14.93zM32 24.978l-9.002 12.679v-7.365L32 24.978zM22.997 19.183v9.407l-8.995-5.317 8.995-4.09z"
            ></path>
            <path
              fill="#EC3BEF"
              fillOpacity="0.99"
              d="M32 23.348L23 29V19l9 4.348z"
            ></path>
          </svg>
          <div>
            <p className="text-neutral-100 text-sm sm:text-base">ETH</p>
            <span className="text-white text-md sm:text-large">
              {/* {balanceInETH} */}
            </span>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-x-2.5">
          <span className="rounded-full w-[46px] flex justify-center items-center h-[46px] bg-[rgba(14,235,129,0.39)]">
            <FaWallet color="#0EEB81" />
          </span>
          <div>
            <p className="text-neutral-100 text-sm sm:text-base">
              Wallet Address
            </p>
            <span className="text-white text-md sm:text-large">
              {shortAddress}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
