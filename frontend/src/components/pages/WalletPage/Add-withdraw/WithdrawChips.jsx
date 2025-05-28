import React, { useState } from "react";
import "./WithdrawChips.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WithdrawChips = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(amount) < 100) {
      setError("Minimum withdrawal amount is ₹500.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // 🔁 Send only the amount
      const res = await axios.post(
        "http://127.0.0.1:8000/api/withdraw/",
        { amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Navigate to success page
      navigate("/withdrawalchipssuccess", {
        state: { amount },
      });
    } catch (err) {
      console.error("Withdrawal failed", err);
      setError("❌ Withdrawal failed. Please try again.");
    }
  };

  return (
    <div className="withdraw-container">
      <header className="withdraw-header">
        <h1 className="withdraw-title">WITHDRAW CHIPS</h1>
        <div className="gold-line" />
      </header>

      <div className="withdraw-card">
        <h2 className="card-title">Withdraw Chips to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              required
              min={100}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="amount-buttons">
            {[100, 500, 1000, 2000, 5000, 10000].map((amt) => (
              <button
                key={amt}
                type="button"
                className="amount-btn"
                onClick={() => setAmount(amt)}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          {/* <div className="form-group">
            <label className="form-label">Withdrawal Method</label>
            <div className="method-grid">
              <div>
                <span className="method-icon"></span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label"></label>
            <input type="text" className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">IFSC Code</label>
            <input
              type="text"
              className="form-input"
              placeholder="Bank IFSC Code"
              required
            />
          </div> */}

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="submit-btn">
            REQUEST WITHDRAWAL
          </button>
        </form>
      </div>

      <div className="withdrawal-info">
        <h3>ℹ️ Withdrawal Information:</h3>
        <ul>
          <li>Minimum withdrawal: ₹100</li>
          <li>Processing time: 5 to 10 minutes</li>
          <li>Daily limit: ₹50,000</li>
          <li>Bank charges may apply</li>
        </ul>
      </div>
    </div>
  );
};

export default WithdrawChips;
