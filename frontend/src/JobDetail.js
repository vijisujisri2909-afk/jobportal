import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/jobs/${id}/`);
        setJob(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setMessage('');
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setMessage('Please login to apply for this job.');
        setApplying(false);
        return;
      }
      await axios.post(
        'http://localhost:8000/api/apply/',
        { job_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Successfully applied for this job!');
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage('Please login to apply for this job.');
      } else {
        setMessage(error.response?.data?.detail || 'Failed to apply. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (!job) return <div className="not-found">Job not found.</div>;

  return (
    <div className="job-detail-container">
      <Link to="/" className="back-link">&larr; Back to Jobs</Link>
      <div className="job-detail-card">
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        {job.category && <p><strong>Category:</strong> {job.category}</p>}
        <p><strong>Job Type:</strong> {job.job_type}</p>
        {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
        <div className="description">
          <h3>Description</h3>
          <p>{job.description}</p>
        </div>
        <button className="apply-btn" onClick={handleApply} disabled={applying}>
          {applying ? 'Applying...' : 'Apply Now'}
        </button>
        {message && <p className={message.includes('Successfully') ? 'success' : 'error'}>{message}</p>}
      </div>
    </div>
  );
};

export default JobDetail;