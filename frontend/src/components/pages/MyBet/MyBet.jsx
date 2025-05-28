import React, { useEffect, useState } from "react";
import "./MyBet.css";
import axios from "axios";

const MyBet = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/view-bets-24h/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Group by game + timestamp
        const grouped = {};
        res.data.forEach((bet) => {
          const key = `${bet.game}|${bet.timestamp}`;
          if (!grouped[key]) {
            grouped[key] = {
              game: bet.game,
              timestamp: bet.timestamp,
              status: bet.status || "pending",
              bets: [],
            };
          }
          grouped[key].bets.push(bet);
        });

        setBets(Object.values(grouped));
      } catch (error) {
        console.error("Fetch error:", error);
        setBets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  return (
    <>
      <header className="bet-header">
        <div className="bet-logo">
          My <span className="highlight">Bets</span>
          <div className="bet-logo-underline"></div>
        </div>
      </header>

      <div className="my-container">
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : bets.length === 0 ? (
          <p style={{ textAlign: "center" }}>No bets found.</p>
        ) : (
          bets.map((group, idx) => (
            <div className="bet-card" key={idx}>
              <div className="bet-header">
                <span className="bet-market">{group.game?.toUpperCase()}</span>
                <span className="bet-date">{group.timestamp}</span>
              </div>

              <div className="bet-numbers">
                {group.bets.map((bet, i) => (
                  <div
                    key={i}
                    className={`bet-number-chip ${
                      bet.bet_type === "andar"
                        ? "andar"
                        : bet.bet_type === "bahar"
                        ? "bahar"
                        : ""
                    }`}
                  >
                    {bet.number} ₹{bet.amount}
                    {bet.bet_type === "andar" && (
                      <span className="bet-section-mark">A</span>
                    )}
                    {bet.bet_type === "bahar" && (
                      <span className="bet-section-mark">B</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bet-footer">
                <span
                  className={`bet-status ${
                    group.status === "live"
                      ? "bet-status-won"
                      : "bet-status-pending"
                  }`}
                >
                  {group.status === "live" ? "LIVE" : "Pending"}
                </span>
                <span className="bet-amount">
                  Total Numbers: {group.bets.length}
                </span>
                <span className="bet-payout">
                  amount: ₹
                  {group.bets.reduce((sum, b) => sum + Number(b.amount), 0)}
                </span>
              </div>
            </div>
          ))
        )}

        <a href="/" className="bet-back-btn">
          <i className="fas fa-arrow-left" /> Back to Dashboard
        </a>
      </div>
    </>
  );
};

export default MyBet;
