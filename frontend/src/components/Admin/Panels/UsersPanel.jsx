
import React, { useState, useEffect } from 'react';
import adminAxios from '../../utils/adminAxios';
import './panels.css';

const UsersPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    minBalance: '',
    maxBalance: '',
    minDeposit: '',
    maxDeposit: '',
    minWithdraw: '',
    maxWithdraw: '',
    minEarning: '',
    maxEarning: '',
    minReferrals: '',
    maxReferrals: '',
    status: 'all'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get('admin/users-stats/');
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      minBalance: '',
      maxBalance: '',
      minDeposit: '',
      maxDeposit: '',
      minWithdraw: '',
      maxWithdraw: '',
      minEarning: '',
      maxEarning: '',
      minReferrals: '',
      maxReferrals: '',
      status: 'all'
    });
  };

  const applyFilters = (user) => {
    const balance = parseFloat(user.balance);
    const totalDeposit = parseFloat(user.total_deposit);
    const totalWithdraw = parseFloat(user.total_withdraw);
    const totalEarning = parseFloat(user.total_earning);
    const totalReferrals = user.total_referrals;

    // Status filter
    if (filters.status !== 'all' && user.status !== filters.status) {
      return false;
    }

    // Balance filters
    if (filters.minBalance && balance < parseFloat(filters.minBalance)) return false;
    if (filters.maxBalance && balance > parseFloat(filters.maxBalance)) return false;

    // Deposit filters
    if (filters.minDeposit && totalDeposit < parseFloat(filters.minDeposit)) return false;
    if (filters.maxDeposit && totalDeposit > parseFloat(filters.maxDeposit)) return false;

    // Withdraw filters
    if (filters.minWithdraw && totalWithdraw < parseFloat(filters.minWithdraw)) return false;
    if (filters.maxWithdraw && totalWithdraw > parseFloat(filters.maxWithdraw)) return false;

    // Earning filters
    if (filters.minEarning && totalEarning < parseFloat(filters.minEarning)) return false;
    if (filters.maxEarning && totalEarning > parseFloat(filters.maxEarning)) return false;

    // Referrals filters
    if (filters.minReferrals && totalReferrals < parseInt(filters.minReferrals)) return false;
    if (filters.maxReferrals && totalReferrals > parseInt(filters.maxReferrals)) return false;

    return true;
  };

  const filteredUsers = users.filter(user => {
    // Search filter
    const searchMatch = [
      user.username,
      user.mobile,
      user.email,
      user.status
    ].join(' ').toLowerCase().includes(searchTerm.toLowerCase());

    return searchMatch && applyFilters(user);
  });

  if (loading) {
    return (
      <div className="panel">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchUsers} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Users Management ({filteredUsers.length} users)</h2>
        <button onClick={fetchUsers} className="refresh-btn">Refresh</button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by username, mobile, email, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Balance Range (₹)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minBalance}
                onChange={(e) => handleFilterChange('minBalance', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxBalance}
                onChange={(e) => handleFilterChange('maxBalance', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Total Deposit Range (₹)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minDeposit}
                onChange={(e) => handleFilterChange('minDeposit', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxDeposit}
                onChange={(e) => handleFilterChange('maxDeposit', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Total Withdraw Range (₹)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minWithdraw}
                onChange={(e) => handleFilterChange('minWithdraw', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxWithdraw}
                onChange={(e) => handleFilterChange('maxWithdraw', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Total Earning Range (₹)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minEarning}
                onChange={(e) => handleFilterChange('minEarning', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxEarning}
                onChange={(e) => handleFilterChange('maxEarning', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Referrals Range</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minReferrals}
                onChange={(e) => handleFilterChange('minReferrals', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxReferrals}
                onChange={(e) => handleFilterChange('maxReferrals', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
        
        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-filters-btn">Clear Filters</button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Total Deposit</th>
              <th>Total Withdraw</th>
              <th>Total Earning</th>
              <th>Today Deposit</th>
              <th>Today Withdraw</th>
              <th>Total Referrals</th>
              <th>Referral Earnings</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.mobile}</td>
                <td>{user.email}</td>
                <td>₹{parseFloat(user.balance).toFixed(2)}</td>
                <td>₹{parseFloat(user.total_deposit).toFixed(2)}</td>
                <td>₹{parseFloat(user.total_withdraw).toFixed(2)}</td>
                <td>₹{parseFloat(user.total_earning).toFixed(2)}</td>
                <td>₹{parseFloat(user.today_deposit).toFixed(2)}</td>
                <td>₹{parseFloat(user.today_withdraw).toFixed(2)}</td>
                <td>{user.total_referrals}</td>
                <td>₹{parseFloat(user.referral_earnings).toFixed(2)}</td>
                <td>
                  <span className={`status ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className={`status-btn ${user.status === 'active' ? 'block' : 'activate'}`}
                      onClick={() => toggleUserStatus(user.id, user.status)}
                    >
                      {user.status === 'active' ? 'Block' : 'Activate'}
                    </button>
                    <button className="view-btn" onClick={() => viewUserDetails(user.id)}>
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-data">
          <p>No users found matching the current filters.</p>
        </div>
      )}
    </div>
  );

  function toggleUserStatus(userId, currentStatus) {
    // Implement user status toggle
    console.log(`Toggle status for user ${userId}, current: ${currentStatus}`);
  }

  function viewUserDetails(userId) {
    // Implement view user details
    console.log(`View details for user ${userId}`);
  }
};

export default UsersPanel;
