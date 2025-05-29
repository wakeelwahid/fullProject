import React, { useState, useEffect } from "react";
import adminAxios from "../../utils/adminAxios";
import "./panels.css";

const WithdrawRequestPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await adminAxios.get("admin/withdraw-requests/");
      setWithdrawals(res.data);
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const response = await adminAxios.post('admin/withdraw-action/', { withdraw_id: id, action });
      alert(response.data.message || `Withdrawal ${action}d successfully`);
      fetchWithdrawals(); // refresh list after action
    } catch (error) {
      console.error(`Failed to ${action} withdrawal:`, error);
      alert(`Failed to ${action} withdrawal: ${error.response?.data?.error || error.message}`);
    }
  };

  const filteredWithdrawals = withdrawals.filter((withdrawal) =>
    [
      withdrawal.user_info?.username,
      withdrawal.amount,
      withdrawal.created_at,
      withdrawal.is_approved ? "approved" : withdrawal.is_rejected ? "rejected" : "pending",
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="panel">
      <h2>Withdrawal Requests</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by user or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="panel-content">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id}>
                  <td>{withdrawal.id}</td>
                  <td>{withdrawal.user_info?.username}</td>
                  <td>₹{withdrawal.amount}</td>
                  <td>{new Date(withdrawal.created_at).toLocaleString()}</td>
                  <td
                    className={`status-cell ${
                      withdrawal.is_approved
                        ? "approved"
                        : withdrawal.is_rejected
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {withdrawal.is_approved
                      ? "Approved"
                      : withdrawal.is_rejected
                      ? "Rejected"
                      : "Pending"}
                  </td>
                  <td>
                    {!withdrawal.is_approved && !withdrawal.is_rejected ? (
                      <div className="set-btn">
                        <button 
                          className="action-btn approve"
                          onClick={() => handleAction(withdrawal.id, 'approve')}
                        >
                          Approve
                        </button>
                        <button 
                          className="action-btn reject"
                          onClick={() => handleAction(withdrawal.id, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WithdrawRequestPanel;