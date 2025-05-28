import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCoins,
  faHistory,
  faDice,
} from "@fortawesome/free-solid-svg-icons";
import "./AddChipsSuccess.css";

const AddChipsSuccess = () => {
  const location = useLocation();
  const { amount, transactionId } = location.state || {};

  return (
    <div className="payment-success-page">
      <div className="success-container">
        <div className="success-icon">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>

        <h1 className="success-title">Payment Submitted!</h1>

        <div className="success-details">
          <div className="detail-item">
            <span className="detail-label">Transaction ID:</span>
            <span className="detail-value">{transactionId || "TXN123456789"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Amount:</span>
            <span className="detail-value">₹{amount || "0.00"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value success">Pending Approval</span>
          </div>
        </div>

        <div className="success-message">
          <FontAwesomeIcon icon={faCoins} className="message-icon" />
          <p>
            Your payment has been submitted successfully. Once verified by the admin,
            chips will be credited to your wallet.
          </p>
        </div>

        <div className="success-buttons">
          <Link to="/play" className="success-btn home-btn">
            <FontAwesomeIcon icon={faDice} /> Play
          </Link>
          <Link to="/transactions" className="success-btn history-btn">
            <FontAwesomeIcon icon={faHistory} /> View Transaction History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddChipsSuccess;
