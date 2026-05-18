import React, { useState, useEffect } from 'react';
import { Bug } from 'lucide-react';
import { bugService } from '../../../services/pmsService';

const BugTracker = ({ showToast }) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const data = await bugService.getAllBugs();
        setBugs(data);
      } catch (err) {
        showToast('error', 'Failed to fetch bugs');
      } finally {
        setLoading(false);
      }
    };
    fetchBugs();
  }, []);

  return (
    <div className="manager-tab-content">
      <div className="tab-header">
        <div>
          <h1>Bug Tracking</h1>
          <p>Monitor and resolve technical issues reported by users and QA.</p>
        </div>
        <button className="primary-action-btn" style={{ background: '#ef4444' }}>
          <Bug size={18} />
          <span>Report Bug</span>
        </button>
      </div>

      <div className="bug-table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Reported By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6">Loading...</td></tr> : bugs.map(bug => (
              <tr key={bug.id}>
                <td>{bug.id}</td>
                <td>{bug.title}</td>
                <td><span className={`severity-tag ${bug.severity?.toLowerCase()}`}>{bug.severity}</span></td>
                <td><span className={`status-pill ${bug.status?.toLowerCase()}`}>{bug.status}</span></td>
                <td>{bug.reporter}</td>
                <td><button className="text-btn">View Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BugTracker;


