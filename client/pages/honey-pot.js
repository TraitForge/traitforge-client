import React, { useEffect, useState } from 'react';
import styles from '@/styles/honeypot.module.scss';
import { Modal, EntityCard } from '@/components';
import { appStore } from '@/utils/appStore';
import { observer } from 'mobx-react';
import { useContextState } from '@/utils/context';

const HoneyPot = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { ethAmount, usdAmount } = useContextState();
  const { ownerEntities } = appStore;

  useEffect(() => {
    appStore.getOwnersEntities();
  }, []);

  return (
    <div className={styles.honeyPotContainer}>
      <h1>The HoneyPot</h1>

      <div className={styles.frameContainer}>
        <div className={styles.ethAmount}>
          <h1>{ethAmount} ETH</h1>
          <p>≈ ${usdAmount} USD</p>
        </div>
      </div>

      <img
        src="/images/nukebutton.png"
        className={styles.nukeButton}
        onClick={() => setIsOpen(true)}
      />
    </div>
  );
});

export default HoneyPot;
