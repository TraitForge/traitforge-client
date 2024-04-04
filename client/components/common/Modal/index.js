import React, { Children } from 'react';
import styles from './styles.module.scss';
import { useContextState } from '@/utils/context';

const Modal = ({Children}) => {
  const { isOpen, closeModal } = useContextState();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeBtn} onClick={closeModal}>x</button>
        {Children}
      </div>
    </div>
  );
};

export default Modal;
