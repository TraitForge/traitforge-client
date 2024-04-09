import React from 'react';
import { createPortal } from 'react-dom';

import styles from './styles.module.scss';
import { useContextState } from '@/utils/context';

const Modal = ({ children, background }) => {
  const { isOpen, closeModal } = useContextState();

  const modalStyle = background
    ? {
      backgroundImage: `url(${background})`,
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    }
    : {};

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div style={modalStyle} onClick={e => e.stopPropagation()} className="relative w-[100%] lg:w-[900px]">
        {children}
        <button aria-label='close modal button' className={styles.closebutton} onClick={closeModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.75 5.25l-13.5 13.5M18.75 18.75L5.25 5.25"
            ></path>
          </svg>
        </button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
