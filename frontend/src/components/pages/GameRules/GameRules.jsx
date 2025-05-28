
import React from 'react';
import './GameRules.css';

const GameRules = () => {
  return (
    <div className="game-rules-container">
      <header className="rules-header">
        <h1 className="rules-title">GAME RULES</h1>
      </header>

      <div className="rules-content">
        <div className="rules-section">
          <h2>Basic Rules</h2>
          <ul>
            <li>All games start at their designated time</li>
            <li>Numbers range from 00-99</li>
            <li>Results are declared as per schedule</li>
            <li>Minimum bet amount: ₹10</li>
            <li>Maximum bet amount: ₹10,000</li>
          </ul>
        </div>

        <div className="rules-section">
          <h2>Betting Types</h2>
          <div className="bet-type">
            <h3>Single Digit (0-9)</h3>
            <p>Bet on any single digit. Win 10x your bet amount.</p>
          </div>
          <div className="bet-type">
            <h3>Jodi (00-99)</h3>
            <p>Bet on exact 2-digit number. Win 100x your bet amount.</p>
          </div>
        </div>

        <div className="rules-section">
          <h2>Important Notes</h2>
          <ul>
            <li>All bets must be placed before game closing time</li>
            <li>Once placed, bets cannot be cancelled</li>
            <li>Results are final and cannot be disputed</li>
            <li>Maintain adequate balance before placing bets</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameRules;
