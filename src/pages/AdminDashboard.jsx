


// import React, { useState } from 'react';

// import {
//   Bell,
//   User as UserIcon,
//   ChevronDown,
//   Moon,
//   Sun,
//   Calendar,
// } from 'lucide-react';

// import { formatDate } from '../utils/dateUtils';
// import AdminSidebar from '../dashboards/admin/components/AdminSidebar';

// // Modular Dashboard Components
// import DashboardOverview from '../dashboards/admin/modules/DashboardOverview';
// import UserManagement from '../dashboards/admin/modules/UserManagement';
// import ProjectManagement from '../dashboards/admin/modules/ProjectManagement';
// import CompanySettings from '../dashboards/admin/modules/CompanySettings';
// import GeneralSettings from '../dashboards/admin/modules/GeneralSettings';
// import Reports from '../dashboards/admin/modules/Reports';
// import Invoices from '../dashboards/admin/modules/Invoices';
// import Plans from '../dashboards/admin/modules/Plans';
// import Logs from '../dashboards/admin/modules/Logs';

// import './AdminDashboard.css';



// const AdminDashboard = ({ user, onLogout }) => {
//   const [activeTab, setActiveTab] = useState('overview');

//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const toggleProfileMenu = () => {
//     setShowProfileMenu((prev) => !prev);
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'overview':
//         return <DashboardOverview />;

//       case 'users':
//         return <UserManagement />;

//       case 'projects':
//         return <ProjectManagement />;

//       case 'company-settings':
//         return <CompanySettings />;

//       case 'invoices':
//         return <Invoices />;

//       case 'reports':
//         return <Reports />;

//       case 'plans':
//         return <Plans />;

//       case 'settings':
//         return <GeneralSettings />;

//       case 'logs':
//         return <Logs />;

//       default:
//         return <DashboardOverview />;
//     }
//   };

//   const getTabTitle = () => {
//     const titles = {
//       overview: 'Dashboard Overview',
//       users: 'User Management',
//       projects: 'Project Management',
//       'company-settings': 'Company Settings',
//       invoices: 'Billing & Invoices',
//       reports: 'Reports & Analytics',
//       plans: 'Billing & Plans',
//       settings: 'General Settings',
//       logs: 'System Logs',
//     };

//     return titles[activeTab] || 'Admin Dashboard';
//   };

//   return (
//     <div className={`dashboard-root ${isDarkMode ? 'dark-mode' : ''}`}>
//       {/* SIDEBAR */}

//       <AdminSidebar
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         onLogout={onLogout}
//       />

//       {/* MAIN CONTENT */}

//       <div className="dashboard-main">
//         {/* TOPBAR */}

//         <header className="dashboard-topbar">
//           <div className="topbar-left">
//             <h1 className="page-title">{getTabTitle()}</h1>
//           </div>

//           <div className="topbar-right">
//             {/* DATE */}

//             <div className="topbar-date">
//               <Calendar size={16} />

//               <span>{formatDate()}</span>
//             </div>

//             {/* ACTIONS */}

//             <div className="topbar-actions">
//               {/* DARK MODE */}

//               <button
//                 className="action-icon-btn"
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//               >
//                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//               </button>

//               {/* NOTIFICATION */}

//               <div className="notification-wrapper">
//                 <button className="action-icon-btn">
//                   <Bell size={20} />

//                   <span className="notif-badge"></span>
//                 </button>
//               </div>

//               {/* DIVIDER */}

//               <div className="v-divider" />

//               {/* PROFILE */}

//               <div className="profile-wrapper">
//                 <div
//                   className="user-profile-dropdown"
//                   onClick={toggleProfileMenu}
//                 >
//                   <div className="avatar-small">
//                     <UserIcon size={18} />
//                   </div>

//                   <div className="user-info">
//                     <span className="u-name">
//                       {user?.fullName || 'Admin User'}
//                     </span>

//                     <span className="u-role">
//                       {user?.role || 'Administrator'}
//                     </span>
//                   </div>

//                   <ChevronDown
//                     size={14}
//                     className={`dropdown-arrow ${
//                       showProfileMenu ? 'rotate' : ''
//                     }`}
//                   />
//                 </div>

          

                
//                  {showProfileMenu && (
//   <div className="profile-menu">

 

//     <div className="profile-header">
//       <div className="profile-avatar">
//         <UserIcon size={28} />
//       </div>

//       <div>
//         <h4>
//           {user?.fullName || 'Admin User'}
//         </h4>

//         <p>
//           {user?.email || 'admin@crm.com'}
//         </p>
//       </div>
//     </div>

 

//     <button
//       className="menu-item"
//       onClick={() => {
//         setActiveTab('settings');
//         setShowProfileMenu(false);
//       }}
//     >
//       Profile
//     </button>



   



//     <button
//       className="menu-item logout"
//       onClick={() => {
//         setShowProfileMenu(false);
//         onLogout();
//       }}
//     >
//       Logout
//     </button>

//   </div>
// )} 
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* PAGE CONTENT */}

