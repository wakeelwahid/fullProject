
import React, { useState, useEffect } from 'react';
import adminAxios from '../../utils/adminAxios';
import './panels.css';

const DepositRequestPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [actionType, setActionType] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await adminAxios.get('admin/deposit-requests/');
      // Only show pending deposits in this panel
      const pendingDeposits = res.data.filter(deposit => deposit.status === 'pending');
      setDeposits(pendingDeposits);
    } catch (error) {
      console.error('Failed to fetch deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const showActionPopup = (deposit, action) => {
    setSelectedDeposit(deposit);
    setActionType(action);
    setShowPopup(true);
  };

  const confirmAction = async () => {
    try {
      await adminAxios.post('admin/deposit-action/', { 
        deposit_id: selectedDeposit.id, 
        action: actionType 
      });
      
      setSuccessMessage(`Deposit ${actionType}d successfully for ${selectedDeposit.user_info?.username} (${selectedDeposit.user_info?.mobile})`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      
      fetchDeposits(); // refresh list after action
      setShowPopup(false);
    } catch (error) {
      console.error(`Failed to ${actionType} deposit:`, error);
      alert(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
      setShowPopup(false);
    }
  };

  const filteredDeposits = deposits.filter((deposit) =>
    [
      deposit.user_info?.username,
      deposit.user_info?.mobile,
      deposit.amount,
      deposit.created_at,
      deposit.utr_number,
      deposit.status,
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStats = () => {
    const totalAmount = deposits.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    return {
      totalRequests: deposits.length,
      totalAmount: totalAmount.toFixed(2)
    };
  };

  const stats = getStats();

  return (
    <div className="panel">
      <h2>Deposit Requests</h2>
      
      <div className="deposit-stats">
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
          placeholder="Search by user, mobile, amount, UTR..."
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
        <div className="loading-message">Loading deposit requests...</div>
      ) : (
        <div className="panel-content">
          <table className="admin-table deposit-enhanced">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Details</th>
                <th>Amount</th>
                <th>UTR Number</th>
                <th>Request Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.length > 0 ? (
                filteredDeposits.map((deposit) => (
                  <tr key={deposit.id}>
                    <td className="id-cell">#{deposit.id}</td>
                    <td className="user-details">
                      <div className="user-info">
                        <div className="username">{deposit.user_info?.username}</div>
                        <div className="mobile">{deposit.user_info?.mobile}</div>
                      </div>
                    </td>
                    <td className="amount-cell amount-positive">₹{deposit.amount}</td>
                    <td className="utr-cell">{deposit.utr_number}</td>
                    <td className="time-cell">
                      <div className="date">{new Date(deposit.created_at).toLocaleDateString()}</div>
                      <div className="time">{new Date(deposit.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn approve"
                          onClick={() => showActionPopup(deposit, 'approve')}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => showActionPopup(deposit, 'reject')}
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
                    No pending deposit requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showPopup && selectedDeposit && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}</h3>
            <div className="popup-details">
              <div className="detail-row">
                <span>User:</span>
                <span>{selectedDeposit.user_info?.username}</span>
              </div>
              <div className="detail-row">
                <span>Mobile:</span>
                <span>{selectedDeposit.user_info?.mobile}</span>
              </div>
              <div className="detail-row">
                <span>Amount:</span>
                <span className="amount-highlight">₹{selectedDeposit.amount}</span>
              </div>
              <div className="detail-row">
                <span>UTR:</span>
                <span>{selectedDeposit.utr_number}</span>
              </div>
            </div>
            <p className="popup-message">
              Are you sure you want to {actionType} this deposit request?
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

export default DepositRequestPanel;
