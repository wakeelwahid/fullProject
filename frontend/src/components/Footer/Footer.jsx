import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="satta-footer">
      <hr />
      {/* Flower Bubble Animation */}
      <div className="flower-bubbles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bubble" />
        ))}
      </div>

      {/* Horizontal Links Row */}
      {/* <div className="footer-links-row">
        <a href="/"><i className="fas fa-home"></i> Home</a>
        <a href="/results"><i className="fas fa-list-ol"></i> Results</a>
        <a href="/charts"><i className="fas fa-chart-line"></i> Charts</a>
        <a href="/tips"><i className="fas fa-lightbulb"></i> Tips</a>
        <a href="/contact"><i className="fas fa-phone-alt"></i> Contact</a>
      </div> */}

      {/* Footer Content */}
      <div className="footer-container">
        

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/refund"><i className="fas fa-undo"></i> Refund Policy</Link></li>
            <li><a href="/responsible"><i className="fas fa-shield-alt"></i> Responsible Gaming</a></li>
            <li><a href="/about"><i className="fas fa-info-circle"></i> About Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/disclaimer"><i className="fas fa-gavel"></i> Disclaimer</Link></li>
            <li><Link to="/privacy"><i className="fas fa-lock"></i> Privacy Policy</Link></li>
            <li><Link to="/terms"><i className="fas fa-file-contract"></i> Terms</Link></li>
          </ul>
        </div>


      </div>

      {/* Copyright & Disclaimer */}
      <div className="footer-bottom">
        <p>© 2024 <span>Satta King</span>. All Rights Reserved.</p>
        <p className="disclaimer">
          Disclaimer: This website is for entertainment purposes only. Gambling is illegal in many jurisdictions.
        </p>
      </div>
    </footer>
  );
};

export default Footer;