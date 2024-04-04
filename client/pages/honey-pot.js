import React from 'react';
import styles from '@/styles/honeypot.module.scss';
import { Modal } from '@/components'; 
import { useContextState } from '@/utils/context';

function HoneyPot() {
  const {
    openModal,
    isOpen,
    ownerEntities,
    ethAmount,
    usdAmount
  } = useContextState();

  const modalContent = (
    <div className={styles.entityDisplay}>
      <h1>NUKE YOUR ENTITY</h1>
      <ul>
        {Array.isArray(ownerEntities) && ownerEntities.length > 0 ? (
          ownerEntities.map((entity, index) => (
            <EntityCard className={styles.entitycard} key={index}>
              {entity.name} - {entity.description}
            </EntityCard>
          ))
        ) : (
          <li>You don't own an Entity!</li>
        )}
      </ul>
    </div>
  );

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
             <Modal background = '/images/honeypot-background.jpg'>
          {modalContent}
            </Modal>
            )}
    </div>
  );
}

export default HoneyPot;
