


import React, { useState } from 'react';

import {
  Bell,
  User as UserIcon,
  ChevronDown,
  Moon,
  Sun,
  Calendar,
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

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;

      case 'users':
        return <UserManagement />;

      case 'projects':
        return <ProjectManagement />;

      case 'company-settings':
        return <CompanySettings />;

      case 'invoices':
        return <Invoices />;

      case 'reports':
        return <Reports />;

      case 'plans':
        return <Plans />;

      case 'settings':
        return <GeneralSettings />;

      case 'logs':
        return <Logs />;

      default:
        return <DashboardOverview />;
    }
  };

  const getTabTitle = () => {
    const titles = {
      overview: 'Dashboard Overview',
      users: 'User Management',
      projects: 'Project Management',
      'company-settings': 'Company Settings',
      invoices: 'Billing & Invoices',
      reports: 'Reports & Analytics',
      plans: 'Billing & Plans',
      settings: 'General Settings',
      logs: 'System Logs',
    };

    return titles[activeTab] || 'Admin Dashboard';
  };

  return (
    <div className={`dashboard-root ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* SIDEBAR */}

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* MAIN CONTENT */}

      <div className="dashboard-main">
        {/* TOPBAR */}

        <header className="dashboard-topbar">
          <div className="topbar-left">
            <h1 className="page-title">{getTabTitle()}</h1>
          </div>

          <div className="topbar-right">
            {/* DATE */}

            <div className="topbar-date">
              <Calendar size={16} />

              <span>{formatDate()}</span>
            </div>

            {/* ACTIONS */}

            <div className="topbar-actions">
              {/* DARK MODE */}

              <button
                className="action-icon-btn"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* NOTIFICATION */}

              <div className="notification-wrapper">
                <button className="action-icon-btn">
                  <Bell size={20} />

                  <span className="notif-badge"></span>
                </button>
              </div>

              {/* DIVIDER */}

              <div className="v-divider" />

              {/* PROFILE */}

              <div className="profile-wrapper">
                <div
                  className="user-profile-dropdown"
                  onClick={toggleProfileMenu}
                >
                  <div className="avatar-small">
                    <UserIcon size={18} />
                  </div>

                  <div className="user-info">
                    <span className="u-name">
                      {user?.fullName || 'Admin User'}
                    </span>

                    <span className="u-role">
                      {user?.role || 'Administrator'}
                    </span>
                  </div>

                  <ChevronDown
                    size={14}
                    className={`dropdown-arrow ${
                      showProfileMenu ? 'rotate' : ''
                    }`}
                  />
                </div>

          

                
                 {showProfileMenu && (
  <div className="profile-menu">

 

    <div className="profile-header">
      <div className="profile-avatar">
        <UserIcon size={28} />
      </div>

      <div>
        <h4>
          {user?.fullName || 'Admin User'}
        </h4>

        <p>
          {user?.email || 'admin@crm.com'}
        </p>
      </div>
    </div>

 

    <button
      className="menu-item"
      onClick={() => {
        setActiveTab('settings');
        setShowProfileMenu(false);
      }}
    >
      Profile
    </button>



   



    <button
      className="menu-item logout"
      onClick={() => {
        setShowProfileMenu(false);
        onLogout();
      }}
    >
      Logout
    </button>

  </div>
)} 
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}

        <main className="dashboard-viewport">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
