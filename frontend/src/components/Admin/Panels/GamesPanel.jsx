
import React from 'react';
import './panels.css';

const GamesPanel = () => {
  const handleReset = (gameId) => {
    if (window.confirm('Are you sure you want to reset all stats for this game?')) {
      // Add API call here to reset game stats
      console.log('Resetting stats for game:', gameId);
    }
  };

  const games = [
    {
      id: 1,
      name: "DISAWAR",
      openTime: "05:15 PM",
      closeTime: "05:00 PM",
      status: "Active",
      totalBets: 15678,
      totalAmount: 2345600,
      totalEarnings: 456700,
      monthlyEarnings: 34500
    },
    {
      id: 2,
      name: "GALI",
      openTime: "11:00 PM",
      closeTime: "10:50 PM",
      status: "Active",
      totalBets: 12456,
      totalAmount: 1876500,
      totalEarnings: 345600,
      monthlyEarnings: 28900
    },
    {
      id: 3,
      name: "FARIDABAD",
      openTime: "06:15 PM",
      closeTime: "06:00 PM",
      status: "Active",
      totalBets: 13567,
      totalAmount: 1987600,
      totalEarnings: 378900,
      monthlyEarnings: 31200
    },
    {
      id: 4,
      name: "GHAZIABAD",
      openTime: "08:40 PM",
      closeTime: "08:30 PM",
      status: "Active",
      totalBets: 11234,
      totalAmount: 1654300,
      totalEarnings: 298700,
      monthlyEarnings: 25600
    },
    {
      id: 5,
      name: "JAIPUR KING",
      openTime: "03:00 PM",
      closeTime: "02:45 PM",
      status: "Active",
      totalBets: 10789,
      totalAmount: 1432100,
      totalEarnings: 267800,
      monthlyEarnings: 23400
    },
    {
      id: 6,
      name: "DIAMOND KING",
      openTime: "04:30 PM",
      closeTime: "04:15 PM",
      status: "Active",
      totalBets: 9876,
      totalAmount: 1234500,
      totalEarnings: 234500,
      monthlyEarnings: 21800
    }
  ];

  return (
    <div className="panel games-panel">
      <h2>Games Management</h2>
      
      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className="game-stats-card">
            <div className="game-header">
              <h3>{game.name}</h3>
              <span className={`status-badge ${game.status.toLowerCase()}`}>
                {game.status}
              </span>
            </div>
            
            <div className="game-timings">
              <div>
                <span className="timing-label">Open:</span>
                <span className="timing-value">{game.openTime}</span>
              </div>
              <div>
                <span className="timing-label">Close:</span>
                <span className="timing-value">{game.closeTime}</span>
              </div>
            </div>

            <div className="game-stats">
              <div className="stat-item">
                <span className="stat-label">Total Bets</span>
                <span className="gm-stat-value">{game.totalBets.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Amount</span>
                <span className="gm-stat-value">₹{game.totalAmount.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Earnings</span>
                <span className="gm-stat-value">₹{game.totalEarnings.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Monthly Earnings</span>
                <span className="gm-stat-value">₹{game.monthlyEarnings.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Monthly Bets</span>
                <span className="gm-stat-value">₹{game.monthlyEarnings.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Monthly Bets amount</span>
                <span className="gm-stat-value">₹{game.monthlyEarnings.toLocaleString()}</span>
              </div>
            </div>

            <div className="game-actions">
              <button className="reset-btn" onClick={() => handleReset(game.id)}>
                Reset Stats
              </button>
            </div>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPanel;
