import React from 'react';
import './modal.css';

type ModalProps = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isVisible: boolean; // Control modal visibility
};

const Modal: React.FC<ModalProps> = ({ message, onConfirm, onCancel, isVisible }) => {
    if (!isVisible) return null; // Hide the modal when not visible

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-message">{message}</div>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="btn-confirm">Yes</button>
                    <button onClick={onCancel} className="btn-cancel">No</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
