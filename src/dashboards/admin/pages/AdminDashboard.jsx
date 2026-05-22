// import React, { useState } from 'react';
// import { 
//   Bell, 
//   User as UserIcon, 
//   ChevronDown, 
//   Menu,
//   Moon,
//   Sun,
//   Calendar
// } from 'lucide-react';
// import { formatDate } from '../../../utils/dateUtils';
// import AdminSidebar from '../components/AdminSidebar';

// // Modular Dashboard Components
// import DashboardOverview from '../modules/DashboardOverview';
// import UserManagement from '../modules/UserManagement';
// import ProjectManagement from '../modules/ProjectManagement';
// import CompanySettings from '../modules/CompanySettings';
// import GeneralSettings from '../modules/GeneralSettings';
// import Reports from '../modules/Reports';
// import Invoices from '../modules/Invoices';
// import Plans from '../modules/Plans';
// import Logs from '../modules/Logs';

// import './AdminDashboard.css';

// const AdminDashboard = ({ user, onLogout }) => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'overview': return <DashboardOverview />;
//       case 'users': return <UserManagement />;
//       case 'company-settings': return <CompanySettings />;
//       case 'projects': return <ProjectManagement />;
//       case 'invoices': return <Invoices />;
//       case 'reports': return <Reports />;
//       case 'plans': return <Plans />;
//       case 'settings': return <GeneralSettings />;
//       case 'logs': return <Logs />;
//       default: return <DashboardOverview />;
//     }
//   };

//   const getTabTitle = () => {
//     const titles = {
//       overview: 'Dashboard Overview',
//       projects: 'Project Management',
//       'company-settings': 'Company Settings',
//       invoices: 'Billing & Invoices',
//       reports: 'Reports & Analytics',
//       plans: 'Billing & Plans',
//       settings: 'General Settings',
//       logs: 'System Logs'
//     };
//     return titles[activeTab] || 'Admin Dashboard';
//   };

//   return (
//     <div className={`dashboard-root ${isDarkMode ? 'dark-mode' : ''}`}>
//       <AdminSidebar 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab} 
//         onLogout={onLogout}
//       />

//       <div className="dashboard-main">
//         <header className="dashboard-topbar">
//           <div className="topbar-left">
//             <h1 className="page-title">{getTabTitle()}</h1>
//           </div>

//           <div className="topbar-right">
//             <div className="topbar-date" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginRight: '1rem' }}>
//               <Calendar size={16} />
//               <span>{formatDate()}</span>
//             </div>
//             <div className="topbar-actions">
//               <button 
//                 className="action-icon-btn" 
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//               >
//                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//               </button>
//               <div className="notification-wrapper">
//                 <button className="action-icon-btn">
//                   <Bell size={20} />
//                   <span className="notif-badge"></span>
//                 </button>
//               </div>
//               <div className="v-divider" />
//               <div className="user-profile-dropdown">
//                 <div className="avatar-small">
//                   <UserIcon size={18} />
//                 </div>
//                 <div className="user-info">
//                   <span className="u-name">{user?.fullName || 'Admin User'}</span>
//                   <span className="u-role">{user?.role || 'Administrator'}</span>
//                 </div>
//                 <ChevronDown size={14} className="dropdown-arrow" />
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="dashboard-viewport">
//           {renderTabContent()}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';

import {
  Bell,
  User as UserIcon,
  ChevronDown,
  Moon,
  Sun,
  Calendar,
} from 'lucide-react';

import { formatDate } from '../../../utils/dateUtils';

import AdminSidebar from '../components/AdminSidebar';

// MODULES

import DashboardOverview from '../modules/DashboardOverview';
import UserManagement from '../modules/UserManagement';
import ProjectManagement from '../modules/ProjectManagement';
import CompanySettings from '../modules/CompanySettings';
import GeneralSettings from '../modules/GeneralSettings';
import Reports from '../modules/Reports';
import Invoices from '../modules/Invoices';
import Plans from '../modules/Plans';
import Logs from '../modules/Logs';

import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {

  const [activeTab, setActiveTab] = useState('overview');

  const [isDarkMode, setIsDarkMode] = useState(false);

  // CENTRALIZED PROFILE STATE

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'Admin User',
    email: user?.email || 'admin@crm.com',
    role: user?.role || 'Administrator',
    profileImage: user?.profilePhoto || '',
  });

  // LOAD LOCAL STORAGE PROFILE

  useEffect(() => {

    const savedProfile = localStorage.getItem('crm_profile');

    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }

  }, []);

  // SAVE TO LOCAL STORAGE

  useEffect(() => {

    localStorage.setItem(
      'crm_profile',
      JSON.stringify(profileData)
    );

  }, [profileData]);

  // HANDLE USER UPDATE FROM SETTINGS

  const handleUserUpdate = (updatedData) => {

    setProfileData((prev) => ({
      ...prev,
      ...updatedData,
    }));

  };

  // RENDER MODULES

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

        return (
          <GeneralSettings
            profileData={profileData}
            setProfileData={setProfileData}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onUserUpdate={handleUserUpdate}
          />
        );

      case 'logs':
        return <Logs />;

      default:
        return <DashboardOverview />;
    }
  };

  // PAGE TITLE

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

      {/* MAIN */}

      <div className="dashboard-main">

        {/* TOPBAR */}

        <header className="dashboard-topbar">

          <div className="topbar-left">

            <h1 className="page-title">
              {getTabTitle()}
            </h1>

          </div>

          <div className="topbar-right">

            {/* DATE */}

            <div
              className="topbar-date"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#64748b',
                fontSize: '0.9rem',
                marginRight: '1rem',
              }}
            >

              <Calendar size={16} />

              <span>{formatDate()}</span>

            </div>

            <div className="topbar-actions">

              {/* DARK MODE */}

              <button
                className="action-icon-btn"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >

                {isDarkMode ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}

              </button>

              {/* NOTIFICATION */}

              <div className="notification-wrapper">

                <button className="action-icon-btn">

                  <Bell size={20} />

                  <span className="notif-badge"></span>

                </button>

              </div>

              <div className="v-divider" />

              {/* PROFILE */}

              <div className="user-profile-dropdown">

                {/* PROFILE IMAGE */}

                <div className="avatar-small">

                  {profileData.profileImage ? (

                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="topbar-profile-image"
                    />

                  ) : (

                    <UserIcon size={18} />

                  )}

                </div>

                {/* USER INFO */}

                <div className="user-info">

                  <span className="u-name">
                    {profileData.fullName}
                  </span>

                  <span className="u-role">
                    {profileData.role}
                  </span>

                </div>

                <ChevronDown
                  size={14}
                  className="dropdown-arrow"
                />

              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <main className="dashboard-viewport">
          {renderTabContent()}
        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;

