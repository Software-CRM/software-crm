import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BarChart3, 
  CreditCard, 
  Settings, 
  LogOut,
  Briefcase
} from 'lucide-react';
import './AdminSidebar.css';
import { useCompany } from '../../../context/useCompany';
import defaultLogo from '../../../assets/logo.png';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const { settings } = useCompany();
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'projects', label: 'Project Management', icon: Briefcase },
    { id: 'company-settings', label: 'Company Settings', icon: Building2 },
    { id: 'invoices', label: 'Billing & Invoice', icon: CreditCard },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'plans', label: 'Billing & Plans', icon: CreditCard },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-wrapper">
            <img 
              src={settings.logo || defaultLogo} 
              alt={settings.companyName} 
              className="sidebar-logo-img" 
            />
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <span className="nav-group-label">MAIN MENU</span>
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="nav-icon" size={20} />
              <span className="nav-label">{item.label}</span>
              {activeTab === item.id && <div className="active-indicator" />}
            </button>
          ))}
        </div>

        <div className="nav-group">
          <span className="nav-group-label">ADMINISTRATION</span>
          {menuItems.slice(4).map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="nav-icon" size={20} />
              <span className="nav-label">{item.label}</span>
              {activeTab === item.id && <div className="active-indicator" />}
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link settings-link" onClick={() => setActiveTab('settings')}>
          <Settings className="nav-icon" size={20} />
          <span className="nav-label">Settings</span>
        </button>
        <button className="nav-link logout-btn" onClick={onLogout}>
          <LogOut className="nav-icon" size={20} />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

