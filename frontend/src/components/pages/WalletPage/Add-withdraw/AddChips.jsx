import React, { useState, useEffect } from "react";
import "./AddChips.css";
import phonepeIcon from "../../../../assets/icons8-phone-pe-48.png";
import googlepayIcon from "../../../../assets/icons8-google-pay-24.png";
import paytmIcon from "../../../../assets/paytm-icon.png";
import bhimIcon from "../../../../assets/icons8-bhim-48.png";
import { Link, useNavigate } from "react-router-dom";


const AddChips = () => {
  const [amount, setAmount] = useState("");
  const [bonus, setBonus] = useState(0);
  const [gst, setGst] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const handleAmountChange = (value) => {
    setAmount(value);
    const gstAmount = parseFloat(value) * 0.28;
    const bonusAmount = parseFloat(value) * 0.05;
    setGst(gstAmount.toFixed(2));
    setBonus(bonusAmount.toFixed(2));
  };

  const handleUPISelect = (method) => {
    if (!amount || parseFloat(amount) < 100) {
      setPopupMessage("⚠️ Please enter minimum ₹100 to continue.");
      return;
    }

    navigate("/payment", {
      state: {
        amount,
        paymentMethod: method,
      },
    });
  };

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => setPopupMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  return (
    <div className="deposit-container">
      <header className="deposit-header">
        <h1 className="deposit-title">UPI DEPOSIT</h1>
        <div className="gold-line"></div>
      </header>

      <div className="deposit-card">
        <h2 className="card-title">Add Money via UPI</h2>

        <div className="form-group">
          <label className="form-label">Deposit Amount (₹)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            min="100"
            required
          />
        </div>
        {popupMessage && <div className="popup-message">{popupMessage}</div>}
        <div className="amount-buttons">
          {[100, 200, 500, 1000, 5000, 10000].map((amt) => (
            <button
              key={amt}
              onClick={() => handleAmountChange(amt)}
              className="amount-btn"
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <div className="calculation-box">
          <div className="calculation-row">
            <span>Deposit Amount (Excl. Govt. Tax)</span>
            <span>₹{(amount - gst).toFixed(2)}</span>
          </div>
          <div className="calculation-row">
            <span>Govt. Tax (28% GST)</span>
            <span>₹{gst}</span>
          </div>
          <div className="calculation-row">
            <span>Cashback Bonus</span>
            <span>+₹{gst}</span>
          </div>
          <div className="calculation-row">
            <span>Total (A + B)</span>
            <span>₹{amount}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">UPI Payment Method</label>
          <div className="upi-grid">
            {[
              { name: "PhonePe", icon: phonepeIcon },
              { name: "Google Pay", icon: googlepayIcon },
              { name: "Paytm", icon: paytmIcon },
              { name: "BHIM UPI", icon: bhimIcon },
            ].map(({ name, icon }) => (
              <Link
                key={name}
                to="/purchasechips"
                state={{ amount, paymentMethod: name }}
                className="upi-option"
                onClick={(e) => {
                  if (!amount || parseFloat(amount) < 100) {
                    e.preventDefault();
                    setPopupMessage(
                      "⚠️ Please enter minimum ₹100 to continue."
                    );
                  }
                }}
              >
                <img className="upi-icon" src={icon} alt={name} />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="deposit-info">
        <h3>📌 Deposit Information:</h3>
        <ul>
          <li>Minimum deposit: ₹100</li>
          <li>Instant UPI deposits (Max ₹50,000)</li>
          <li>28% GST applicable on all deposits</li>
          <li>5% cashback on deposits above ₹2000</li>
          <li>Wallet balance updated after admin approval</li>
        </ul>
      </div>
    </div>
  );
};

export default AddChips;
