import { useWeb3Modal } from '@web3modal/ethers/react';
import { FaWallet } from 'react-icons/fa';

export default function ConnectButton() {
  const { open } = useWeb3Modal();

  return (
    <button
      className="flex items-center gap-x-4 xl:gap-x-8"
      onClick={() => open()}
    >
      <FaWallet />
      <span className="hidden lg:block text-base lg:text-[32px]">wallet</span>
    </button>
  );
}
