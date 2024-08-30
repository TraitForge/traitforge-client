import React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import styles from './styles.module.scss';

type ModalTypes = {
  background?: string;
  isOpen: boolean;
  closeModal: () => void;
  modalClasses?: string;
  containerClass?: string;
  page?: 'forging' | 'nuke'; // New prop for determining the page
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

const RewardModal = ({
  children,
  background,
  isOpen,
  closeModal,
  modalClasses,
  containerClass,
  page,
}: ModalTypes) => {
  const modalRoot = document.getElementById('modal-root');
  const modalStyle = {
    ...(background && { backgroundImage: `url(${background})` }),
    ...(page === 'nuke' && { boxShadow: '0px 0px 14px 4px rgba(128, 0, 128, 0.8)' }), // Purple shadow
    ...(page === 'forging' && { boxShadow: '0px 0px 14px 4px rgba(255, 0, 0, 0.7)' }), // Red shadow
  };

  if (!isOpen || !modalRoot) return null;

  const contClasses = classNames(
    'relative bg-center bg-no-repeat object-contain rounded-3xl',
    containerClass
  );

  return createPortal(
    <div
      className={`${styles.modalOverlay} ${modalClasses ? modalClasses : ''}`}
      onClick={closeModal}
    >
      <div
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
        className={contClasses}
      >
        {children}
        <button
          aria-label="close modal button"
          className="text-white absolute top-5 right-5"
          onClick={closeModal}
        >
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
    modalRoot
  );
};

export default RewardModal;