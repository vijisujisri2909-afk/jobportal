import React, { useState } from 'react';
import axios from 'axios';
import './ResumeUpload.css';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/resume/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Resume uploaded successfully!');
      setFile(null);
    } catch (error) {
      console.error('Resume upload failed:', error);
      setMessage('Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-upload-container">
      <h2>Upload Your Resume</h2>
      <form onSubmit={handleSubmit} className="resume-upload-form">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </form>
      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
    </div>
  );
};

export default ResumeUpload;