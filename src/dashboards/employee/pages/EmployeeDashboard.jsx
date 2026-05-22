import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Sun,
  Moon
} from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils';

// Components
import EmployeeSidebar from '../components/EmployeeSidebar';

// Modules
import EmployeeOverview from '../modules/EmployeeOverview';
import MyTasks from '../../../components/shared/Kanban/KanbanBoard';
import Attendance from '../modules/Attendance';
import WorkReports from '../modules/WorkReports';
import Productivity from '../modules/Productivity';

import './EmployeeDashboard.css';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('crm_theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    localStorage.setItem('crm_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  const [isPunchedIn, setIsPunchedIn] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <EmployeeOverview user={user} />;
      case 'projects': return <MyTasks user={user} />;
      case 'attendance': return <Attendance isPunchedIn={isPunchedIn} setIsPunchedIn={setIsPunchedIn} />;
      case 'updates': return <WorkReports />;
      case 'performance': return <Productivity />;
      default: return <EmployeeOverview user={user} />;
    }
  };

  return (
    <div className={`employee-portal-container ${isDarkMode ? 'dark-mode' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
      <EmployeeSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      
      <main className="employee-main-content">
        <header className="employee-top-header">
          <div className="workspace-title">
            <h2>{activeTab === 'overview' ? 'Overview' : activeTab === 'projects' ? 'Tasks' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          </div>
          
          <div className="employee-header-right">
            <div className="date-display">
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
            <div className="employee-id-badge">
              <div className="e-avatar">{(user?.fullName || 'EM')[0]}</div>
              <div className="e-info">
                <span className="e-name">{user?.fullName || 'Employee'}</span>
                <span className="e-status">{isPunchedIn ? 'Working' : 'Not Punched In'}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="employee-workspace">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
