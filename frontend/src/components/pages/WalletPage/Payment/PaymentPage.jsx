import React, { useState } from "react";
import "./PaymentPage.css";
import infoIcon from "../../../../assets/paytm-icon.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, paymentMethod } = location.state || {};

  const [utr, setUtr] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async () => {
    if (!/^[0-9]{12}$/.test(utr)) {
      setError("⚠️ Please enter a valid 12-digit UTR number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/deposit-requests/", // Make sure this matches your Django URL
        {
          amount: amount,
          utr_number: utr,
          payment_method: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Navigate on success
      navigate("/addchipssuccess", {
        state: {
          amount: amount,
          transactionId: response.data.request_id,
        },
      });
    } catch (error) {
      console.error("Deposit request failed:", error);

      // Show detailed error if available
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Failed to submit deposit request. Please try again.";

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <header className="payment-header">
        <h1 className="payment-title">PAYMENT</h1>
        <div className="gold-line"></div>
      </header>

      <div className="payment-card">
        <h2 className="card-title">Complete Your Payment</h2>

        <div className="qr-scanner-container">
          <div className="qr-scanner">
            <div className="qr-placeholder">
              <div className="qr-animation"></div>
            </div>
          </div>
        </div>

        <p className="scan-instruction">
          Scan this code using <strong>{paymentMethod}</strong> to pay ₹{amount}
        </p>

        <div className="payment-form">
          <div className="form-group">
            <label className="form-label">
              UTR Number
              <span className="info-tooltip">
                <span className="tooltip-text">
                  Unique Transaction Reference number provided by your bank
                </span>
              </span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter 12-digit UTR"
              value={utr}
              onChange={(e) => {
                setUtr(e.target.value);
                setError("");
              }}
              pattern="[0-9]{12}"
              maxLength="12"
              required
            />
            {error && <p className="utr-error">{error}</p>}
          </div>

          <button
            className="submit-btn"
            type="button"
            onClick={handleConfirmPayment}
            disabled={loading}
          >
            {loading ? "Submitting..." : "CONFIRM PAYMENT"}
          </button>
        </div>

        <div className="find-utr-section">
          <h4>How to Find Your UTR Number:</h4>
          <ul>
            <li>Check your bank SMS for the transaction confirmation</li>
            <li>Look for a 12-digit number labeled "UTR" or "Ref No"</li>
            <li>In PhonePe: Transactions → Select payment → View details</li>
            <li>In Google Pay: Open receipt → Check "Transaction ID"</li>
            <li>In Paytm: Passbook → Select transaction → View UTR</li>
          </ul>
        </div>
      </div>

      <div className="payment-instructions">
        <h3>ℹ️ Payment Verification Process:</h3>
        <ol>
          <li>Complete payment via {paymentMethod}</li>
          <li>Enter the 12-digit UTR number</li>
          <li>Click Confirm Payment</li>
          <li>Admin will verify & add chips to wallet</li>
        </ol>
        <div className="important-note">
          <strong>Note:</strong> Fake UTR numbers will result in account
          suspension.
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
