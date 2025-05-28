import React, { useEffect, useState } from "react";
import "./BetSuccessPage.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

const BetSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { game, numbers, amount } = location.state || {};
  const [ticket, setTicket] = useState("");
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  useEffect(() => {
    setCurrentDateTime();
    createCoins();

    const interval = setInterval(() => {
      const coins = document.querySelectorAll(".coin");
      if (coins.length < 20) {
        createCoins();
      }
    }, 3000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 15000); // auto-redirect after 15 sec

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const generateTicketNumber = () => {
    const num = Math.floor(Math.random() * 90000) + 10000;
    setTicket(`SK2023${num}`);
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN");
    const timeStr = now.toLocaleTimeString("en-IN", { hour12: false });
    setDateTime({ date: dateStr, time: timeStr });
  };

  const createCoins = () => {
    const container = document.getElementById("floating-coins");
    if (!container) return;

    const coinCount = 15;
    const coins = ["\uf155", "\uf51e", "\uf51d", "\uf0d6", "\uf3ff"];
    container.innerHTML = "";

    for (let i = 0; i < coinCount; i++) {
      const coin = document.createElement("i");
      coin.className = "coin fas";
      coin.innerHTML = coins[Math.floor(Math.random() * coins.length)];

      const size = Math.random() * 20 + 15;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 20 + 10;

      Object.assign(coin.style, {
        fontSize: `${size}px`,
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      });

      container.appendChild(coin);
    }
  };

  return (
    <>
      <div className="header">
        <div className="logo">
          THANK<span>YOU</span>
        </div>
      </div>

      <div className="bet-container">
        <div className="success-container">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="success-title">BET PLACED SUCCESSFULLY!</h1>

          <div className="ticket-id">
            GAME : {" "}
            <span id="ticket-number">
              {game?.toUpperCase() || "UNKNOWN"}
            </span>
          </div>

          <div className="bet-details">
            <div className="detail-row">
              <span className="detail-label">Market:</span>
              <span className="detail-value">
                {game?.toUpperCase() || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Numbers:</span>
              <span className="detail-value">
                {numbers?.join(", ") || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value">₹{amount || "0"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{dateTime.date}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{dateTime.time}</span>
            </div>
          </div>

          <div className="btn-container">
            <Link to="/mychips" className="btn btn-secondary">
              <i className="fas fa-receipt"></i> VIEW BET
            </Link>
            <Link to="/" className="btn btn-primary">
              <i className="fas fa-home"></i> HOME
            </Link>
          </div>
        </div>

        <div className="timing-info">
          <h3 className="timing-title">
            <i className="fas fa-clock"></i> RESULT TIMING
          </h3>
          <table className="timing-table">
            <thead>
              <tr>
                <th>Market</th>
                <th>Open Time</th>
                <th>Close Time</th>
                <th>Result Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RAJDHANI NIGHT</td>
                <td>10:00 PM</td>
                <td>11:50 PM</td>
                <td>12:15 AM</td>
              </tr>
              <tr>
                <td>MUMBAI DAY</td>
                <td>11:30 AM</td>
                <td>12:30 PM</td>
                <td>1:15 PM</td>
              </tr>
              <tr>
                <td>KALYAN DAY</td>
                <td>1:00 PM</td>
                <td>3:00 PM</td>
                <td>3:30 PM</td>
              </tr>
              <tr>
                <td>MILAN DAY</td>
                <td>2:00 PM</td>
                <td>4:00 PM</td>
                <td>4:30 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="floating-coins" id="floating-coins"></div>
    </>
  );
};

export default BetSuccessPage;
