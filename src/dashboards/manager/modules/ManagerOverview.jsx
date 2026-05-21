import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { projectService } from '../../../services/projectService';
import { userService } from '../../../services/userService';

const ManagerOverview = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        setLoading(true);
        const [projData, userData] = await Promise.all([
          projectService.getManagerProjects(),
          userService.getAllUsers()
        ]);
        setProjects(projData || []);
        setEmployees((userData || []).filter(u => u.role === 'EMPLOYEE'));
      } catch (err) {
        console.error('Failed to fetch manager data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  }, []);

  const stats = [
    { label: 'Team Size', value: employees.length, icon: Users, color: '#3b82f6' },
    { label: 'Assigned Projects', value: projects.length, icon: Briefcase, color: '#10b981' },
    { label: 'Pending Tasks', value: projects.reduce((acc, p) => acc + (p.status === 'Pending' ? 1 : 0), 0), icon: CheckCircle, color: '#f59e0b' },
    { label: 'Attendance', value: '94%', icon: Clock, color: '#8b5cf6' }
  ];

  return (
    <div className="manager-tab-content">
      <div className="tab-header">
        <h1>Management Overview</h1>
        <p>Monitor your team's real-time productivity and project status.</p>
      </div>

      <div className="manager-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="manager-stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-data">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="manager-row">
        <div className="manager-card-large">
          <div className="card-header">
            <h3>Recent Team Activity</h3>
            <button className="text-btn">View All</button>
          </div>
          <div className="activity-list">
            {[
              { user: 'Sarah Jenkins', action: 'completed task', target: 'Login UI Design', time: '2h ago' },
              { user: 'Mike Ross', action: 'punched in', target: 'Remote Office', time: '4h ago' },
              { user: 'John Doe', action: 'submitted report', target: 'Weekly Sprint 4', time: '6h ago' }
            ].map((act, i) => (
              <div key={i} className="activity-item">
                <div className="activity-avatar">{act.user[0]}</div>
                <div className="activity-info">
                  <p><strong>{act.user}</strong> {act.action} <span>{act.target}</span></p>
                  <span className="activity-time">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="manager-card-small">
          <h3>Assigned Projects</h3>
          <div className="deadline-list">
            {loading ? <Loader2 className="animate-spin" /> : projects.length === 0 ? (
              <p className="text-muted">No projects assigned to you yet.</p>
            ) : projects.map(proj => (
              <div key={proj.id} className="deadline-item">
                <div className="deadline-info">
                  <span className="font-bold">{proj.name}</span>
                  <span className={`priority-tag ${proj.priority?.toLowerCase()}`}>{proj.priority}</span>
                </div>
                <div className="deadline-sub">
                  <span>Due: {new Date(proj.endDate).toLocaleDateString()}</span>
                  <span className="status-text">{proj.status}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${proj.progress || 0}%`, background: '#3b82f6' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;


