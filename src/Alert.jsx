import React, { useState, useEffect } from 'react';
import './Alert.css'; // Optional: for styling

const Alert = ({ message, duration = 2000, onClose }) => {
  useEffect(() => {
    // Set a timer to hide the alert after `duration` milliseconds
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="alert">
      {message}
    </div>
  );
};

export default Alert;
