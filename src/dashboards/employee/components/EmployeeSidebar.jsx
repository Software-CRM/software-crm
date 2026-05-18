import React from 'react';
import {
  MapPin,
  FileCheck,
  MessageCircle,
  Award,
  LogOut,
  Layout,
  LayoutDashboard
} from 'lucide-react';
import { useCompany } from '../../../context/useCompany';
import defaultLogo from '../../../assets/logo.png';
import './EmployeeSidebar.css';

const EmployeeSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const { settings } = useCompany();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Tasks', icon: Layout },
    { id: 'attendance', label: 'Attendance', icon: MapPin },
    { id: 'updates', label: 'Work Updates', icon: FileCheck },
    { id: 'team', label: 'Messages', icon: MessageCircle },
    { id: 'performance', label: 'My Score', icon: Award },
  ];

  return (
    <aside className="employee-sidebar">
      <div className="employee-sidebar-header">
        <div className="employee-logo-wrapper">
          <img src={settings.logo || defaultLogo} alt={settings.companyName} className="employee-logo-img" />
        </div>
      </div>

      <nav className="employee-sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`employee-nav-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="nav-icon" size={22} />
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="employee-sidebar-footer">
        <button className="employee-nav-link logout-btn" onClick={onLogout}>
          <LogOut className="nav-icon" size={20} />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
