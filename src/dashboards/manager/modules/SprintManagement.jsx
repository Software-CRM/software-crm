import React, { useState, useEffect } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { sprintService } from '../../../services/sprintService';

const SprintManagement = ({ showToast }) => {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const data = await sprintService.getAllSprints();
        setSprints(data);
      } catch (err) {
        showToast('error', 'Failed to fetch sprints');
      } finally {
        setLoading(false);
      }
    };
    fetchSprints();
  }, []);

  return (
    <div className="manager-tab-content">
      <div className="tab-header">
        <div>
          <h1>Sprint Management</h1>
          <p>Plan and track agile sprints for your development cycles.</p>
        </div>
        <button className="primary-action-btn">
          <Zap size={18} />
          <span>New Sprint</span>
        </button>
      </div>

      <div className="sprint-list">
        {loading ? <Loader2 className="animate-spin" /> : sprints.length === 0 ? (
          <div className="empty-state">No sprints planned yet. Start your first agile cycle!</div>
        ) : (
          sprints.map(sprint => (
            <div key={sprint.id} className="sprint-card-premium">
              <div className="sprint-header">
                <h3>{sprint.name}</h3>
                <span className={`status-pill ${sprint.status?.toLowerCase()}`}>{sprint.status}</span>
              </div>
              <div className="sprint-stats">
                <div className="s-stat"><span>12</span><p>Tasks</p></div>
                <div className="s-stat"><span>8</span><p>Completed</p></div>
                <div className="s-stat"><span>75%</span><p>Velocity</p></div>
              </div>
              <div className="sprint-footer">
                <button className="secondary-btn-sm">View Backlog</button>
                {sprint.status === 'Planned' && <button className="primary-btn-sm">Start Sprint</button>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SprintManagement;


