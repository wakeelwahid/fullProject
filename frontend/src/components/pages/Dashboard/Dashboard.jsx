import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">
        <span className="trophy-icon">🏆</span> Leaderboard
      </h1>
      
      <div className="leaderboard-table">
        {/* Table Header */}
        <div className="table-header">
          <div className="header-cell rank-header">Rank</div>
          <div className="header-cell">Username</div>
          <div className="header-cell amount-header">Amount</div>
        </div>
        
        {/* Table Rows - Completely Static Data */}
        <div className="table-row top-rank">
          <div className="cell rank-cell">
            <span className="gold-badge">1</span>
          </div>
          <div className="cell">GoldWinner</div>
          <div className="cell amount-cell">₹12,50,000</div>
        </div>
        
        <div className="table-row top-rank">
          <div className="cell rank-cell">
            <span className="silver-badge">2</span>
          </div>
          <div className="cell">SilverStar</div>
          <div className="cell amount-cell">₹9,87,500</div>
        </div>
        
        <div className="table-row top-rank">
          <div className="cell rank-cell">
            <span className="bronze-badge">3</span>
          </div>
          <div className="cell">BronzeBoss</div>
          <div className="cell amount-cell">₹8,42,150</div>
        </div>
        
       
        
      </div>
    </div>
  );
};

export default Dashboard;