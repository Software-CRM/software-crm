import React from 'react';
import { 
  Home, 
  FolderKanban, 
  LifeBuoy, 
  CreditCard, 
  MessageSquare,
  FileText,
  LogOut
} from 'lucide-react';
import { useCompany } from '../../../context/useCompany';
import defaultLogo from '../../../assets/logo.png';
import './ClientSidebar.css';

const ClientSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const { settings } = useCompany();

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'tickets', label: 'Support Tickets', icon: LifeBuoy },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'documents', label: 'Shared Files', icon: FileText },
  ];

  return (
    <aside className="client-sidebar">
      <div className="client-sidebar-header">
        <div className="client-logo-wrapper">
          <img src={settings.logo || defaultLogo} alt={settings.companyName} className="client-logo-img" />
        </div>
      </div>

      <nav className="client-sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`client-nav-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="nav-icon" size={20} />
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="client-sidebar-footer">
        <button className="client-nav-link logout-btn" onClick={onLogout}>
          <LogOut className="nav-icon" size={20} />
          <span className="nav-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default ClientSidebar;
