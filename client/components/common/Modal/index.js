import React from 'react';
import styles from './styles.module.scss';
import { useContextState } from '@/utils/context';

const Modal = () => {
  const { isOpen, modalContent, closeModal } = useContextState();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeBtn} onClick={closeModal}>x</button>
        {modalContent}
      </div>
    </div>
  );
};

export default Modal;
