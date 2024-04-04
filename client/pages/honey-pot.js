import React from 'react';
import styles from '@/styles/honeypot.module.scss';
import { Modal } from '@/components'; 
import { useContextState } from '@/utils/context';

function HoneyPot() {
  const {
    openModal,
    isOpen,
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

      <img src= "/images/nukebutton.png" className={styles.nukeButton} onClick={() => openModal()} />
      {isOpen && (
             <Modal>
          {}
            </Modal>
            )}
    </div>
  );
}

export default HoneyPot;
