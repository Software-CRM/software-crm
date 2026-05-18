import React, { useState } from 'react';
import { 
  Calendar
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
    <div className="employee-portal-container">
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
