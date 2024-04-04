import { useWeb3Modal } from '@web3modal/ethers/react';
import styles from './styles.module.scss';
import { FaWallet } from 'react-icons/fa';

export default function ConnectButton() {

  const { open } = useWeb3Modal()

  return (
    <>
      <button className={styles.connectwallet} onClick={() => open()}><FaWallet/></button>
    </>
  )
}