
import React, { useState, useEffect } from 'react';
import adminAxios from '../../utils/adminAxios';
import './panels.css';

const WithdrawRequestPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [actionType, setActionType] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const showActionPopup = (withdraw, action) => {
    setSelectedWithdraw(withdraw);
    setActionType(action);
    setShowPopup(true);
  };

  const confirmAction = async () => {
    try {
      await adminAxios.post('admin/withdraw-action/', { 
        id: selectedWithdraw.id, 
        action: actionType 
      });
      
      setSuccessMessage(`Withdrawal ${actionType}d successfully for ${selectedWithdraw.user?.username} (${selectedWithdraw.user?.mobile})`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      
      fetchWithdrawals(); // refresh list
      setShowPopup(false);
    } catch (error) {
      console.error(`Failed to ${actionType} withdrawal:`, error);
      alert(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
      setShowPopup(false);
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
      time.toLowerCase().includes(searchTermLower)
    );
  });

  const getStats = () => {
    const totalAmount = withdrawals.reduce((sum, w) => sum + parseFloat(w.amount), 0);
    return {
      totalRequests: withdrawals.length,
      totalAmount: totalAmount.toFixed(2)
    };
  };

  const stats = getStats();

  return (
    <div className="panel">
      <h2>Withdrawal Requests</h2>
      
      <div className="withdraw-stats">
        <div className="stat-item">
          <span>Pending Requests</span>
          <span className="stat-number">{stats.totalRequests}</span>
        </div>
        <div className="stat-item">
          <span>Total Amount</span>
          <span className="stat-number">₹{stats.totalAmount}</span>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by user, mobile, amount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {showSuccess && (
        <div className="success-popup">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="loading-message">Loading withdrawal requests...</div>
      ) : (
        <div className="panel-content">
          <table className="admin-table withdraw-enhanced">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Details</th>
                <th>Amount</th>
                <th>Request Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map(withdrawal => (
                  <tr key={withdrawal.id}>
                    <td className="id-cell">#{withdrawal.id}</td>
                    <td className="user-details">
                      <div className="user-info">
                        <div className="username">{withdrawal.user?.username}</div>
                        <div className="mobile">{withdrawal.user?.mobile}</div>
                      </div>
                    </td>
                    <td className="amount-cell amount-negative">₹{withdrawal.amount}</td>
                    <td className="time-cell">
                      <div className="date">{new Date(withdrawal.created_at).toLocaleDateString()}</div>
                      <div className="time">{new Date(withdrawal.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td>
                      <div className='action-buttons'>
                        <button 
                          className="action-btn approve" 
                          onClick={() => showActionPopup(withdrawal, 'approve')}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="action-btn reject" 
                          onClick={() => showActionPopup(withdrawal, 'reject')}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No pending withdrawal requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showPopup && selectedWithdraw && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}</h3>
            <div className="popup-details">
              <div className="detail-row">
                <span>User:</span>
                <span>{selectedWithdraw.user?.username}</span>
              </div>
              <div className="detail-row">
                <span>Mobile:</span>
                <span>{selectedWithdraw.user?.mobile}</span>
              </div>
              <div className="detail-row">
                <span>Amount:</span>
                <span className="amount-highlight">₹{selectedWithdraw.amount}</span>
              </div>
            </div>
            <p className="popup-message">
              Are you sure you want to {actionType} this withdrawal request?
            </p>
            <div className="popup-buttons">
              <button 
                className={`popup-btn ${actionType === 'approve' ? 'confirm-btn' : 'reject-btn'}`}
                onClick={confirmAction}
              >
                Yes, {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
              <button 
                className="popup-btn cancel-btn" 
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawRequestPanel;
