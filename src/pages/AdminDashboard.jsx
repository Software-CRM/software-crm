import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  User as UserIcon, 
  ChevronDown, 
  Menu,
  Moon,
  Sun,
  Calendar,
  ArrowLeft,
  Check,
  Inbox,
  Database,
  Activity,
  Trash2
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import AdminSidebar from '../dashboards/admin/components/AdminSidebar';

// Modular Dashboard Components
import DashboardOverview from '../dashboards/admin/modules/DashboardOverview';
import UserManagement from '../dashboards/admin/modules/UserManagement';
import ProjectManagement from '../dashboards/admin/modules/ProjectManagement';
import CompanySettings from '../dashboards/admin/modules/CompanySettings';
import GeneralSettings from '../dashboards/admin/modules/GeneralSettings';
import Reports from '../dashboards/admin/modules/Reports';
import Invoices from '../dashboards/admin/modules/Invoices';
import Plans from '../dashboards/admin/modules/Plans';
import Logs from '../dashboards/admin/modules/Logs';

import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hasUnread, setHasUnread] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_notifications');
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

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setHasUnread(false);
    }
  };

  const addNotification = (title, message, type = 'project') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: "Just now",
      read: false,
      type
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('crm_notifications', JSON.stringify(updated));
      return updated;
    });
    setHasUnread(true);
  };

  const markAllAsRead = (e) => {
    e.stopPropagation();
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('crm_notifications', JSON.stringify(updated));
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
    localStorage.setItem('crm_notifications', JSON.stringify(updated));
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
    localStorage.setItem('crm_notifications', JSON.stringify(updated));
    setSelectedNotification(null);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'user':
        return <UserIcon size={16} className="notif-icon-user" />;
      case 'database':
        return <Database size={16} className="notif-icon-db" />;
      case 'project':
        return <Calendar size={16} className="notif-icon-proj" />;
      case 'system':
        return <Activity size={16} className="notif-icon-system" />;
      default:
        return <Bell size={16} className="notif-icon-default" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <DashboardOverview />;
      case 'users': return <UserManagement />;
      case 'company-settings': return <CompanySettings />;
      case 'projects': return <ProjectManagement addNotification={addNotification} />;
      case 'invoices': return <Invoices />;
      case 'reports': return <Reports />;
      case 'plans': return <Plans />;
      case 'settings': return <GeneralSettings />;
      case 'logs': return <Logs />;
      default: return <DashboardOverview />;
    }
  };

  const getTabTitle = () => {
    const titles = {
      overview: 'Dashboard Overview',
      projects: 'Project Management',
      'company-settings': 'Company Settings',
      invoices: 'Billing & Invoices',
      reports: 'Reports & Analytics',
      plans: 'Billing & Plans',
      settings: 'General Settings',
      logs: 'System Logs'
    };
    return titles[activeTab] || 'Admin Dashboard';
  };

  return (
    <div className={`dashboard-root ${isDarkMode ? 'dark-mode' : ''}`}>
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout}
      />

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <h1 className="page-title">{getTabTitle()}</h1>
          </div>

          <div className="topbar-right">
            <div className="topbar-date" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginRight: '1rem' }}>
              <Calendar size={16} />
              <span>{formatDate()}</span>
            </div>
            <div className="topbar-actions">
              <button 
                className="action-icon-btn" 
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <div className="notification-wrapper" ref={notificationRef}>
                <button 
                  className={`action-icon-btn ${showNotifications ? 'active' : ''}`}
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {hasUnread && <span className="notif-badge"></span>}
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
                        
                        <div className="notif-detail-body">
                          <div className="notif-detail-icon-wrapper">
                            {getNotifIcon(selectedNotification.type)}
                          </div>
                          <h4 className="notif-detail-title">{selectedNotification.title}</h4>
                          <span className="notif-detail-time">{selectedNotification.time}</span>
                          <p className="notif-detail-message">{selectedNotification.message}</p>
                          <div className="notif-detail-status">
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
                          >
                            Mark all as read
                          </button>
                        </div>
                        
                        <div className="notif-list-items">
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
                                  <p className="notif-item-msg">{notif.message}</p>
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

              <div className="v-divider" />
              <div className="user-profile-dropdown">
                <div className="avatar-small">
                  <UserIcon size={18} />
                </div>
                <div className="user-info">
                  <span className="u-name">{user?.fullName || 'Admin User'}</span>
                  <span className="u-role">{user?.role || 'Administrator'}</span>
                </div>
                <ChevronDown size={14} className="dropdown-arrow" />
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-viewport">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

