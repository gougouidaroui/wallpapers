import React from 'react';
import './Popup.css';

const Popup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <p>{message}</p>
        <div className="popup-buttons">
          <button onClick={onConfirm} className="popup-button confirm">Yes</button>
          <button onClick={onCancel} className="popup-button cancel">No</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
