import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Search, 
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Inbox,
  Trash2,
  Check,
  ArrowLeft,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../../utils/dateUtils';

// Components
import ManagerSidebar from '../components/ManagerSidebar';

// Modules
import ManagerOverview from '../modules/ManagerOverview';
import TeamMembers from '../modules/TeamMembers';
import ProjectManagement from '../modules/ProjectManagement';
import SprintManagement from '../modules/SprintManagement';
import BugTracker from '../modules/BugTracker';
import Attendance from '../modules/Attendance';
import Performance from '../modules/Performance';
import KanbanBoard from '../../../components/shared/Kanban/KanbanBoard';

import './ManagerDashboard.css';

const ManagerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('crm_theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    localStorage.setItem('crm_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  const [toast, setToast] = useState(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(`crm_notifications_${user?.id || user?.userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hasUnread, setHasUnread] = useState(() => {
    try {
      const saved = localStorage.getItem(`crm_notifications_${user?.id || user?.userId}`);
      const notifs = saved ? JSON.parse(saved) : [];
      return notifs.some(n => !n.read);
    } catch {
      return false;
    }
  });

  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const refreshNotifications = () => {
    try {
      const saved = localStorage.getItem(`crm_notifications_${user?.id || user?.userId}`);
      const notifs = saved ? JSON.parse(saved) : [];
      setNotifications(notifs);
      setHasUnread(notifs.some(n => !n.read));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setHasUnread(false);
    }
  };

  const markAllAsRead = (e) => {
    e.stopPropagation();
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(`crm_notifications_${user?.id || user?.userId}`, JSON.stringify(updated));
  };

  const toggleReadStatus = (id, e) => {
    e.stopPropagation();
    const updated = notifications.map(n => {
      if (n.id === id) {
        const updatedNotif = { ...n, read: !n.read };
        if (selectedNotification && selectedNotification.id === id) {
          setSelectedNotification(updatedNotif);
        }
        return updatedNotif;
      }
      return n;
    });
    setNotifications(updated);
    localStorage.setItem(`crm_notifications_${user?.id || user?.userId}`, JSON.stringify(updated));
    setHasUnread(updated.some(n => !n.read));
  };

  const handleNotifClick = (notif) => {
    setSelectedNotification(notif);
  };

  const goBackToList = (e) => {
    e.stopPropagation();
    setSelectedNotification(null);
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(`crm_notifications_${user?.id || user?.userId}`, JSON.stringify(updated));
    setSelectedNotification(null);
    setHasUnread(updated.some(n => !n.read));
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'project':
        return <Calendar size={16} className="notif-icon-proj" />;
      case 'system':
        return <Activity size={16} className="notif-icon-system" />;
      default:
        return <Bell size={16} className="notif-icon-default" />;
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <ManagerOverview />;
      case 'team': return <TeamMembers showToast={showToast} />;
      case 'tasks': return <KanbanBoard user={user} />;
      case 'projects': return <ProjectManagement showToast={showToast} />;
      case 'sprints': return <SprintManagement showToast={showToast} />;
      case 'bugs': return <BugTracker showToast={showToast} />;
      case 'attendance': return <Attendance />;
      case 'performance': return <Performance />;
      default: return <ManagerOverview />;
    }
  };

  return (
    <div className={`manager-dashboard-container ${isDarkMode ? 'dark-mode' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`toast-notification ${toast.type}`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ManagerSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      
      <main className="manager-main-content">
        <header className="manager-top-header">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search team, projects or tasks..." />
          </div>
          
          <div className="header-actions">
            <div className="header-date" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginRight: '1rem' }}>
              <Calendar size={16} />
              <span>{formatDate()}</span>
            </div>
            <button 
              className="action-icon-btn" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                background: 'none',
                border: '1px solid var(--border, #e2e8f0)',
                borderRadius: '10px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted, #64748b)',
                transition: 'all 0.2s ease',
                marginRight: '0.5rem'
              }}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="notification-wrapper" ref={notificationRef}>
              <button 
                className={`action-icon-btn ${showNotifications ? 'active' : ''}`}
                onClick={toggleNotifications}
                aria-label="Notifications"
                style={{
                  background: 'none',
                  border: '1px solid var(--border, #e2e8f0)',
                  borderRadius: '10px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  color: 'var(--text-muted, #64748b)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Bell size={20} />
                {hasUnread && (
                  <span className="notif-badge" style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '8px',
                    height: '8px',
                    background: '#ef4444',
                    borderRadius: '50%',
                    border: '2px solid white'
                  }}></span>
                )}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown">
                  {selectedNotification ? (
                    /* Detail View */
                    <div className="notif-detail-view">
                      <div className="notif-detail-header">
                        <button 
                          className="notif-action-btn back-btn"
                          onClick={goBackToList}
                          title="Back to notifications"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        
                        <button 
                          className="notif-action-btn mark-read-btn"
                          onClick={(e) => toggleReadStatus(selectedNotification.id, e)}
                        >
                          <Check size={14} />
                          <span>{selectedNotification.read ? "Mark unread" : "Mark as read"}</span>
                        </button>

                        <button 
                          className="notif-action-btn delete-notif-btn"
                          onClick={(e) => deleteNotification(selectedNotification.id, e)}
                          title="Delete notification"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                      
                      <div className="notif-detail-body" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <div className="notif-detail-icon-wrapper">
                          {getNotifIcon(selectedNotification.type)}
                        </div>
                        <h4 className="notif-detail-title">{selectedNotification.title}</h4>
                        <span className="notif-detail-time">{selectedNotification.time}</span>
                        
                        <div className="notif-detail-message" style={{ textAlign: 'left', width: '100%' }}>
                          <p style={{ marginBottom: '1rem', whiteSpace: 'pre-line', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {selectedNotification.message}
                          </p>
                          
                          {selectedNotification.projectDetails && (
                            <div className="project-detail-notif-card" style={{
                              background: 'var(--bg-main, #f8fafc)',
                              border: '1px solid var(--border, #e2e8f0)',
                              borderRadius: '12px',
                              padding: '16px',
                              marginTop: '12px'
                            }}>
                              <h5 style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '12px', color: 'var(--primary, #1e3a8a)' }}>Project Specifications</h5>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                                <div><strong style={{ color: 'var(--text-main)' }}>Name:</strong> <span style={{ color: 'var(--text-muted)' }}>{selectedNotification.projectDetails.name}</span></div>
                                <div><strong style={{ color: 'var(--text-main)' }}>Description:</strong> <span style={{ color: 'var(--text-muted)' }}>{selectedNotification.projectDetails.description || 'No description available'}</span></div>
                                <div>
                                  <strong style={{ color: 'var(--text-main)' }}>Timeline:</strong> <span style={{ color: 'var(--text-muted)' }}>{selectedNotification.projectDetails.startDate ? new Date(selectedNotification.projectDetails.startDate).toLocaleDateString() : 'TBD'} - {selectedNotification.projectDetails.endDate ? new Date(selectedNotification.projectDetails.endDate).toLocaleDateString() : 'TBD'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <strong style={{ color: 'var(--text-main)' }}>Priority:</strong>
                                  <span className={`status-pill ${selectedNotification.projectDetails.priority?.toLowerCase() || 'medium'}`} style={{ 
                                    fontSize: '0.7rem', 
                                    padding: '2px 8px',
                                    borderRadius: '20px',
                                    fontWeight: '700',
                                    background: selectedNotification.projectDetails.priority === 'CRITICAL' || selectedNotification.projectDetails.priority === 'HIGH' ? '#fef2f2' : '#f0fdf4',
                                    color: selectedNotification.projectDetails.priority === 'CRITICAL' || selectedNotification.projectDetails.priority === 'HIGH' ? '#ef4444' : '#16a34a',
                                    border: '1px solid currentColor'
                                  }}>
                                    {selectedNotification.projectDetails.priority || 'MEDIUM'}
                                  </span>
                                </div>
                                <div><strong style={{ color: 'var(--text-main)' }}>Department:</strong> <span style={{ color: 'var(--text-muted)' }}>{selectedNotification.projectDetails.department || 'GENERAL'}</span></div>
                                <div>
                                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Required Skills:</strong>
                                  <div className="skill-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {Array.isArray(selectedNotification.projectDetails.skills) && selectedNotification.projectDetails.skills.length > 0 ? (
                                      selectedNotification.projectDetails.skills.map(skill => (
                                        <span key={skill} className="skill-tag" style={{
                                          fontSize: '0.75rem',
                                          background: 'rgba(30, 58, 138, 0.05)',
                                          color: 'var(--primary, #1e3a8a)',
                                          padding: '4px 10px',
                                          borderRadius: '20px',
                                          fontWeight: '600',
                                          border: '1px solid rgba(30, 58, 138, 0.1)'
                                        }}>{skill}</span>
                                      ))
                                    ) : (
                                      <span style={{ color: 'var(--text-muted)' }}>None specified</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="notif-detail-status" style={{ marginTop: '16px' }}>
                          <span className={`status-pill ${selectedNotification.read ? 'read' : 'unread'}`}>
                            {selectedNotification.read ? "Read" : "Unread"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* List View */
                    <div className="notif-list-view">
                      <div className="notif-list-header">
                        <h3 className="notif-list-title">Notifications</h3>
                        <button 
                          className="notif-header-action"
                          onClick={markAllAsRead}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Mark all as read
                        </button>
                      </div>
                      
                      <div className="notif-list-items" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <div className="notif-empty-state">
                            <Inbox size={28} />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id}
                              className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                              onClick={() => handleNotifClick(notif)}
                            >
                              <div className="notif-item-icon">
                                {getNotifIcon(notif.type)}
                              </div>
                              <div className="notif-item-content">
                                <div className="notif-item-top">
                                  <span className="notif-item-title">{notif.title}</span>
                                  <span className="notif-item-time">{notif.time}</span>
                                </div>
                                <p className="notif-item-msg">{notif.message.split('\n')[0]}</p>
                              </div>
                              {!notif.read && <span className="unread-indicator-dot"></span>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="user-profile-badge">
              <div className="user-info">
                <span className="user-name">{user?.fullName || 'Manager'}</span>
                <span className="user-role">Team Lead</span>
              </div>
              <div className="user-avatar">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="tab-container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;


