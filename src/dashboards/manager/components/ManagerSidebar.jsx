import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Clock, 
  LogOut,
  TrendingUp,
  Bug,
  Zap
} from 'lucide-react';
import { useCompany } from '../../../context/useCompany';
import defaultLogo from '../../../assets/logo.png';
import './ManagerSidebar.css';

const ManagerSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const { settings } = useCompany();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'tasks', label: 'Task Board', icon: CheckSquare },
    { id: 'projects', label: 'Project Management', icon: Briefcase },
    { id: 'sprints', label: 'Sprints', icon: Zap },
    { id: 'bugs', label: 'Bug Tracker', icon: Bug },
    { id: 'attendance', label: 'Team Attendance', icon: Clock },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
  ];

  return (
    <aside className="manager-sidebar">
      <div className="manager-sidebar-header">
        <div className="manager-logo-wrapper">
          <img src={settings.logo || defaultLogo} alt={settings.companyName} className="manager-logo-img" />
        </div>
      </div>

      <nav className="manager-sidebar-nav">
        <div className="nav-section">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`manager-nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="nav-icon" size={20} />
              <span className="nav-label">{item.label}</span>
              {activeTab === item.id && <div className="active-dot" />}
            </button>
          ))}
        </div>
      </nav>

      <div className="manager-sidebar-footer">
        <button className="manager-nav-link logout-btn" onClick={onLogout}>
          <LogOut className="nav-icon" size={20} />
          <span className="nav-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default ManagerSidebar;
