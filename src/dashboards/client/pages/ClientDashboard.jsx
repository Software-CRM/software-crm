import React, { useState, useEffect } from 'react';

// Components
import ClientSidebar from '../components/ClientSidebar';
import ClientNavbar from '../components/ClientNavbar';
import ClientOverview from '../components/ClientOverview';
import ProjectTracking from '../components/ProjectTracking';
import SupportTickets from '../components/SupportTickets';
import Billing from '../components/Billing';

import './ClientDashboard.css';

const ClientDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('crm_theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    localStorage.setItem('crm_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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
    <div className={`client-portal-container ${isDarkMode ? 'dark-mode' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
      <ClientSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <main className="client-main-content">
        <ClientNavbar 
          user={user}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onLogout={onLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setActiveTab={setActiveTab}
        />

        <div className="client-tab-container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;


