import React, { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import "./panels.css";

const TransactionsPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await adminAxios.get("admin/transactions/"); // Fixed API endpoint path
        // Transform the API data to match your existing UI structure
        const formattedData = res.data.map(tx => ({
          id: tx.id,
          user: tx.user?.username || "N/A",
          type: tx.transaction_type,
          amount: `₹${tx.amount}`,
          status: tx.status,
          date: new Date(tx.created_at).toLocaleString(),
          utrNumber: extractUtrNumber(tx.note)
        }));
        setTransactions(formattedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to load transactions. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Helper function to extract UTR number more reliably
  const extractUtrNumber = (note) => {
    if (!note) return "N/A";
    
    // Handle different UTR note formats
    const utrPattern = /(UTR|utr|Utr)[:\s]*([a-zA-Z0-9]+)/i;
    const match = note.match(utrPattern);
    
    return match ? match[2] : "N/A";
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.utrNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="panel">
      <div className="transaction-stats">
        <div className="stat-item">
          <span>Total Transactions</span>
          <span>{transactions.length}</span>
        </div>
        <div className="stat-item">
          <span>Total Amount</span>
          <span>₹{transactions.reduce((sum, tx) => sum + parseFloat(tx.amount.replace('₹', '') || 0), 0).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by user, type, amount, status, date or UTR..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-message">Loading transactions...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="panel-content">
          <table className="admin-table transaction-enhanced">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>UTR Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.user}</td>
                    <td>
                      <span
                        className={`transaction-type ${transaction.type.toLowerCase()}`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td
                      className={
                        transaction.type.toLowerCase() === "deposit"
                          ? "amount-positive"
                          : "amount-negative"
                      }
                    >
                      {transaction.amount}
                    </td>
                    <td>
                      <span
                        className={`transaction-status ${transaction.status.toLowerCase()}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td>{transaction.date}</td>
                    <td>{transaction.utrNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
                    No transactions found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsPanel;