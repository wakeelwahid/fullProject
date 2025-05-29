
import React, { useState, useEffect } from 'react';
import adminAxios from '../../utils/adminAxios';
import './panels.css';

const UsersPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Enhanced filter states
  const [filters, setFilters] = useState({
    minBalance: '',
    maxBalance: '',
    minDeposit: '',
    maxDeposit: '',
    minWithdraw: '',
    maxWithdraw: '',
    minEarning: '',
    maxEarning: '',
    minTodayDeposit: '',
    maxTodayDeposit: '',
    minTodayWithdraw: '',
    maxTodayWithdraw: '',
    minReferrals: '',
    maxReferrals: '',
    minReferralEarnings: '',
    maxReferralEarnings: '',
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
      minTodayDeposit: '',
      maxTodayDeposit: '',
      minTodayWithdraw: '',
      maxTodayWithdraw: '',
      minReferrals: '',
      maxReferrals: '',
      minReferralEarnings: '',
      maxReferralEarnings: '',
      status: 'all'
    });
  };

  const applyFilters = (user) => {
    const balance = parseFloat(user.balance);
    const totalDeposit = parseFloat(user.total_deposit);
    const totalWithdraw = parseFloat(user.total_withdraw);
    const totalEarning = parseFloat(user.total_earning);
    const todayDeposit = parseFloat(user.today_deposit);
    const todayWithdraw = parseFloat(user.today_withdraw);
    const totalReferrals = user.total_referrals;
    const referralEarnings = parseFloat(user.referral_earnings);

    // Status filter
    if (filters.status !== 'all' && user.status !== filters.status) {
      return false;
    }

    // Balance filters
    if (filters.minBalance && balance < parseFloat(filters.minBalance)) return false;
    if (filters.maxBalance && balance > parseFloat(filters.maxBalance)) return false;

    // Total Deposit filters
    if (filters.minDeposit && totalDeposit < parseFloat(filters.minDeposit)) return false;
    if (filters.maxDeposit && totalDeposit > parseFloat(filters.maxDeposit)) return false;

    // Total Withdraw filters
    if (filters.minWithdraw && totalWithdraw < parseFloat(filters.minWithdraw)) return false;
    if (filters.maxWithdraw && totalWithdraw > parseFloat(filters.maxWithdraw)) return false;

    // Total Earning filters
    if (filters.minEarning && totalEarning < parseFloat(filters.minEarning)) return false;
    if (filters.maxEarning && totalEarning > parseFloat(filters.maxEarning)) return false;

    // Today Deposit filters
    if (filters.minTodayDeposit && todayDeposit < parseFloat(filters.minTodayDeposit)) return false;
    if (filters.maxTodayDeposit && todayDeposit > parseFloat(filters.maxTodayDeposit)) return false;

    // Today Withdraw filters
    if (filters.minTodayWithdraw && todayWithdraw < parseFloat(filters.minTodayWithdraw)) return false;
    if (filters.maxTodayWithdraw && todayWithdraw > parseFloat(filters.maxTodayWithdraw)) return false;

    // Referrals filters
    if (filters.minReferrals && totalReferrals < parseInt(filters.minReferrals)) return false;
    if (filters.maxReferrals && totalReferrals > parseInt(filters.maxReferrals)) return false;

    // Referral Earnings filters
    if (filters.minReferralEarnings && referralEarnings < parseFloat(filters.minReferralEarnings)) return false;
    if (filters.maxReferralEarnings && referralEarnings > parseFloat(filters.maxReferralEarnings)) return false;

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

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      // You can implement the API call here
      console.log(`Toggle status for user ${userId} from ${currentStatus} to ${newStatus}`);
      // After successful API call, refresh the users list
      // await fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const viewUserDetails = (userId) => {
    console.log(`View details for user ${userId}`);
    // You can implement navigation to user details page here
  };

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

      {/* Enhanced Filters Section */}
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
            <label>Today Deposit Range (₹)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minTodayDeposit}
                onChange={(e) => handleFilterChange('minTodayDeposit', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxTodayDeposit}
                onChange={(e) => handleFilterChange('maxTodayDeposit', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Today Withdraw Range (₹)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minTodayWithdraw}
                onChange={(e) => handleFilterChange('minTodayWithdraw', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxTodayWithdraw}
                onChange={(e) => handleFilterChange('maxTodayWithdraw', e.target.value)}
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
            <label>Referral Earnings Range (₹)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minReferralEarnings}
                onChange={(e) => handleFilterChange('minReferralEarnings', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxReferralEarnings}
                onChange={(e) => handleFilterChange('maxReferralEarnings', e.target.value)}
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

      {/* Enhanced Users Table */}
      <div className="table-container">
        <div className="table-scroll">
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
                  <td className="username-cell">{user.username}</td>
                  <td>{user.mobile}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td className="amount-cell">₹{parseFloat(user.balance).toFixed(2)}</td>
                  <td className="amount-cell">₹{parseFloat(user.total_deposit).toFixed(2)}</td>
                  <td className="amount-cell">₹{parseFloat(user.total_withdraw).toFixed(2)}</td>
                  <td className="amount-cell">₹{parseFloat(user.total_earning).toFixed(2)}</td>
                  <td className="amount-cell">₹{parseFloat(user.today_deposit).toFixed(2)}</td>
                  <td className="amount-cell">₹{parseFloat(user.today_withdraw).toFixed(2)}</td>
                  <td className="referral-cell">{user.total_referrals}</td>
                  <td className="amount-cell">₹{parseFloat(user.referral_earnings).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="date-cell">{new Date(user.date_joined).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className={`action-btn ${user.status === 'active' ? 'block-btn' : 'activate-btn'}`}
                        onClick={() => toggleUserStatus(user.id, user.status)}
                      >
                        {user.status === 'active' ? 'Block' : 'Activate'}
                      </button>
                      <button 
                        className="action-btn view-btn" 
                        onClick={() => viewUserDetails(user.id)}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-data">
          <p>No users found matching the current filters.</p>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="summary-section">
        <h3>Summary Statistics</h3>
        <div className="stats-grid-detailed">
          <div className="stat-item">
            <span>Total Users:</span>
            <span>{filteredUsers.length}</span>
          </div>
          <div className="stat-item">
            <span>Total Balance:</span>
            <span>₹{filteredUsers.reduce((sum, user) => sum + parseFloat(user.balance), 0).toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span>Total Deposits:</span>
            <span>₹{filteredUsers.reduce((sum, user) => sum + parseFloat(user.total_deposit), 0).toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span>Total Withdrawals:</span>
            <span>₹{filteredUsers.reduce((sum, user) => sum + parseFloat(user.total_withdraw), 0).toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span>Total Earnings:</span>
            <span>₹{filteredUsers.reduce((sum, user) => sum + parseFloat(user.total_earning), 0).toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span>Total Referrals:</span>
            <span>{filteredUsers.reduce((sum, user) => sum + user.total_referrals, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPanel;
