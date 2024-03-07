import React from 'react';
import '../styles/ConnectWalletModal.css';

const ConnectWalletModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="connect-modal-overlay" onClick={onClose}>
            <div className="connect-modal-content" onClick={e => e.stopPropagation()}>
                <button className="connect-close-button" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default ConnectWalletModal;