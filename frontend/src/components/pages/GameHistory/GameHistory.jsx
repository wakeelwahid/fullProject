import React, { useEffect, useState } from "react";
import "./GameHistory.css";
import axios from "axios";

const GameHistory = () => {
  const [bets, setBets] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [selectedGame, setSelectedGame] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/view-bets-30d/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Grouping by game + timestamp
        const grouped = {};
        res.data.forEach((bet) => {
          const key = `${bet.game}|${bet.timestamp}`;
          if (!grouped[key]) {
            grouped[key] = {
              game: bet.game,
              timestamp: bet.timestamp,
              status: bet.status || "pending",
              winning_number: bet.winning_number || null,
              bets: [],
            };
          }
          grouped[key].bets.push(bet);
        });

        const betGroups = Object.values(grouped);
        setBets(betGroups);
        setFilteredBets(betGroups);
      } catch (error) {
        console.error("Fetch error:", error);
        setBets([]);
        setFilteredBets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  useEffect(() => {
    if (selectedGame === "all") {
      setFilteredBets(bets);
    } else {
      setFilteredBets(
        bets.filter(
          (b) => b.game.toLowerCase() === selectedGame.toLowerCase()
        )
      );
    }
  }, [selectedGame, bets]);

  return (
    <div className="game-history-container">
      <header className="history-header">
        <h1 className="history-title">GAME HISTORY</h1>
      </header>

      <div className="filter-controls">
        <div className="filter-group">
          <span className="filter-label">Game:</span>
          <select
            className="filter-select"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            <option value="all">All Games</option>
            <option value="JAIPUR KING">Jaipur King</option>
            <option value="GALI">Gali</option>
            <option value="DISAWAR">Disawer</option>
            <option value="FARIDABAD">Faridabad</option>
            <option value="DIAMOND KING">Diamond King</option>
            <option value="GHAZIABAD">Ghaziabad</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : filteredBets.length === 0 ? (
        <p style={{ textAlign: "center" }}>No bets found.</p>
      ) : (
        filteredBets.map((group, idx) => (
          <div className="game-card" key={idx}>
            <div className="game-header">
              <div className="game-name">{group.game?.toUpperCase()}</div>
              <div className="game-date">{group.timestamp}</div>
            </div>

            <div className="game-numbers">
              {group.bets.map((bet, i) => {
                const isAndar = bet.bet_type === "andar";
                const isBahar = bet.bet_type === "bahar";
                const mark = isAndar ? "A" : isBahar ? "B" : "";
                const extraClass = isAndar ? "andar" : isBahar ? "bahar" : "";
                const isWinning = group.winning_number === bet.number;

                return (
                  <div
                    key={i}
                    className={`number-ball ${extraClass} ${
                      isWinning ? "winning-number" : ""
                    }`}
                  >
                    {bet.number}
                    {mark && <span className="bet-section-mark">{mark}</span>}
                    <div className="bet-amount">₹{bet.amount}</div>
                  </div>
                );
              })}
            </div>

            <div className="game-details">
              <div className="detail-item">
                <div>
                  <div className="detail-label">Total Amount</div>
                  <div className="detail-value total-amount">
                    ₹
                    {group.bets.reduce(
                      (sum, b) => sum + Number(b.amount),
                      0
                    )}
                  </div>
                </div>
                <div>
                  <div className="detail-label">Winning Number</div>
                  <div className="detail-value">
                    {group.winning_number ?? "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="winning-info">
              <div className="winning-number-display">
                Winning Number:{" "}
                <span className="winning-number-value">
                  {group.winning_number ?? "Pending"}
                </span>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="pagination">
        <button className="page-btn">&lt;</button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">&gt;</button>
      </div>
    </div>
  );
};

export default GameHistory;
