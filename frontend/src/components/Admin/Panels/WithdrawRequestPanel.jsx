
import React, { useState, useEffect } from 'react';
import adminAxios from '../../utils/adminAxios';
import './panels.css';

const WithdrawRequestPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await adminAxios.get('admin/withdraw-requests/');
      // Only show pending withdrawals in this panel
      const pendingWithdrawals = res.data.filter(withdraw => 
        !withdraw.is_approved && !withdraw.is_rejected
      );
      setWithdrawals(pendingWithdrawals);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (withdraw, action) => {
    setSelectedWithdraw(withdraw);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      await adminAxios.post('admin/withdraw-action/', { 
        withdraw_id: selectedWithdraw.id, 
        action: actionType 
      });
      setShowConfirmModal(false);
      fetchWithdrawals(); // refresh list after action
      alert(`Withdrawal request ${actionType}d successfully!`);
    } catch (error) {
      console.error(`Failed to ${actionType} withdrawal:`, error);
      alert(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
    }
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    setSelectedWithdraw(null);
    setActionType('');
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

  return (
    <div className="panel">
      <h2>Withdrawal Requests</h2>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{withdrawals.length}</span>
          <span className="stat-label">Pending Requests</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            ₹{withdrawals.reduce((sum, with_) => sum + parseFloat(with_.amount), 0).toFixed(2)}
          </span>
          <span className="stat-label">Total Amount</span>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by username, mobile, or amount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-message">Loading withdrawal requests...</div>
      ) : (
        <div className="panel-content">
          <table className="admin-table enhanced-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Details</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map(withdrawal => (
                  <tr key={withdrawal.id}>
                    <td>{withdrawal.id}</td>
                    <td className="user-details">
                      <div className="user-info">
                        <strong>{withdrawal.user?.username}</strong>
                        <span className="mobile">{withdrawal.user?.mobile}</span>
                      </div>
                    </td>
                    <td className="amount-cell">₹{withdrawal.amount}</td>
                    <td className="date-cell">
                      <div className="datetime">
                        <span className="date">{new Date(withdrawal.created_at).toLocaleDateString()}</span>
                        <span className="time">{new Date(withdrawal.created_at).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge pending">
                        PENDING
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn approve" 
                          onClick={() => handleActionClick(withdrawal, 'approve')}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="action-btn reject" 
                          onClick={() => handleActionClick(withdrawal, 'reject')}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No pending withdrawal requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedWithdraw && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="withdrawal-details">
                <h4>Withdrawal Request Details:</h4>
                <div className="detail-row">
                  <span>Username:</span>
                  <strong>{selectedWithdraw.user?.username}</strong>
                </div>
                <div className="detail-row">
                  <span>Mobile:</span>
                  <strong>{selectedWithdraw.user?.mobile}</strong>
                </div>
                <div className="detail-row">
                  <span>Amount:</span>
                  <strong>₹{selectedWithdraw.amount}</strong>
                </div>
                <div className="detail-row">
                  <span>Date:</span>
                  <strong>{new Date(selectedWithdraw.created_at).toLocaleString()}</strong>
                </div>
              </div>
              <div className="confirmation-message">
                Are you sure you want to <strong>{actionType}</strong> this withdrawal request?
                {actionType === 'approve' && (
                  <div className="approval-note">
                    ₹{selectedWithdraw.amount} will be deducted from the user's wallet.
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className={`confirm-btn ${actionType}`}
                onClick={confirmAction}
              >
                {actionType === 'approve' ? '✓ Approve' : '✗ Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawRequestPanel;
