import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Zap, 
  Calendar, 
  Briefcase, 
  ChevronRight, 
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { projectService } from '../../../services/projectService';

const ManagerProjectsTab = ({ showToast }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('DEBUG: Manual sync triggered for manager projects...');
      const data = await projectService.getManagerProjects();
      setProjects(data || []);
    } catch (err) {
      console.error('DEBUG: Project Load Error:', err);
      showToast('error', 'Failed to load projects: ' + (err.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.department?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manager-tab-content">
      <div className="tab-header">
        <div className="header-title-area">
          <h1>Project Management</h1>
          <p>Track and manage your assigned projects and team performance</p>
        </div>
        <div className="header-actions-area">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Filter projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="secondary-btn" onClick={fetchProjects}>
            <Zap size={16} />
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      <div className="projects-stats-row">
        <div className="stat-mini-card">
          <span className="label">Total Assigned</span>
          <span className="value">{projects.length}</span>
        </div>
        <div className="stat-mini-card">
          <span className="label">In Progress</span>
          <span className="value">{projects.filter(p => p.status === 'In Progress' || p.status === 'Active').length}</span>
        </div>
        <div className="stat-mini-card">
          <span className="label">Critical Priority</span>
          <span className="value">{projects.filter(p => p.priority === 'HIGH' || p.priority === 'URGENT').length}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={40} />
          <p>Loading your projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={60} />
          <h3>No Projects Found</h3>
          <p>You don't have any projects assigned to you yet.</p>
        </div>
      ) : (
        <div className="manager-projects-grid">
          {filteredProjects.map(project => (
            <motion.div 
              key={project.id} 
              className="manager-project-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="card-header">
                <div className="project-title-group">
                  <span className={`priority-indicator ${project.priority?.toLowerCase()}`}></span>
                  <h3>{project.name}</h3>
                </div>
                <span className={`status-badge ${project.status?.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </span>
              </div>

              <p className="project-desc">{project.description}</p>

              <div className="project-meta-grid">
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <Briefcase size={14} />
                  <span>Role: {project.manager?.role || 'Manager'}</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-labels">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="manager-progress-track">
                  <div 
                    className="manager-progress-fill" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="card-footer">
                <div className="skill-tags">
                  {project.skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                  {project.skills?.length > 3 && <span className="more-skills">+{project.skills.length - 3}</span>}
                </div>
                <button className="view-details-btn">
                  <span>Details</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerProjectsTab;


