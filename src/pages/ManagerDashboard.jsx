import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  User,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../utils/dateUtils';

// Components
import ManagerSidebar from '../dashboards/manager/components/ManagerSidebar';

// Modules
import ManagerOverview from '../dashboards/manager/modules/ManagerOverview';
import TeamMembers from '../dashboards/manager/modules/TeamMembers';
import ProjectManagement from '../dashboards/manager/modules/ProjectManagement';
import SprintManagement from '../dashboards/manager/modules/SprintManagement';
import BugTracker from '../dashboards/manager/modules/BugTracker';
import Attendance from '../dashboards/manager/modules/Attendance';
import Performance from '../dashboards/manager/modules/Performance';
import KanbanBoard from '../components/shared/Kanban/KanbanBoard';

import './ManagerDashboard.css';

const ManagerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);

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
    <div className="manager-dashboard-container">
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
            <button className="icon-btn"><Bell size={20} /></button>
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
