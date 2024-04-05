import React from 'react';
import styles from './styles.module.scss';
import { useContextState } from '@/utils/context';

const Modal = ({children, background}) => {
  const { isOpen, closeModal } = useContextState();
  const modalStyle = background ? { 
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center'} : {};

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} style={modalStyle} onClick={e => e.stopPropagation()}>
      <button className={styles.closebutton} onClick={closeModal}> close </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
