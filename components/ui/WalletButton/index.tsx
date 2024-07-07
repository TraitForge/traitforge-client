'use client';

import Link from 'next/link';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { FaWallet } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import { shortenAddress } from '~/utils';

export default function WalletButton() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleButtonClick = () => {
    if (!address && openConnectModal) {
      openConnectModal();
    }
  };

  const link = {url: '/wallet'}

  return (
    <>
      {address ? (
        <Link href={link.url} passHref>
          <li
            aria-label="wallet button"
            className="flex items-center gap-x-4 xl:gap-x-8"
          >
            <FaWallet />
            <span className="hidden lg:block text-base text-gray-200 lg:text-[32px] font-bebas">
              {shortenAddress(address)}
            </span>
          </li>
        </Link>
      ) : (
        <button
          aria-label="connect wallet button"
          className="flex items-center gap-x-4 xl:gap-x-8"
          onClick={handleButtonClick}
        >
          <FaWallet />
          <span className="hidden lg:block text-base text-gray-200 lg:text-[32px] font-bebas">
            Connect
          </span>
        </button>
      )}
    </>
  );
}
