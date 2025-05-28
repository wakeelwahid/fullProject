import React, { useEffect } from 'react';
import './RefundPolicy.css';

const RefundPolicy = () => {
  useEffect(() => {
    // Create floating coins
    const container = document.getElementById('floatingCoins');
    for (let i = 0; i < 15; i++) {
      const coin = document.createElement('div');
      coin.className = 'floating-coin';
      coin.style.left = Math.random() * 100 + 'vw';
      coin.style.top = Math.random() * 100 + 'vh';
      coin.style.animationDelay = Math.random() * 5 + 's';
      coin.style.animationDuration = (Math.random() * 5 + 5) + 's';
      if (container) container.appendChild(coin);
    }
  }, []);

  return (
    <div className="refund-container">
      <div id="floatingCoins"></div>
      
      <header className="refund-header">
        <h1 className="refund-title">REFUND POLICY</h1>
        <p className="last-updated">Last Updated: June 15, 2023</p>
      </header>

      <div className="refund-section">
        <h2 className="section-title">Our 7-Day Refund Policy</h2>
        <div className="section-content">
          <p>At Satta King, we offer a strict 7-day refund policy from the date of your initial payment. All refunds will be processed to the original payment method.</p>
          
          <div className="highlight-box">
            <p><strong>Note:</strong> Refund requests must be made within 7 days of transaction. Refunds will be issued to the original payment source within 3-5 business days after approval.</p>
          </div>
        </div>
      </div>

      <div className="refund-section">
        <h2 className="section-title">Refund Conditions</h2>
        <div className="section-content">
          <div className="sub-section">
            <h3 className="sub-title">Eligible for Refund</h3>
            <ul className="refund-list">
              <li>Duplicate or incorrect payments</li>
              <li>Unauthorized transactions</li>
              <li>Technical errors from our system</li>
              <li>Requests made within 7 days of payment</li>
            </ul>
          </div>
          
          <div className="sub-section">
            <h3 className="sub-title">Not Eligible for Refund</h3>
            <ul className="refund-list">
              <li>Amounts used in gameplay or betting</li>
              <li>Transactions older than 7 days</li>
              <li>Bonuses or promotional amounts</li>
              <li>Suspected fraudulent activities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="refund-section">
        <h2 className="section-title">Refund Process</h2>
        <div className="section-content">
          <div className="sub-section">
            <h3 className="sub-title">Step 1: Submit Request</h3>
            <p>Contact our support team via WhatsApp or Telegram with your transaction details.</p>
          </div>
          
          <div className="sub-section">
            <h3 className="sub-title">Step 2: Verification</h3>
            <p>Our team will verify your identity and transaction (24-48 hours).</p>
          </div>
          
          <div className="sub-section">
            <h3 className="sub-title">Step 3: Processing</h3>
            <p>Approved refunds are processed within 3-5 business days to your original payment method.</p>
          </div>
          
          <a href="https://wa.me/919876543210" className="refund-btn">
            Request Refund via WhatsApp
          </a>
        </div>
      </div>

      <div className="refund-section contact-info">
        <h2 className="section-title">Contact Support</h2>
        <div className="section-content">
          <p>For refund inquiries or assistance:</p>
          <ul className="refund-list">
            <li><strong>WhatsApp:</strong> +91 XXXX-XXXXXX</li>
            <li><strong>Telegram:</strong> @SattaKingSupport</li>
            <li><strong>Email:</strong> refunds@sattaking.com</li>
            <li><strong>Hours:</strong> 10AM - 6PM (Mon-Sat)</li>
          </ul>
          <p>Please include your transaction ID in all communications.</p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;