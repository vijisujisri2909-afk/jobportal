import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Welcome to your Job Portal Dashboard!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;