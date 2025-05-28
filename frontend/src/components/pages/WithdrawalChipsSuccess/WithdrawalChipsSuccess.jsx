import React, { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faWallet,
  faHome,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import "./WithdrawalChipsSuccess.css";

const WithdrawalChipsSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const transactionId = state?.transactionId || `TXN${Date.now()}`;
  const amount = state?.amount || "0.00";
  const status = "Pending";

  // ✅ Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="withdrawal-success-page">
      <div className="success-container">
        <div className="success-icon">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>

        <h1 className="success-title">Withdrawal Submitted!</h1>

        <div className="success-details">
          <div className="detail-item">
            <span className="detail-label">Transaction ID:</span>
            <span className="detail-value">{transactionId}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Amount:</span>
            <span className="detail-value">₹{amount}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value success">{status}</span>
          </div>
        </div>

        <div className="success-message">
          <FontAwesomeIcon icon={faWallet} className="message-icon" />
          <p>
            Your withdrawal request has been submitted. It will be credited to
            your account after admin approval.
            <hr />
            <p className="auto-redirect">Redirecting to home in 5 seconds...</p>
          </p>
          
        </div>

        <div className="success-buttons">
          <Link to="/" className="success-btn home-btn">
            <FontAwesomeIcon icon={faHome} /> Back to Home
          </Link>
          <Link to="/transactions" className="success-btn history-btn">
            <FontAwesomeIcon icon={faHistory} /> View Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalChipsSuccess;
