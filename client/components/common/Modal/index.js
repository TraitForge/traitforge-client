import React from 'react';
import { useModal } from '@/utils/modalContext';

const Modal = () => {
  const { isOpen, modalContent, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className='overlay'>
      <div className='modalContainer'>
        <button className='closeBtn' onClick={closeModal}>x</button>
        {modalContent}
      </div>
    </div>
  );
};

export default Modal;
