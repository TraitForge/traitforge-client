import React from 'react';
import styles from '@/styles/honeypot.module.scss';
import { useContextState } from '@/utils/context';

function HoneyPot() {
  const {
    openModal,
    ethAmount,
    usdAmount
  } = useContextState();

  return (
    <div className={styles.honeyPotContainer}>
      <h1>The HoneyPot</h1>

      <div className={styles.frameContainer}>
        <div className={styles.ethAmount}>
          <h1>{ethAmount} ETH</h1>
          <p>≈ ${usdAmount} USD</p>
        </div>
      </div>

      <img src= "/images/nukebutton.png" className={styles.nukeButton} onClick={() => openModal(<div>*honeypot modal*</div>)} />
    </div>
  );
}

export default HoneyPot;
