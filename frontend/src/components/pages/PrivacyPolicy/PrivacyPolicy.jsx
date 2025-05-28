import React, { useEffect } from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    // Create floating currency notes
    const container = document.getElementById('floatingNotes');
    const denominations = [500, 1000, 2000, 5000];
    
    for (let i = 0; i < 12; i++) {
      const note = document.createElement('div');
      note.className = 'floating-note';
      note.style.left = Math.random() * 100 + 'vw';
      note.style.top = Math.random() * 100 + 'vh';
      note.style.animationDelay = Math.random() * 10 + 's';
      note.style.animationDuration = (Math.random() * 10 + 10) + 's';
      
      // Random currency note
      const amount = denominations[Math.floor(Math.random() * denominations.length)];
      note.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" fill="%23FFD700"><rect width="100" height="50" rx="5"/><text x="50" y="30" font-size="14" text-anchor="middle" fill="black">₹${amount}</text></svg>')`;
      
      if (container) container.appendChild(note);
    }
  }, []);

  return (
    <div className="privacy-container">
      <div id="floatingNotes"></div>
      
      <header className="privacy-header">
        <h1 className="privacy-title">PRIVACY POLICY</h1>
        <p className="last-updated">Last Updated: June 20, 2023</p>
      </header>

      <div className="privacy-section">
        <h2 className="section-title">Data Collection</h2>
        <div className="section-content">
          <p>We collect the following information to provide our services:</p>
          
          <ul className="privacy-list">
            <li><strong>Personal Details:</strong> Name, contact information, date of birth</li>
            <li><strong>Payment Information:</strong> Transaction history and payment methods</li>
            <li><strong>Game Activity:</strong> Bets placed, results, and account balance</li>
            <li><strong>Device Information:</strong> IP address, browser type, and operating system</li>
          </ul>
          
          <div className="warning-box">
            <p><strong>Note:</strong> We never store your complete payment details. All transactions are processed through secure payment gateways.</p>
          </div>
        </div>
      </div>

      <div className="privacy-section">
        <h2 className="section-title">Cookies & Tracking</h2>
        <div className="section-content">
          <div className="sub-section">
            <h3 className="sub-title">Essential Cookies</h3>
            <p>Required for website functionality and account security.</p>
          </div>
          
          <div className="sub-section">
            <h3 className="sub-title">Analytics Cookies</h3>
            <p>Help us understand how players use our platform.</p>
          </div>
          
          <div className="sub-section">
            <h3 className="sub-title">Advertising Cookies</h3>
            <p>Used to show relevant promotions and offers.</p>
          </div>
        </div>
      </div>

      <div className="privacy-section">
        <h2 className="section-title">Data Security</h2>
        <div className="section-content">
          <p>We implement multiple security measures:</p>
          
          <ul className="privacy-list">
            <li>256-bit SSL encryption for all data transfers</li>
            <li>Regular security audits and penetration testing</li>
            <li>Two-factor authentication for account access</li>
            <li>Secure tokenization for payment processing</li>
          </ul>
        </div>
      </div>

      <div className="privacy-section">
        <h2 className="section-title">Third-Party Sharing</h2>
        <div className="section-content">
          <p>We may share data with:</p>
          
          <ul className="privacy-list">
            <li>Payment processors for transaction completion</li>
            <li>Regulatory authorities as required by law</li>
            <li>Service providers assisting with platform operations</li>
          </ul>
          
          <div className="warning-box">
            <p><strong>Important:</strong> We never sell your personal data to third-party marketers.</p>
          </div>
        </div>
      </div>

      <div className="privacy-section contact-section">
        <h2 className="section-title">Contact Our Privacy Team</h2>
        <div className="section-content">
          <p>For privacy concerns or data requests:</p>
          
          <ul className="privacy-list" style={{ textAlign: 'center', listStyle: 'none' }}>
            <li><strong>Telegram:</strong> @SattaKingPrivacy</li>
            <li><strong>Email:</strong> privacy@sattaking.com</li>
            <li><strong>Hours:</strong> 24/7 Support</li>
          </ul>
          
          <a href="https://t.me/SattaKingPrivacy" className="contact-btn">
            Message Us on Telegram
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;