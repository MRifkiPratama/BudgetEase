import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2>BudgetEase</h2>
      <ul>
        <li onClick={() => navigate('/home')}>Home</li>
        <li onClick={() => navigate('/profile')}>Profile</li>
        <li onClick={() => navigate('/topup')}>Top Up</li>
        <li onClick={() => navigate('/transaction')}>Transaction</li>
        <li onClick={() => navigate('/history')}>History</li>
        <li onClick={() => navigate('/donation')}>Donation</li>
        <li onClick={() => navigate('/report')}>Report</li>
        <li onClick={handleLogout}>Log Out</li>
      </ul>
    </div>
  );
};

export default Sidebar;