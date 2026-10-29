import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    job_type: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Build the query string from the filters state
        const queryString = new URLSearchParams(filters).toString();
        const response = await axios.get(`http://localhost:8000/api/jobs/?${queryString}`);
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading">Loading jobs...</div>;

  return (
    <div className="job-list-container">
      <h2>Job Listings</h2>
      <div className="filters">
        <select name="category" onChange={handleFilterChange} value={filters.category}>
          <option value="">All Categories</option>
          <option value="IT">IT</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Education">Education</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <select name="job_type" onChange={handleFilterChange} value={filters.job_type}>
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
      </div>
      {jobs.length > 0 ? (
        jobs.map(job => (
          <div key={job.id} className="job-card">
            <h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            {job.category && <p><strong>Category:</strong> {job.category}</p>}
            <p><strong>Job Type:</strong> {job.job_type}</p>
            {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
            <p className="description">{job.description.substring(0, 150)}...</p>
            <Link to={`/jobs/${job.id}`} className="view-btn">View Details</Link>
          </div>
        ))
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
};

export default JobList;