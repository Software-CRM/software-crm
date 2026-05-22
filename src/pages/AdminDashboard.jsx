

// import React, { useState } from 'react';

// import {
//   Bell,
//   User as UserIcon,
//   ChevronDown,
//   Moon,
//   Sun,
//   Calendar,
//   X,
//   Mail,
//   Briefcase,
//   Edit,
//   Save,
//   Camera,
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

//   const [showProfileModal, setShowProfileModal] = useState(false);

//   const [isEditingProfile, setIsEditingProfile] = useState(false);

//   const [profileData, setProfileData] = useState({
//     fullName: user?.fullName || 'Admin User',
//     email: user?.email || 'admin@crm.com',
//     role: user?.role || 'Administrator',
//   });

//   const toggleProfileMenu = () => {
//     setShowProfileMenu((prev) => !prev);
//   };

//   // HANDLE PROFILE INPUTS

//   const handleProfileChange = (e) => {
//     setProfileData({
//       ...profileData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // SAVE PROFILE

//   const handleSaveProfile = () => {
//     setIsEditingProfile(false);

//     // Optional Backend API
//     // await api.put("/profile/update", profileData)

//     alert('Profile Updated Successfully');
//   };

//   // RENDER TABS

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

//   // PAGE TITLE

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

//       {/* MAIN */}

//       <div className="dashboard-main">

//         {/* TOPBAR */}

//         <header className="dashboard-topbar">

//           <div className="topbar-left">
//             <h1 className="page-title">
//               {getTabTitle()}
//             </h1>
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
//                 {isDarkMode ? (
//                   <Sun size={20} />
//                 ) : (
//                   <Moon size={20} />
//                 )}
//               </button>

//               {/* NOTIFICATIONS */}

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
//                       {profileData.fullName}
//                     </span>

//                     <span className="u-role">
//                       {profileData.role}
//                     </span>

//                   </div>

//                   <ChevronDown
//                     size={14}
//                     className={`dropdown-arrow ${
//                       showProfileMenu ? 'rotate' : ''
//                     }`}
//                   />

//                 </div>

//                 {/* PROFILE MENU */}

//                 {showProfileMenu && (

//                   <div className="profile-menu">

//                     {/* HEADER */}

//                     <div className="profile-header">

//                       <div className="profile-avatar">
//                         <UserIcon size={28} />
//                       </div>

//                       <div>

//                         <h4>
//                           {profileData.fullName}
//                         </h4>

//                         <p>
//                           {profileData.email}
//                         </p>

//                       </div>

//                     </div>

//                     {/* PROFILE BUTTON */}

//                     <button
//                       className="menu-item"
//                       onClick={() => {
//                         setShowProfileModal(true);
//                         setShowProfileMenu(false);
//                       }}
//                     >
//                       Profile
//                     </button>

//                     {/* LOGOUT */}

//                     <button
//                       className="menu-item logout"
//                       onClick={() => {
//                         setShowProfileMenu(false);
//                         onLogout();
//                       }}
//                     >
//                       Logout
//                     </button>

//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* PAGE CONTENT */}

//         <main className="dashboard-viewport">
//           {renderTabContent()}
//         </main>

//       </div>

//       {/* PROFILE MODAL */}

//       {showProfileModal && (

//         <div className="profile-modal-overlay">

//           <div className="profile-modal">

//             {/* HEADER */}

//             <div className="profile-modal-header">

//               <h2>User Profile</h2>

//               <button
//                 className="close-profile-btn"
//                 onClick={() => {
//                   setShowProfileModal(false);
//                   setIsEditingProfile(false);
//                 }}
//               >
//                 <X size={20} />
//               </button>

//             </div>

//             {/* AVATAR */}

//             <div className="profile-avatar-large">
//               <UserIcon size={45} />
//             </div>

//             {/* PROFILE CONTENT */}

//             <div className="profile-modal-content">

//               {/* NAME */}

//               <div className="profile-field">

//                 <label>
//                   <UserIcon size={16} />
//                   Full Name
//                 </label>

//                 {isEditingProfile ? (

//                   <input
//                     type="text"
//                     name="fullName"
//                     value={profileData.fullName}
//                     onChange={handleProfileChange}
//                   />

//                 ) : (

//                   <p>{profileData.fullName}</p>

//                 )}

//               </div>

//               {/* EMAIL */}

//               <div className="profile-field">

//                 <label>
//                   <Mail size={16} />
//                   Email
//                 </label>

//                 {isEditingProfile ? (

//                   <input
//                     type="email"
//                     name="email"
//                     value={profileData.email}
//                     onChange={handleProfileChange}
//                   />

//                 ) : (

//                   <p>{profileData.email}</p>

//                 )}

//               </div>

//               {/* ROLE */}

//               <div className="profile-field">

//                 <label>
//                   <Briefcase size={16} />
//                   Designation
//                 </label>

//                 {isEditingProfile ? (

//                   <input
//                     type="text"
//                     name="role"
//                     value={profileData.role}
//                     onChange={handleProfileChange}
//                   />

//                 ) : (

//                   <p>{profileData.role}</p>

//                 )}

//               </div>

//               {/* ACTION BUTTONS */}