//         <main className="dashboard-viewport">
//           {renderTabContent()}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState } from 'react';

import {
  Bell,
  User as UserIcon,
  ChevronDown,
  Moon,
  Sun,
  Calendar,
  X,
  Mail,
  Briefcase,
  Edit,
  Save,
} from 'lucide-react';

import { formatDate } from '../utils/dateUtils';

import AdminSidebar from '../dashboards/admin/components/AdminSidebar';

// Modular Dashboard Components
import DashboardOverview from '../dashboards/admin/modules/DashboardOverview';
import UserManagement from '../dashboards/admin/modules/UserManagement';
import ProjectManagement from '../dashboards/admin/modules/ProjectManagement';
import CompanySettings from '../dashboards/admin/modules/CompanySettings';
import GeneralSettings from '../dashboards/admin/modules/GeneralSettings';
import Reports from '../dashboards/admin/modules/Reports';
import Invoices from '../dashboards/admin/modules/Invoices';
import Plans from '../dashboards/admin/modules/Plans';
import Logs from '../dashboards/admin/modules/Logs';

import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {

  const [activeTab, setActiveTab] = useState('overview');

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'Admin User',
    email: user?.email || 'admin@crm.com',
    role: user?.role || 'Administrator',
  });

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  // HANDLE PROFILE INPUTS

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // SAVE PROFILE

  const handleSaveProfile = () => {
    setIsEditingProfile(false);

    // Optional Backend API
    // await api.put("/profile/update", profileData)

    alert('Profile Updated Successfully');
  };

  // RENDER TABS

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
        return <GeneralSettings />;

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

            <div className="topbar-date">
              <Calendar size={16} />
              <span>{formatDate()}</span>
            </div>

            {/* ACTIONS */}

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

              {/* NOTIFICATIONS */}

              <div className="notification-wrapper">

                <button className="action-icon-btn">
                  <Bell size={20} />
                  <span className="notif-badge"></span>
                </button>

              </div>

              {/* DIVIDER */}

              <div className="v-divider" />

              {/* PROFILE */}

              <div className="profile-wrapper">

                <div
                  className="user-profile-dropdown"
                  onClick={toggleProfileMenu}
                >

                  <div className="avatar-small">
                    <UserIcon size={18} />
                  </div>

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
                    className={`dropdown-arrow ${
                      showProfileMenu ? 'rotate' : ''
                    }`}
                  />

                </div>

                {/* PROFILE MENU */}

                {showProfileMenu && (

                  <div className="profile-menu">

                    {/* HEADER */}

                    <div className="profile-header">

                      <div className="profile-avatar">
                        <UserIcon size={28} />
                      </div>

                      <div>

                        <h4>
                          {profileData.fullName}
                        </h4>

                        <p>
                          {profileData.email}
                        </p>

                      </div>

                    </div>

                    {/* PROFILE BUTTON */}

                    <button
                      className="menu-item"
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowProfileMenu(false);
                      }}
                    >
                      Profile
                    </button>

                    {/* LOGOUT */}

                    <button
                      className="menu-item logout"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}

        <main className="dashboard-viewport">
          {renderTabContent()}
        </main>

      </div>

      {/* PROFILE MODAL */}

      {showProfileModal && (

        <div className="profile-modal-overlay">

          <div className="profile-modal">

            {/* HEADER */}

            <div className="profile-modal-header">

              <h2>User Profile</h2>

              <button
                className="close-profile-btn"
                onClick={() => {
                  setShowProfileModal(false);
                  setIsEditingProfile(false);
                }}
              >
                <X size={20} />
              </button>

            </div>

            {/* AVATAR */}

            <div className="profile-avatar-large">
              <UserIcon size={45} />
            </div>

            {/* PROFILE CONTENT */}

            <div className="profile-modal-content">

              {/* NAME */}

              <div className="profile-field">

                <label>
                  <UserIcon size={16} />
                  Full Name
                </label>

                {isEditingProfile ? (

                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                  />

                ) : (

                  <p>{profileData.fullName}</p>

                )}

              </div>

              {/* EMAIL */}

              <div className="profile-field">

                <label>
                  <Mail size={16} />
                  Email
                </label>

                {isEditingProfile ? (

                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />

                ) : (

                  <p>{profileData.email}</p>

                )}

              </div>

              {/* ROLE */}

              <div className="profile-field">

                <label>
                  <Briefcase size={16} />
                  Designation
                </label>

                {isEditingProfile ? (

                  <input
                    type="text"
                    name="role"
                    value={profileData.role}
                    onChange={handleProfileChange}
                  />

                ) : (

                  <p>{profileData.role}</p>

                )}

              </div>

              {/* ACTION BUTTONS */}

              <div className="profile-modal-actions">

                {!isEditingProfile ? (

                  <button
                    className="edit-profile-btn"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>

                ) : (

                  <button
                    className="save-profile-btn"
                    onClick={handleSaveProfile}
                  >
                    <Save size={16} />
                    Save Changes
                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminDashboard;
