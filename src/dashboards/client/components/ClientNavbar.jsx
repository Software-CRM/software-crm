import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Sun, 
  Moon, 
  User, 
  Menu, 
  X, 
  Calendar, 
  LogOut, 
  FolderKanban, 
  LifeBuoy, 
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils';
import './ClientNavbar.css';

const ClientNavbar = ({ 
  user, 
  isDarkMode, 
  setIsDarkMode, 
  onLogout, 
  sidebarOpen, 
  setSidebarOpen,
  setActiveTab 
}) => {
  const [greeting, setGreeting] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Mock Notifications State
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Invoice #1094 Paid', 
      description: 'Your payment of $1,250.00 was successfully processed.', 
      time: '2 hours ago', 
      read: false, 
      type: 'billing' 
    },
    { 
      id: 2, 
      title: 'Support Ticket #4928 Updated', 
      description: 'Tech Support replied: "Your server bandwidth limit has been increased."', 
      time: '5 hours ago', 
      read: false, 
      type: 'support' 
    },
    { 
      id: 3, 
      title: 'Milestone 2 Completed', 
      description: 'Project "Software CRM Customization" Milestone 2 has been approved.', 
      time: '1 day ago', 
      read: true, 
      type: 'project' 
    }
  ]);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Dynamic Greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) {
        setGreeting('Good Morning');
      } else if (hours < 17) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };
    
    updateGreeting();
    // Update every minute to keep dynamic state updated
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    // Optionally redirect based on type
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      if (notification.type === 'billing') {
        setActiveTab('billing');
      } else if (notification.type === 'support') {
        setActiveTab('tickets');
      } else if (notification.type === 'project') {
        setActiveTab('projects');
      }
    }
    setNotificationsOpen(false);
  };

  // Extract Initials for Premium Gradient Avatar
  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.fullName);

  return (
    <nav className="client-top-navbar">
      {/* Left side: Hamburger Toggle & Greeting */}
      <div className="navbar-left">
        <button 
          className="mobile-sidebar-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Sidebar Menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="navbar-greeting-section">
          <span className="navbar-greeting-label">{greeting},</span>
          <h2 className="navbar-greeting-name">{user?.fullName || 'Client'}</h2>
        </div>
      </div>

      {/* Right side: Actions, Date, Dark Mode, Notifications, Profile */}
      <div className="navbar-right">
        {/* Date Display (Hidden on very small mobile screens) */}
        <div className="navbar-date-display">
          <Calendar className="date-icon" size={16} />
          <span className="date-text">{formatDate()}</span>
        </div>

        {/* Action Icon Group */}
        <div className="navbar-action-group">
          {/* Theme Toggle */}
          <button 
            className="navbar-action-btn theme-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className={`theme-icon-wrapper ${isDarkMode ? 'rotate-dark' : 'rotate-light'}`}>
              {isDarkMode ? <Sun size={20} className="icon-sun" /> : <Moon size={20} className="icon-moon" />}
            </div>
          </button>

          {/* Notifications Bell */}
          <div className="navbar-dropdown-wrapper" ref={notificationRef}>
            <button 
              className={`navbar-action-btn notification-btn ${notificationsOpen ? 'active' : ''}`}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="View Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge-pulse">
                  <span className="badge-number">{unreadCount}</span>
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="navbar-dropdown notifications-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="mark-read-btn" onClick={handleMarkAllRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="dropdown-body">
                  {notifications.length === 0 ? (
                    <div className="empty-state">
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div className="notifications-list">
                      {notifications.map((item) => (
                        <div 
                          key={item.id} 
                          className={`notification-item ${item.read ? 'read' : 'unread'}`}
                          onClick={() => handleNotificationClick(item.id)}
                        >
                          <div className="notification-icon-indicator">
                            {!item.read && <span className="unread-dot" />}
                            {item.type === 'billing' && <CreditCard size={16} className="type-icon billing" />}
                            {item.type === 'support' && <LifeBuoy size={16} className="type-icon support" />}
                            {item.type === 'project' && <FolderKanban size={16} className="type-icon project" />}
                          </div>
                          <div className="notification-details">
                            <h4 className="notification-item-title">{item.title}</h4>
                            <p className="notification-item-desc">{item.description}</p>
                            <span className="notification-item-time">{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className="navbar-profile-section" ref={profileRef}>
          <button 
            className={`profile-trigger-btn ${profileOpen ? 'active' : ''}`}
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="User Profile Options"
          >
            <div className="profile-info-desktop">
              <span className="profile-company-name">{user?.companyName || 'Corporate Client'}</span>
              <span className="profile-role-tag">Client Access</span>
            </div>
            <div className="profile-gradient-avatar">
              <span className="avatar-initials">{initials}</span>
              <span className="avatar-online-status" />
            </div>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="navbar-dropdown profile-dropdown">
              <div className="dropdown-user-header">
                <div className="profile-gradient-avatar large">
                  <span className="avatar-initials">{initials}</span>
                </div>
                <div className="user-details-card">
                  <h4 className="user-card-name">{user?.fullName || 'Client'}</h4>
                  <p className="user-card-email">{user?.email || 'client@company.com'}</p>
                  <span className="user-card-badge">{user?.companyName || 'CRM Partner'}</span>
                </div>
              </div>
              
              <ul className="dropdown-menu-links">
                <li>
                  <button 
                    onClick={() => { 
                      setActiveTab('dashboard'); 
                      setProfileOpen(false); 
                    }}
                    className="menu-link-btn"
                  >
                    <User size={16} className="menu-icon" />
                    <span>My Dashboard</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { 
                      setActiveTab('projects'); 
                      setProfileOpen(false); 
                    }}
                    className="menu-link-btn"
                  >
                    <FolderKanban size={16} className="menu-icon" />
                    <span>Projects & Tasks</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { 
                      setActiveTab('tickets'); 
                      setProfileOpen(false); 
                    }}
                    className="menu-link-btn"
                  >
                    <LifeBuoy size={16} className="menu-icon" />
                    <span>Support Center</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { 
                      setActiveTab('billing'); 
                      setProfileOpen(false); 
                    }}
                    className="menu-link-btn"
                  >
                    <CreditCard size={16} className="menu-icon" />
                    <span>Billing & Invoices</span>
                  </button>
                </li>
              </ul>
              
              <div className="dropdown-footer">
                <button className="profile-logout-btn" onClick={onLogout}>
                  <LogOut size={16} className="menu-icon" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
