import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import UserDashboard from './UserDashboard';
import ResumeUpload from './ResumeUpload';
import JobList from './JobList';
import JobDetail from './JobDetail';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/" className="logo">Job Portal</Link>
          <div className="nav-links">
            <Link to="/">Jobs</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/resume/upload" element={<ResumeUpload />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/" element={<JobList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;