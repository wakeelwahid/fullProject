
import React, { useState, useEffect } from 'react';
import './AgeVerification.css';

const AgeVerification = ({ onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasVerified = localStorage.getItem('ageVerified');
    if (!hasVerified) {
      setIsVisible(true);
    } else {
      onConfirm();
    }
  }, [onConfirm]);

  const handleConfirm = () => {
    localStorage.setItem('ageVerified', 'true');
    setIsVisible(false);
    onConfirm();
  };

  const handleCancel = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="age-verification-overlay">
      <div className="age-verification-popup">
        <div className="popup-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Age Verification Required</h2>
        <div className="warning-content">
          <p><strong>Important Notice:</strong></p>
          <ul>
            <li>You must be 18+ years old to access this website</li>
            <li>This game can be addictive</li>
            <li>We are not responsible for any addiction or losses</li>
            <li>Play responsibly and within your limits</li>
          </ul>
        </div>
        <div className="confirmation-text">
          <p>By continuing, you confirm that you are 18+ years old and understand the risks involved.</p>
        </div>
        <div className="popup-buttons">
          <button className="cancel-btn" onClick={handleCancel}>
            <i className="fas fa-times"></i> Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            <i className="fas fa-check"></i> I Confirm (18+)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;
