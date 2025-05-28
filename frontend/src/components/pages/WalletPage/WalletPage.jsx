
import './WalletPage.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const WalletPage = () => {
  const [wallet, setWallet] = useState({ balance: '0.00', bonus: '0.00', winnings: '0.00' });

  useEffect(() => {
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/balance/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWallet(res.data);
    } catch (error) {
      console.error("Failed to fetch wallet balance", error);
    }
  };

  fetchBalance();
}, []);

  return (
    <div>
      <div id="floatingCoins"></div>

      {/* Wallet Header */}
      <header className="wallet-header">
        <h1 className="wallet-title">MY WALLET</h1>
      </header>

      {/* KYC Button */}
      <div className="kyc-btn-container">
        <Link to="/verification" className="kyc-button">
          <i className="fas fa-id-card"></i> COMPLETE KYC
        </Link>
      </div>

      {/* Wallet Card */}
      <div className="wallet-card">
        {/* Balance Section */}
        <div className="balance-section">
          <div className="balance-label">TOTAL BALANCE</div>
          <div className="total-balance">₹{wallet.balance}</div>
          <div className="balance-subtext">Total amount</div>
        </div>

        {/* Amount Cards */}
        <div className="amount-cards">
          <div className="amount-card deposit-amount">
            <div className="amount-label">WINNINGS AMOUNT</div>
            <div className="amount-value">₹{wallet.winnings}</div>
            <div className="amount-subtext"> Available for withdrawal</div>
          </div>

          <div className="amount-card winnings-amount">
            <div className="amount-label">BONUS AMOUNT</div>
            <div className="amount-value">₹{wallet.bonus}</div>
            <div className="amount-subtext">Total bonus</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/addchips" className="action-btn deposit-btn">
            <i className="fas fa-rupee-sign"></i> ADD CASH
          </Link>

          <Link to="/withdrawchips" className="action-btn withdraw-btn">
            <i className="fas fa-wallet"></i> WITHDRAW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
