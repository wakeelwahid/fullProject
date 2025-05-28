import React, { useState } from "react";
import "./panels.css";
import axios from "axios";
import adminAxios from "../../utils/adminAxios";

const DeclareResultPanel = () => {
  const [selectedGame, setSelectedGame] = useState("");
  const [winningNumber, setWinningNumber] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const games = [
    { name: "DISAWER", lockTime: "02:30 AM", payout: "91x/9x" },
    { name: "GALI", lockTime: "11:00 PM", payout: "91x/9x" },
    { name: "FARIDABAD", lockTime: "06:00 PM", payout: "91x/9x" },
    { name: "GHAZIABAD", lockTime: "09:30 PM", payout: "91x/9x" },
    { name: "JAIPUR KING", lockTime: "04:50 PM", payout: "100x/10x" },
    { name: "DIAMOND KING", lockTime: "Every 2:30 hrs", payout: "90x/9x" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGame || !winningNumber) {
      alert("Please select game and enter winning number");
      return;
    }
    setShowConfirm(true);
  };

  const confirmDeclare = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const res = await adminAxios.post("admin/declare-result/", {
        game: selectedGame.toLowerCase(),
        winning_number: winningNumber,
      });

      if (res.status === 200 || res.status === 201) {
        setShowConfirm(false);
        setShowSuccess(true);
        setWinningNumber("");
        setSelectedGame("");

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error(
        "Error declaring result:",
        error.response?.data || error.message
      );
      alert("Failed to declare result. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel declare-result-panel">
      <h2>Declare Result</h2>
      <form onSubmit={handleSubmit} className="declare-result-form">
        <div className="form-group">
          <label>Select Game</label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="game-select dark"
          >
            <option value="">Select a game</option>
            {games.map((game) => (
              <option key={game.name} value={game.name}>
                {game.name} - Lock: {game.lockTime} - Payout: {game.payout}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Winning Number</label>
          <input
            type="text"
            value={winningNumber}
            onChange={(e) => setWinningNumber(e.target.value)}
            placeholder="Enter winning number"
            maxLength="2"
            pattern="[0-9]{1,2}"
            className="number-input dark"
          />
        </div>

        <button type="submit" className="declare-btn" disabled={loading}>
          {loading ? "Declaring..." : "Declare Result"}
        </button>
      </form>

      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Confirm Result Declaration</h3>
            <p>Game: {selectedGame}</p>
            <p>Payout: Number bets get higher multiplier, Andar/Bahar get lower multiplier</p>
            <p>Number: {winningNumber}</p>
            <div className="popup-buttons">
              <button onClick={confirmDeclare} className="confirm-btn">
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-popup">
          <h3>Result Declared Successfully!</h3>
          <p>
            You can modify or change the result from the game history section.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeclareResultPanel;
