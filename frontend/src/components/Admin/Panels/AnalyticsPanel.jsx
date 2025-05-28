import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faMoneyBillWave,
  faHandHoldingDollar,
  faArrowUp,
  faArrowDown,
  faUserPlus,
  faTrophy,
  faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const AnalyticsPanel = () => {
  const [earningsFilter, setEarningsFilter] = useState("7days");
  const [showAllStats, setShowAllStats] = useState(false);

  const isDarkMode =
    document.documentElement.getAttribute("data-theme") !== "light";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: "#ffffff",
          font: {
            weight: 500,
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255,255,255,0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#8f9bb3",
          font: {
            size: 11,
          },
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#8f9bb3",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const getEarningsData = (filter) => {
    // Mock data - repace with actual API call
    if (filter === "7days") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Daily Earnings",
            data: [12500, 19000, 15000, 22000, 18000, 25000, 20000],
            borderColor: isDarkMode ? "#4CAF50" : "#2E7D32",
            backgroundColor: isDarkMode
              ? "rgba(76, 175, 80, 0.2)"
              : "rgba(46, 125, 50, 0.15)",
            fill: true,
          },
        ],
      };
    } else {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Monthly Earnings",
            data: [95000, 88000, 105000, 98000],
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            fill: true,
          },
        ],
      };
    }
  };

  const earningData = getEarningsData(earningsFilter);

  const userActivityData = {
    labels: ["March", "April", "May"],
    datasets: [
      {
        label: "Total Active Users",
        data: [1245, 1532, 1678],
        backgroundColor: isDarkMode ? "#2196F3" : "#1976D2",
      },
      {
        label: "New Users",
        data: [245, 332, 378],
        backgroundColor: isDarkMode ? "#4CAF50" : "#2E7D32",
      },
    ],
  };

  const transactionStats = {
    today: {
      deposits: "₹52,000",
      withdrawals: "₹38,000",
    },
    monthly: {
      deposits: "₹15,80,000",
      withdrawals: "₹12,45,000",
    },
    total: {
      deposits: "₹1,25,80,000",
      withdrawals: "₹98,45,000",
    },
  };

  return (
    <div className="analytics-panel">
      <div className="stats-grid">
        <div className="stat-box gradient-purple">
          <div className="stat-title">
            <FontAwesomeIcon icon={faMoneyBillWave} className="icon-glow" />{" "}
            Total Revenue
          </div>
          <div className="stat-value">₹1,234,567</div>
        </div>
        <div className="stat-box gradient-blue">
          <div className="stat-title">
            <FontAwesomeIcon icon={faUsers} className="icon-glow" /> Total Users
          </div>
          <div className="stat-value">15,234</div>
        </div>
        <div className="stat-box gradient-green">
          <div className="stat-title">
            <FontAwesomeIcon icon={faArrowUp} className="icon-glow" /> Pending
            Deposits
          </div>
          <div className="stat-value">128</div>
        </div>
        <div className="stat-box gradient-orange">
          <div className="stat-title">
            <FontAwesomeIcon icon={faArrowDown} className="icon-glow" /> Pending
            Withdrawals
          </div>
          <div className="stat-value">95</div>
        </div>

        <div className="stat-box gradient-cyan">
          <div className="stat-title">
            <FontAwesomeIcon icon={faMoneyBillTransfer} className="icon-glow" />{" "}
            Today's Earnings
          </div>
          <div className="stat-value">₹25,430</div>
        </div>
        <div className="stat-box gradient-success">
          <div className="stat-title">
            <FontAwesomeIcon icon={faArrowUp} className="icon-glow" /> Today's
            Deposits
          </div>
          <div className="stat-value">₹25,430</div>
        </div>
        <div className="stat-box gradient-warning">
          <div className="stat-title">
            <FontAwesomeIcon icon={faArrowDown} className="icon-glow" /> Today's
            Withdrawals
          </div>
          <div className="stat-value">₹25,430</div>
        </div>
        <div className="stat-box gradient-indigo">
          <div className="stat-title">
            <FontAwesomeIcon icon={faMoneyBillWave} className="icon-glow" />{" "}
            Total Deposits
          </div>
          <div className="stat-value">₹25,430</div>
        </div>
        <div className="stat-box gradient-rose">
          <div className="stat-title">
            <FontAwesomeIcon icon={faMoneyBillTransfer} className="icon-glow" />{" "}
            Total Withdrawals
          </div>
          <div className="stat-value">₹25,430</div>
        </div>
        <div className="stat-box gradient-teal">
          <div className="stat-title">
            <FontAwesomeIcon icon={faUserPlus} className="icon-glow" /> New
            Users Today
          </div>
          <div className="stat-value">84</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <div className="chart-header">
            <h3>Revenue Analytics</h3>
            <select
              className="earnings-filter"
              value={earningsFilter}
              onChange={(e) => setEarningsFilter(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="1month">Last Month</option>
            </select>
          </div>
          <Line data={earningData} options={chartOptions} />
        </div>
        <div className="chart-box">
          <h3>Active Users (Last 3 Months)</h3>
          <Bar data={userActivityData} options={chartOptions} />
        </div>
      </div>

      <div className="recent-data-grid">
     

        <div className="recent-box">
          <h3>Recent Transactions</h3>
          <div className="recent-list">
            {[
              {
                user: "John Doe",
                amount: "₹5,000",
                type: "Deposit",
                time: "5 min ago",
              },
              {
                user: "Alice Smith",
                amount: "₹3,500",
                type: "Withdrawal",
                time: "12 min ago",
              },
              {
                user: "Bob Wilson",
                amount: "₹7,800",
                type: "Deposit",
                time: "25 min ago",
              },
            ].map((tx, i) => (
              <div key={i} className="recent-item">
                <div className="item-user">{tx.user}</div>
                <div className="item-details">
                  <span
                    className={
                      tx.type === "Deposit"
                        ? "amount-positive"
                        : "amount-negative"
                    }
                  >
                    {tx.amount}
                  </span>
                  <span className="item-time">{tx.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-box">
          <h3>Recent Winners</h3>
          <div className="recent-list">
            {[
              {
                user: "Mike Johnson",
                game: "MILAN DAY",
                amount: "₹12,000",
                time: "2 min ago",
              },
              {
                user: "Sarah Davis",
                game: "RAJDHANI",
                amount: "₹8,500",
                time: "15 min ago",
              },
              {
                user: "Tom Brown",
                game: "KALYAN",
                amount: "₹15,000",
                time: "30 min ago",
              },
            ].map((winner, i) => (
              <div key={i} className="recent-item">
                <div className="item-user">
                  <FontAwesomeIcon icon={faTrophy} className="winner-icon" />{" "}
                  {winner.user}
                </div>
                <div className="item-details">
                  <span className="game-name">{winner.game}</span>
                  <span className="amount-positive">{winner.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
