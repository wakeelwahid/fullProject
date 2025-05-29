import React, { useState, useEffect } from 'react';
import adminAxios from '../../utils/adminAxios';
import './panels.css';

const WithdrawRequestPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await adminAxios.get('admin/withdraw-requests/');
      setWithdrawals(res.data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await adminAxios.post('admin/withdraw-requests/', { id, action });
      fetchWithdrawals(); // refresh list
    } catch (error) {
      console.error(`Failed to ${action} withdrawal:`, error);
      alert(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
    }
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const searchTermLower = searchTerm.toLowerCase();
    const userInfo = `${withdrawal.user?.username || ''} ${withdrawal.user?.mobile || ''}`.toLowerCase();
    const date = new Date(withdrawal.created_at).toLocaleDateString();
    const time = new Date(withdrawal.created_at).toLocaleTimeString();

    return (
      userInfo.includes(searchTermLower) ||
      withdrawal.amount.toString().includes(searchTerm) ||
      date.includes(searchTerm) ||
      time.toLowerCase().includes(searchTermLower) ||
      (withdrawal.status && withdrawal.status.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <div className="panel">
      <h2>Withdrawal Requests</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by user, amount, or status..."
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
                <th>Mobile</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map(withdrawal => (
                <tr key={withdrawal.id}>
                  <td>{withdrawal.id}</td>
                  <td className="user-cell">{withdrawal.user?.username}</td>
                  <td>{withdrawal.user?.mobile}</td>
                  <td className="amount-cell">₹{withdrawal.amount}</td>
                  <td>{new Date(withdrawal.created_at).toLocaleDateString()}</td>
                  <td>{new Date(withdrawal.created_at).toLocaleTimeString()}</td>
                  <td className={`status-cell ${withdrawal.status}`}>
                    {withdrawal.is_approved ? 'approved' : 
                     withdrawal.is_rejected ? 'rejected' : 'pending'}
                  </td>
                  <td>
                    {!withdrawal.is_approved && !withdrawal.is_rejected && (
                      <div className='set-btn'>
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
                    )}
                    {(withdrawal.is_approved || withdrawal.is_rejected) && (
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