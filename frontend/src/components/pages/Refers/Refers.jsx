import React, { useEffect, useState } from "react";
import "./Refers.css";
import axios from "axios";

const Refers = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/user/my-referrals/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReferralData(res.data);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  return (
    <>
      <div id="floatingCoins" />

      <header className="refer-header">
        <h1 className="refer-title">REFER &amp; EARN</h1>
        <p className="refer-subtitle">
          Invite your friends and earn ₹50 for each successful referral plus 1% lifetime commission on their winnings!
        </p>
      </header>

      <div className="referral-card">
        {/* Benefits Section */}
        <div className="benefits-section">
          <h2 className="benefits-title">Why Refer Friends?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon"><i className="fas fa-rupee-sign" /></div>
              <h3 className="benefit-title">Instant ₹50 Bonus</h3>
              <p className="benefit-desc">Get ₹50 when your friend signs up and deposits.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><i className="fas fa-percentage" /></div>
              <h3 className="benefit-title">1% Lifetime Commission</h3>
              <p className="benefit-desc">Earn 1% of their winnings forever.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><i className="fas fa-gift" /></div>
              <h3 className="benefit-title">No Limits</h3>
              <p className="benefit-desc">Refer unlimited friends and earn more.</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          {loading ? (
            <p className="loading">Loading stats...</p>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{referralData?.total_referrals || 0}</div>
                <div className="stat-label">Total Referrals</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">₹{referralData?.direct_bonus || 0}</div>
                <div className="stat-label">Direct Bonus Earned</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">₹{referralData?.commission_earned || 0}</div>
                <div className="stat-label">Commission Earned</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">₹{referralData?.total_earned || 0}</div>
                <div className="stat-label">Total Earnings</div>
              </div>
            </div>
          )}
        </div>

        {/* Referral Code Section */}
        <div className="code-section">
          <h3 className="code-title">Your Unique Referral Code</h3>
          <div className="referral-code-box">
            <div className="code-label">Share this code with your friends</div>
            <div className="code-text">{referralData?.referral_code || "N/A"}</div>
          </div>
          <div className="share-buttons">
            <button
              className="share-btn copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(referralData?.referral_code || "");
                alert("Referral code copied!");
              }}
            >
              <i className="fas fa-copy" /> COPY CODE
            </button>
            <button className="share-btn whatsapp-btn">
              <i className="fab fa-whatsapp" /> SHARE ON WHATSAPP
            </button>
            <button className="share-btn telegram-btn">
              <i className="fab fa-telegram" /> SHARE ON TELEGRAM
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="how-it-works">
          <h2 className="benefits-title" style={{ textAlign: "center" }}>How It Works</h2>
          <div className="steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Share Your Code</h3>
              <p className="step-desc">Share your unique referral code with friends.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Friend Registers</h3>
              <p className="step-desc">Your friend signs up and deposits.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Start Earning</h3>
              <p className="step-desc">Get ₹50 + 1% commission on their winnings.</p>
            </div>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="commission-section">
          <h2 className="benefits-title">Commission Structure</h2>
          <div className="commission-cards">
            <div className="commission-card">
              <div className="commission-amount">₹50</div>
              <p className="commission-desc">Instant bonus per referral</p>
            </div>
            <div className="commission-card">
              <div className="commission-amount">1%</div>
              <p className="commission-desc">Lifetime commission</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Refers;
