// import React from "react";
import "./MyProfile.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate(); // navigation ke liye

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // token hata do

    navigate("/"); // login page pe redirect
  };
  const [user, setUser] = useState({});
  const [wallet, setWallet] = useState({
    balance: "0.00",
    bonus: "0.00",
    winnings: "0.00",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, walletRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/profile/", { headers }),
          axios.get("http://127.0.0.1:8000/api/balance/", { headers }),
        ]);

        setUser(profileRes.data);
        setWallet(walletRes.data);
      } catch (err) {
        console.error("Failed to load profile or balance", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <div id="floatingCoins" className="animated-coins"></div>

      {/* Profile Header */}
      <header className="profile-header">
        <div className="header-content">
          <h1 className="profile-title">MY PROFILE</h1>
          <p className="profile-subtitle">Track your progress and earnings</p>
          <div className="profile-glow"></div>
        </div>
      </header>

      {/* Profile Card */}
      <div className="profile-card">
        {/* Personal Info Section */}
        <div className="profile-section">
          <h2 className="section-title">
            <i className="fas fa-user"></i> Personal Information
          </h2>
          <div className="user-info">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User"
              className="user-avatar"
            />
            <div className="user-details">
              <div className="user-name">{user.username}</div>
              <div className="user-id">ID: SK789456123</div>
              <div className="detail-row">
                <div className="detail-label">Phone:</div>
                <div className="detail-value">{user.mobile}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Email:</div>
                <div className="detail-value">{user.email}</div>
              </div>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">KYC Status:</div>
            <div className="detail-value">
              <span className="kyc-status">VERIFIED</span>
              <button className="edit-button">
                <i className="fas fa-edit"></i> Edit
              </button>
            </div>
            <Link to="/verification" className="kyc-button">
              <i className="fas fa-id-card"></i> Complete KYC
            </Link>
          </div>
        </div>

        {/* Referral Section */}
        <div className="profile-section">
          <h2 className="section-title">
            <i className="fas fa-gift"></i> Referral Earnings
          </h2>
          <div className="referral-stats">
            <div className="stat-card">
              <div className="stat-value">₹{wallet.balance}</div>
              <div className="stat-label">Total Earnings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">24</div>
              <div className="stat-label">Total Referrals</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">18</div>
              <div className="stat-label">Active Referrals</div>
            </div>
          </div>
          <div className="referral-code">
            <div>
              <div className="code-label">Your Referral Code:</div>
              <div className="code-text">RAHULKING</div>
            </div>
            <button className="copy-btn">
              <i className="fas fa-copy"></i> COPY CODE
            </button>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> LOGOUT
      </button>
    </div>
  );
};

export default ProfilePage;
