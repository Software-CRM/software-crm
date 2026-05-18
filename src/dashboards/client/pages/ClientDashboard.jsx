import React, { useState } from 'react';
import { 
  Bell, 
  User,
  Calendar
} from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils';

// Components
import ClientSidebar from '../components/ClientSidebar';

// Modules
import ClientOverview from '../modules/ClientDashboard';
import ProjectTracking from '../modules/ProjectTracking';
import SupportTickets from '../modules/SupportTickets';
import Billing from '../modules/Billing';

import './ClientDashboard.css';

const ClientDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <ClientOverview />;
      case 'projects': return <ProjectTracking />;
      case 'tickets': return <SupportTickets />;
      case 'billing': return <Billing />;
      default: return <ClientOverview />;
    }
  };

  return (
    <div className="client-portal-container">
      <ClientSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      
      <main className="client-main-content">
        <header className="client-top-header">
          <div className="client-welcome">
            <span className="greeting">Good Morning,</span>
            <h2 className="client-name">{user?.fullName || 'Client'}</h2>
          </div>
          
          <div className="client-header-actions">
            <div className="header-date" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginRight: '1.5rem' }}>
              <Calendar size={16} />
              <span>{formatDate()}</span>
            </div>
            <button className="notification-btn"><Bell size={20} /></button>
            <div className="client-profile-trigger">
              <div className="profile-info">
                <span>{user?.companyName || 'Corporate Client'}</span>
              </div>
              <div className="profile-avatar"><User size={20} /></div>
            </div>
          </div>
        </header>

        <div className="client-tab-container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;


