import React, { useEffect } from 'react';
import './customalert.css'; // Add custom styles for the alert if needed.

interface CustomAlertProps {
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Adjust the duration as needed (e.g., 3000 ms for 3 seconds)

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="custom-alert">
      {message}
    </div>
  );
};

export default CustomAlert;
