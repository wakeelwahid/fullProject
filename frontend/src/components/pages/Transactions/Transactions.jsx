import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/transaction-history/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Format the API data to your table structure
        const formatted = res.data.map((tx, index) => ({
          id: index + 1,
          date: new Date(tx.created_at).toLocaleDateString(),
          time: new Date(tx.created_at).toLocaleTimeString(),
          type: tx.type,
          amount:
            (tx.type === "deposit" || tx.type === "win" || tx.type === "bonus"
              ? "+"
              : "-") + `₹${tx.amount}`,
          status: tx.status || "completed",
        }));

        setTransactions(formatted);
      } catch (error) {
        console.error("Failed to load transactions", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="transactions-container">
      <div className="transactions-content">
        <header className="transactions-header">
          <h1 className="transactions-title">TRANSACTION HISTORY</h1>
        </header>
        <div className="transaction-card">
          <h2 className="card-title">Your Transactions</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search transactions..."
              className="search-input"
            />
          </div>
          <div className="table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      {transaction.date} / <span>{transaction.time}</span>
                    </td>
                    <td>{transaction.type}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
