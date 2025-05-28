import React from 'react';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import './SupportPage.css'; 

const SupportPage = () => {
  return (
    <div className="support-page">
      <header className="support-header">
        <h1 className="support-title">24/7 SUPPORT</h1>
        <p className="support-subtitle">Contact us anytime through WhatsApp or Telegram for instant assistance</p>
      </header>

      <div className="support-options">
        <div className="support-card">
          <div className="support-icon whatsapp-icon">
            <FaWhatsapp />
          </div>
          <h2 className="support-card-title">WhatsApp Support</h2>
          <p className="support-card-desc">
            Get instant help from our support team via WhatsApp. We're available 24 hours a day.
          </p>
          <a 
            href="https://wa.me/919876543210" 
            className="contact-btn whatsapp-btn"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaWhatsapp /> Chat on WhatsApp
          </a>
        </div>

        <div className="support-card">
          <div className="support-icon telegram-icon">
            <FaTelegram />
          </div>
          <h2 className="support-card-title">Telegram Support</h2>
          <p className="support-card-desc">
            Message us on Telegram for quick responses. Our team is always ready to help.
          </p>
          <a 
            href="https://t.me/sattakingsupport" 
            className="contact-btn telegram-btn"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaTelegram /> Message on Telegram
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;