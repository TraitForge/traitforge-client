import { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { useWeb3ModalAccount, useWeb3Modal } from '@web3modal/ethers/react';

import { WalletModal } from '@/screens/wallet/WallterModal';

export default function ConnectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  return (
    <>
      <button
        aria-label="connect wallet button"
        className="flex items-center gap-x-4 xl:gap-x-8"
        onClick={() => {
          isConnected ? setIsOpen(true) : open();
        }}
      >
        <FaWallet />
        <span className="hidden lg:block text-base lg:text-[32px]">wallet</span>
      </button>
      {isOpen && (
        <WalletModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
      )}
    </>
  );
}