//               <div className="profile-modal-actions">

//                 {!isEditingProfile ? (

//                   <button
//                     className="edit-profile-btn"
//                     onClick={() => setIsEditingProfile(true)}
//                   >
//                     <Edit size={16} />
//                     Edit Profile
//                   </button>

//                 ) : (

//                   <button
//                     className="save-profile-btn"
//                     onClick={handleSaveProfile}
//                   >
//                     <Save size={16} />
//                     Save Changes
//                   </button>

//                 )}

//               </div>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// };

// export default AdminDashboard;                            


import React, { useState, useEffect } from 'react';

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
    Fingerprint,
} from 'lucide-react';

import { formatDate } from '../utils/dateUtils';

import AdminSidebar from '../dashboards/admin/components/AdminSidebar';

// MODULES
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

const AdminDashboard = ({ user, onLogout, onUserUpdate }) => {

  const [activeTab, setActiveTab] = useState('overview');

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);

  // CENTRALIZED PROFILE STATE

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'Admin User',
    email: user?.email || 'admin@crm.com',
    role: user?.role || 'Administrator',
    profileImage: user?.profileImage || '',
  });

  // Keep local profileData in sync when parent `user` prop changes
  useEffect(() => {
    setProfileData((prev) => ({
      fullName: user?.fullName || prev.fullName,
      email: user?.email || prev.email,
      role: user?.role || prev.role,
      profileImage: user?.profileImage || prev.profileImage,
    }));
  }, [user]);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
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
            onUserUpdate={onUserUpdate}
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

              <div className="v-divider" />

              {/* PROFILE */}

              <div className="profile-wrapper">

                <div
                  className="user-profile-dropdown"
                  onClick={toggleProfileMenu}
                >

                  {/* PROFILE IMAGE */}

                  <div className="avatar-small">

                    {profileData.profileImage ? (

                      <img
                        src={profileData.profileImage}
                        alt="Profile"
                        className="profile-img-small"
                      />

                    ) : (

                      <UserIcon size={18} />

                    )}

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

                    <div className="profile-header">

                      <div className="profile-avatar">

                        {profileData.profileImage ? (

                          <img
                            src={profileData.profileImage}
                            alt="Profile"
                            className="profile-img-large"
                          />

                        ) : (

                          <UserIcon size={28} />

                        )}

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

                    {/* PROFILE */}

                    <button
                      className="menu-item"
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowProfileMenu(false);
                      }}
                    >
                      View Profile
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

        {/* CONTENT */}

        <main className="dashboard-viewport">
          {renderTabContent()}
        </main>

      </div>

      {/* PROFILE MODAL */}
{showProfileModal && (

  <div className="profile-modal-overlay">

    <div className="profile-modal modern-profile-modal">

      {/* CLOSE BUTTON */}

      <button
        className="close-profile-btn modern-close-btn"
        onClick={() => setShowProfileModal(false)}
      >
        <X size={20} />
      </button>

      {/* TOP COVER */}

      <div className="profile-cover-gradient"></div>

      {/* PROFILE HEADER */}

      <div className="profile-header-modern">

        <div className="profile-avatar-wrapper-modern">

          {profileData.profileImage ? (

            <img
              src={profileData.profileImage}
              alt="Profile"
              className="profile-modal-image"
            />

          ) : (

            <div className="fallback-avatar-text">
              {profileData.fullName?.charAt(0)}
            </div>

          )}

          <span className="online-status-dot"></span>

        </div>

        <div className="profile-main-info">

          {/* <h2 className="profile-user-name">
            {profileData.fullName}
          </h2> */}

          <p className="profile-user-role">
            {profileData.role}
          </p>

          <div className="profile-status-badge">
            Active Administrator
          </div>

        </div>

      </div>

      {/* BODY */}

      <div className="profile-body-content">

        {/* INFO GRID */}

        <div className="profile-info-grid">

          {/* EMAIL */}

          <div className="profile-info-card">

            <div className="info-icon-box">
              <Mail size={18} />
            </div>

            <div className="info-content">

              <span>Email Address</span>

              <p>{profileData.email}</p>

            </div>

          </div>

          {/* ROLE */}

          <div className="profile-info-card">

            <div className="info-icon-box">
              <Briefcase size={18} />
            </div>

            <div className="info-content">

              <span>Designation</span>

              <p>{profileData.role}</p>

            </div>

          </div>

          {/* FULL NAME */}

          <div className="profile-info-card">

            <div className="info-icon-box">
              <UserIcon size={18} />
            </div>

            <div className="info-content">

              <span>Full Name</span>

              <p>{profileData.fullName}</p>

            </div>

          </div>

          {/* USER ID */}

          <div className="profile-info-card">

            <div className="info-icon-box">
              <Fingerprint size={18} />
            </div>

            <div className="info-content">

              <span>User ID</span>

              <p>ADM-2026-001</p>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="profile-footer-section">

          <div className="profile-footer-card">

            <span>Member Since</span>

            <p>January 2026</p>

          </div>

          <div className="profile-footer-card">

            <span>Account Status</span>

            <p className="active-text">
              Verified & Active
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>

)}
    </div>
  );
};

export default AdminDashboard;

