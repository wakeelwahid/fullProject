
import React, { useState } from 'react';
import './panels.css';

const UsersPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      mobile: "9876543210",
      balance: 5000,
      totalDeposit: 15000,
      totalWithdraw: 10000,
      totalEarning: 8000,
      todayDeposit: 1000,
      todayWithdraw: 500,
      totalReferrals: 5,
      referralEarnings: 2500,
      status: "active"
    },
    {
      id: 2,
      name: "Alice Smith",
      mobile: "9876543211",
      balance: 7500,
      totalDeposit: 25000,
      totalWithdraw: 17500,
      totalEarning: 12000,
      todayDeposit: 2000,
      todayWithdraw: 1500,
      totalReferrals: 8,
      referralEarnings: 4000,
      status: "active"
    },
    {
      id: 3,
      name: "Bob Wilson",
      mobile: "9876543212",
      balance: 3000,
      totalDeposit: 10000,
      totalWithdraw: 7000,
      totalEarning: 5000,
      todayDeposit: 500,
      todayWithdraw: 0,
      totalReferrals: 3,
      referralEarnings: 1500,
      status: "blocked"
    },
    {
      id: 4,
      name: "Emma Davis",
      mobile: "9876543213",
      balance: 10000,
      totalDeposit: 35000,
      totalWithdraw: 25000,
      totalEarning: 15000,
      todayDeposit: 3000,
      todayWithdraw: 2000,
      totalReferrals: 10,
      referralEarnings: 5000,
      status: "active"
    },
    {
      id: 5,
      name: "Michael Brown",
      mobile: "9876543214",
      balance: 6000,
      totalDeposit: 20000,
      totalWithdraw: 14000,
      totalEarning: 9000,
      todayDeposit: 1500,
      todayWithdraw: 1000,
      totalReferrals: 6,
      referralEarnings: 3000,
      status: "active"
    }
  ]);

  const handleBlockUser = (userId) => {
    console.log("Blocking user:", userId);
  };

  const handleUnblockUser = (userId) => {
    console.log("Unblocking user:", userId);
  };

  const handleRemoveUser = (userId) => {
    console.log("Removing user:", userId);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    user.balance.toString().includes(searchTerm) ||
    user.totalDeposit.toString().includes(searchTerm) ||
    user.totalWithdraw.toString().includes(searchTerm) ||
    user.totalEarning.toString().includes(searchTerm) ||
    user.todayDeposit.toString().includes(searchTerm) ||
    user.todayWithdraw.toString().includes(searchTerm) ||
    user.totalReferrals.toString().includes(searchTerm) ||
    user.referralEarnings.toString().includes(searchTerm) ||
    user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="panel">
      <h2>Users Management</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="panel-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Balance</th>
              <th>Total Deposit</th>
              <th>Total Withdraw</th>
              <th>Total Earning</th>
              <th>Today Deposit</th>
              <th>Today Withdraw</th>
              <th>Total Referrals</th>
              <th>Referral Earnings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.mobile}</td>
                <td>₹{user.balance}</td>
                <td>₹{user.totalDeposit}</td>
                <td>₹{user.totalWithdraw}</td>
                <td>₹{user.totalEarning}</td>
                <td>₹{user.todayDeposit}</td>
                <td>₹{user.todayWithdraw}</td>
                <td>{user.totalReferrals}</td>
                <td>₹{user.referralEarnings}</td>
                <td>{user.status}</td>
                <td className="action-buttons">
                  {user.status === 'active' ? (
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleBlockUser(user.id)}
                    >
                      Block
                    </button>
                  ) : (
                    <button 
                      className="action-btn" 
                      onClick={() => handleUnblockUser(user.id)}
                    >
                      Unblock
                    </button>
                  )}
                  <button 
                    className="action-btn delete" 
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPanel;
