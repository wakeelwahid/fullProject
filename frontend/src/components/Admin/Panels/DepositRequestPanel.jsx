import React, { useState, useEffect } from 'react';
import adminAxios from '../../utils/adminAxios';
import './panels.css';

const DepositRequestPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await adminAxios.get('admin/deposit-requests/');
      setDeposits(res.data);
    } catch (error) {
      console.error('Failed to fetch deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await adminAxios.post('admin/deposit-action/', { deposit_id: id, action });
      fetchDeposits(); // refresh list after action
    } catch (error) {
      console.error(`Failed to ${action} deposit:`, error);
    }
  };

  const filteredDeposits = deposits.filter((deposit) =>
    [
      deposit.user_info?.username,
      deposit.amount,
      deposit.created_at,
      deposit.utr_number,
      deposit.status,
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="panel">
      <h2>Deposit Requests</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by user, UTR, or status..."
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
                <th>UTR Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.map((deposit) => (
                <tr key={deposit.id}>
                  <td>{deposit.id}</td>
                  <td>{deposit.user_info?.username}</td>
                  <td>₹{deposit.amount}</td>
                  <td>{new Date(deposit.created_at).toLocaleString()}</td>
                  <td>{deposit.utr_number}</td>
                  <td className={`status-cell ${deposit.status}`}>{deposit.status}</td>
                  <td>
                    {deposit.status === 'pending' ? (
                      <div className="set-btn">
                        <button
                          className="action-btn approve"
                          onClick={() => handleAction(deposit.id, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => handleAction(deposit.id, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>✓</span>
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

export default DepositRequestPanel;
