import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Shield, 
  Zap, 
  Clock, 
  Activity,
  User as UserIcon,
  Loader2
} from 'lucide-react';
import { userService } from '../../../services/userService';
import './UserDetailsDrawer.css';

const UserDetailsDrawer = ({ isOpen, onClose, userId }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserDetails(userId);
      setDetails(data);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setError('Unable to load employee details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchDetails();
    }
  }, [isOpen, userId, fetchDetails]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Content */}
          <motion.div 
            className="user-details-drawer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            <div className="drawer-header">
              <div className="header-title">
                <h2>{details?.role ? `${details.role.charAt(0).toUpperCase() + details.role.slice(1).toLowerCase()} Profile` : 'User Profile'}</h2>
                <p>Detailed view of organization member</p>
              </div>
              <button className="close-drawer-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              {loading ? (
                <div className="drawer-loading">
                  <Loader2 className="animate-spin" size={40} />
                  <p>Fetching data...</p>
                </div>
              ) : error ? (
                <div className="drawer-error">
                  <div className="error-icon">⚠️</div>
                  <p>{error}</p>
                  <button className="retry-btn" onClick={fetchDetails}>Retry</button>
                </div>
              ) : details ? (
                <div className="drawer-scroll-area">
                  {/* Section 1: Profile Header */}
                  <div className="profile-hero">
                    <div className="avatar-large">
                      {details.fullName?.charAt(0) || details.username?.charAt(0)}
                    </div>
                    <div className="hero-info">
                      <h3>{details.fullName}</h3>
                      <span className="username-tag">@{details.username}</span>
                      <div className="badge-group">
                        <span className={`role-badge ${details.role?.toLowerCase()}`}>
                          {details.role}
                        </span>
                        <span className={`status-badge ${details.active ? 'active' : 'inactive'}`}>
                          {details.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: User Information */}
                  <div className="details-section">
                    <h4 className="section-title">{details?.role ? `${details.role.charAt(0).toUpperCase() + details.role.slice(1).toLowerCase()} Information` : 'User Information'}</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <label><Mail size={14} /> Email</label>
                        <span>{details.email || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <label><Phone size={14} /> Phone</label>
                        <span>{details.phone || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <label><Briefcase size={14} /> Department</label>
                        <span>{details.department || 'General'}</span>
                      </div>
                      <div className="info-item">
                        <label><Zap size={14} /> Designation</label>
                        <span>{details.designation || 'Specialist'}</span>
                      </div>
                      <div className="info-item">
                        <label><Calendar size={14} /> Joining Date</label>
                        <span>{details.joiningDate || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <label><UserIcon size={14} /> {details?.role ? `${details.role.charAt(0).toUpperCase() + details.role.slice(1).toLowerCase()} ID` : 'User ID'}</label>
                        <span>#{details.id?.toString().padStart(4, '0')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Work Information */}
                  <div className="details-section">
                    <h4 className="section-title">Work Statistics</h4>
                    <div className="stats-grid">
                      <div className="stat-card blue">
                        <span className="stat-val">{details.assignedProjects || 0}</span>
                        <span className="stat-label">Projects</span>
                      </div>
                      <div className="stat-card orange">
                        <span className="stat-val">{details.currentTasks || 0}</span>
                        <span className="stat-label">Pending Tasks</span>
                      </div>
                      <div className="stat-card green">
                        <span className="stat-val">{details.completedTasks || 0}</span>
                        <span className="stat-label">Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Activity Timeline */}
                  <div className="details-section">
                    <h4 className="section-title">Recent Activity</h4>
                    <div className="timeline">
                      <div className="timeline-item">
                        <div className="timeline-marker"><Clock size={12} /></div>
                        <div className="timeline-content">
                          <p className="time-label">Last Login</p>
                          <span className="time-val">{details.lastLogin || 'Never'}</span>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-marker active"><Activity size={12} /></div>
                        <div className="timeline-content">
                          <p className="time-label">Current Status</p>
                          <span className="time-val">{details.active ? 'Available' : 'Offline'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Permissions */}
                  <div className="details-section">
                    <h4 className="section-title">Permissions & Access</h4>
                    <div className="permissions-box">
                      <div className="permission-row">
                        <Shield size={16} />
                        <div>
                          <p>Access Level: <strong>{details.role}</strong></p>
                          <small>Standard enterprise permissions for {details.role?.toLowerCase()} role.</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            
            <div className="drawer-footer">
              <button className="secondary-btn w-full" onClick={onClose}>Close Panel</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserDetailsDrawer;
