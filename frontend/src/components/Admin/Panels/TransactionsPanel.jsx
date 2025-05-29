import React, { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import "./panels.css";

const TransactionsPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await adminAxios.get("admin/transactions/");
        // Transform the API data to match your existing UI structure
        const formattedData = res.data.map(tx => ({
          id: tx.id,
          user: tx.user?.username || "N/A",
          mobile: tx.user?.mobile || "N/A",
          type: tx.transaction_type,
          amount: `₹${tx.amount}`,
          status: tx.status,
          date: new Date(tx.created_at).toLocaleString(),
          note: tx.note || "N/A"
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

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTransactions, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.note.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || transaction.type.toLowerCase() === filter;

    return matchesSearch && matchesFilter;
  });

  const getStats = () => {
    const deposits = transactions.filter(tx => tx.type === 'deposit');
    const withdrawals = transactions.filter(tx => tx.type === 'withdraw');
    const pending = transactions.filter(tx => tx.status === 'pending');
    const approved = transactions.filter(tx => tx.status === 'approved');
    const rejected = transactions.filter(tx => tx.status === 'rejected');

    return {
      totalTransactions: transactions.length,
      deposits: deposits.length,
      withdrawals: withdrawals.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length
    };
  };

  const stats = getStats();

  return (
    <div className="panel">
      <h2>All Transactions</h2>
      
      <div className="transaction-stats">
        <div className="stat-item">
          <span>Total</span>
          <span>{stats.totalTransactions}</span>
        </div>
        <div className="stat-item">
          <span>Deposits</span>
          <span>{stats.deposits}</span>
        </div>
        <div className="stat-item">
          <span>Withdrawals</span>
          <span>{stats.withdrawals}</span>
        </div>
        <div className="stat-item">
          <span>Pending</span>
          <span>{stats.pending}</span>
        </div>
        <div className="stat-item">
          <span>Approved</span>
          <span>{stats.approved}</span>
        </div>
        <div className="stat-item">
          <span>Rejected</span>
          <span>{stats.rejected}</span>
        </div>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Filter by Type:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdraw">Withdrawals</option>
          </select>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by user, mobile, type, amount, status, or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading transactions...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="panel-content">
          <div className="table-container">
            <table className="admin-table transaction-enhanced">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Mobile</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Note/UTR</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.user}</td>
                    <td>{transaction.mobile}</td>
                    <td>
                      <span
                        className={`transaction-type ${transaction.type.toLowerCase()}`}
                      >
                        {transaction.type.toUpperCase()}
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
                        {transaction.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{transaction.date}</td>
                    <td>{transaction.note}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-results">
                    No transactions found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPanel;