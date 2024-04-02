import React from 'react';
import styles from './styles.module.scss';

const Modal = () => {
  const { isOpen, modalContent, closeModal } = useModal();

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
