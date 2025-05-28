import React, { useEffect } from 'react';
import './TermsConditions.css';

const TermsConditions = () => {
  useEffect(() => {
    // Create floating legal icons
    const container = document.getElementById('floatingIcons');
    const icons = [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFD700"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFD700"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFD700"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>'
    ];
    
    for (let i = 0; i < 12; i++) {
      const icon = document.createElement('div');
      icon.className = 'floating-icon';
      icon.style.left = Math.random() * 100 + 'vw';
      icon.style.top = Math.random() * 100 + 'vh';
      icon.style.animationDelay = Math.random() * 10 + 's';
      icon.style.animationDuration = (Math.random() * 10 + 10) + 's';
      icon.style.backgroundImage = icons[Math.floor(Math.random() * icons.length)];
      
      if (container) container.appendChild(icon);
    }
  }, []);

  return (
    <div className="terms-container">
      <div id="floatingIcons"></div>
      
      <header className="terms-header">
        <h1 className="terms-title">TERMS & CONDITIONS</h1>
        <p className="last-updated">Last Updated: June 25, 2023</p>
      </header>

      <div className="terms-content">
        <h2 className="section-title">General Terms</h2>
        <ul className="terms-list">
          <li>By accessing and using our services, you agree to be bound by these terms.</li>
          <li>You must be at least 18 years old to participate in any games.</li>
          <li>All transactions are final unless otherwise stated in our refund policy.</li>
          <li>We reserve the right to modify these terms at any time without prior notice.</li>
          <li>The company reserves the right to refuse service to anyone for any reason at any time.</li>
          <li>You may not use our products for any illegal or unauthorized purpose.</li>
        </ul>

        <h2 className="section-title">Account Rules</h2>
        <ul className="terms-list">
          <li>One account per person is strictly enforced.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>Any suspicious activity must be reported immediately.</li>
          <li>Accounts may be suspended for violation of terms.</li>
          <li>Accounts inactive for more than 12 months may be subject to deactivation.</li>
          <li>You must provide accurate and complete information when creating an account.</li>
        </ul>

        <h2 className="section-title">Game Rules</h2>
        <ul className="terms-list">
          <li>All game results are final and cannot be disputed.</li>
          <li>Game timings and rules are subject to change without notice.</li>
          <li>Any attempt to manipulate game outcomes will result in permanent ban.</li>
          <li>Winnings are credited according to the declared payout structure.</li>
          <li>Minimum and maximum betting limits apply to all games.</li>
          <li>Technical errors may void plays and payouts at our discretion.</li>
        </ul>

        <div className="warning-box">
          <p><strong>Important:</strong> We are not responsible for any legal consequences that may arise from participating in games in jurisdictions where such activities are prohibited.</p>
        </div>

        <h2 className="section-title">Payment Terms</h2>
        <ul className="terms-list">
          <li>All deposits must be from payment methods registered in your name.</li>
          <li>Withdrawals are processed within 24-48 hours of request.</li>
          <li>A minimum balance may be required for withdrawal requests.</li>
          <li>We reserve the right to request KYC documentation for any transaction.</li>
          <li>Transaction fees may apply depending on your payment method.</li>
          <li>Chargebacks will result in immediate account suspension and possible legal action.</li>
        </ul>

        <h2 className="section-title">Responsible Gaming</h2>
        <ul className="terms-list">
          <li>Set limits for your deposits and playing time.</li>
          <li>Do not chase losses - gambling should be for entertainment only.</li>
          <li>If you feel you may have a gambling problem, seek help immediately.</li>
          <li>We offer self-exclusion options for players who need them.</li>
          <li>Reality checks are available upon request to track your playing time.</li>
          <li>We provide links to professional gambling help organizations.</li>
        </ul>

        <h2 className="section-title">Privacy Policy</h2>
        <ul className="terms-list">
          <li>We collect personal information to provide and improve our services.</li>
          <li>Your data may be used for identity verification and fraud prevention.</li>
          <li>We implement industry-standard security measures to protect your information.</li>
          <li>Cookies are used to enhance user experience and track preferences.</li>
          <li>We may share information with law enforcement when required by law.</li>
          <li>You have the right to request access to your personal data we hold.</li>
        </ul>

        <h2 className="section-title">Intellectual Property</h2>
        <ul className="terms-list">
          <li>All content on this platform is our exclusive property.</li>
          <li>Unauthorized copying, reproduction, or distribution is prohibited.</li>
          <li>Trademarks, logos, and service marks are registered and protected.</li>
          <li>User-generated content grants us a worldwide, royalty-free license.</li>
          <li>Reverse engineering or decompiling our software is strictly forbidden.</li>
        </ul>

        <h2 className="section-title">Limitation of Liability</h2>
        <ul className="terms-list">
          <li>We are not liable for any indirect, incidental, or consequential damages.</li>
          <li>Our total liability is limited to the amount you've paid us in the last 6 months.</li>
          <li>We do not guarantee uninterrupted or error-free service.</li>
          <li>We are not responsible for losses due to system failures or technical issues.</li>
          <li>Force majeure events may temporarily suspend our services without liability.</li>
        </ul>

        <div className="acceptance-section">
          <p className="acceptance-text">By continuing to use our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
          <button className="accept-btn">I AGREE TO THESE TERMS</button>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;