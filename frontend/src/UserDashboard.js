import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDashboard.css';

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/my-applications/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading your applications...</div>;

  return (
    <div className="user-dashboard">
      <h2>My Applications</h2>
      {applications.length > 0 ? (
        <ul className="applications-list">
          {applications.map(app => (
            <li key={app.id} className="application-item">
              <h3>{app.job.title}</h3>
              <p><strong>Company:</strong> {app.job.company}</p>
              <p><strong>Location:</strong> {app.job.location}</p>
              <p><strong>Applied on:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-applications">You have not applied for any jobs yet.</p>
      )}
    </div>
  );
};

export default UserDashboard;