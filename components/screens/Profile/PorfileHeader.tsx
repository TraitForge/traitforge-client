import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';

import { shortenAddress } from '~/utils';
import { FaWallet } from 'react-icons/fa';
import { icons } from '~/components/icons';
import { ImageUpload } from './UploadImage';
import axios from 'axios';

interface User {
  id: number;
  walletAddress: string;
  name: string | null;
  twitter: string | null;
  pfp: string | null;
}

export const ProfileHeader = () => {
  const { address } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User>();
  const [userName, setUserName] = useState(user?.name || 'User');
  const [twitterHandle, setTwitterHandle] = useState(
    user?.twitter || 'twitterhandle'
  );
  const [pfpUrl, setPfpUrl] = useState();
  const [file, setFile] = useState<File | undefined>(undefined);
  const [originalMessage, setOriginalMessage] = useState('');

  const { data: signMessageData, signMessage } = useSignMessage();

  const shortAddress = address ? shortenAddress(address) : 'Not connected';

  useEffect(() => {
    // check user already registered
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

  const handleSave = async () => {
    setIsEditing(false);
    const timestamp = Date.now();
    signMessage({ message: `${timestamp}` });
    setOriginalMessage(`${timestamp}`);
  };

  useEffect(() => {
    (async () => {
      if (signMessageData && originalMessage) {
        const formData = new FormData();
        if (file) formData.append('pfp', file);
        formData.append('name', userName);
        formData.append('twitter', twitterHandle);
        formData.append('messageData', signMessageData);
        formData.append('originalMessage', originalMessage);
        if (address) formData.append('walletAddress', address);

        try {
          const response = await axios.put('/api/user', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [signMessageData, originalMessage, address]);

  const handleCancel = () => {
    setIsEditing(false);
    if (user?.name) setUserName(user?.name);
    if (user?.twitter) setTwitterHandle(user?.twitter);
  };

  const handleImageUpdate = (f: File) => {
    setFile(f);
  };

  return (
    <section className="flex max-md:flex-col gap-y-10 justify-between items-center container mt-16">
      <div className="flex items-center gap-x-[28px]">
        <ImageUpload
          pfpUrl={pfpUrl}
          isEditing={isEditing}
          handleImageUpdate={(f: File) => handleImageUpdate(f)}
        />
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex gap-x-3 items-center">
            {isEditing ? (
              <>
                <span
                  className="bg-blue rounded-full p-2 "
                  onClick={() => handleSave()}
                >
                  <img src="/images/save.svg" alt="" className="size-6" />
                </span>
                <span
                  className="bg-blue rounded-full p-2 "
                  onClick={() => handleCancel()}
                >
                  <img src="/images/close.svg" alt="" className="size-6" />
                </span>
              </>
            ) : (
              <>
                <span>Edit profile</span>
                <span
                  className="bg-blue rounded-full p-2 "
                  onClick={() => setIsEditing(p => !p)}
                >
                  {icons.pen()}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-x-4">
            {isEditing ? (
              <input
                className="bg-transparent focus-within:outline-none inline text-[40px] py-[10.5px]"
                onChange={e => setUserName(e.target.value)}
                value={userName}
              />
            ) : (
              <p className="text-[40px] py-[14px]">{userName}</p>
            )}
          </div>
          <div className="flex gap-x-3">
            {icons.x()}
            {isEditing ? (
              <input
                className="bg-transparent focus-within:outline-none inline text-xl"
                onChange={e => setTwitterHandle(e.target.value)}
                value={twitterHandle}
              />
            ) : (
              <p className="text-xl">{`@${twitterHandle}`}</p>
            )}
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
