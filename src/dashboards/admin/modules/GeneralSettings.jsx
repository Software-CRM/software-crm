import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Monitor,
  CheckCircle2,
  Save,
  Camera,
  Mail,
  Globe,
  Smartphone,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@cabptoid.com',
    bio: 'Product Designer at Cabptoid Solutions.'
  });

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const navItems = [
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Monitor size={18} /> },
  ];

  return (
    <div className="tab-content settings-tab">
      <div className="tab-header-actions mb-8">
        <div className="tab-header-text">
          <h2 className="text-2xl font-bold">General Settings</h2>
          <p className="text-muted">Manage your personal preferences and account security.</p>
        </div>
        
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="status-toast-inline success-bg"
            >
              <CheckCircle2 size={18} />
              <span>Changes saved successfully</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="settings-container-grid">
        {/* Sleek Vertical Sidebar */}
        <aside className="settings-nav-sidebar">
          {navItems.map((item) => (
            <button 
              key={item.id}
              className={`settings-nav-pill ${activeSubTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveSubTab(item.id)}
            >
              <span className="nav-pill-icon">{item.icon}</span>
              <span className="nav-pill-label">{item.label}</span>
              {activeSubTab === item.id && <motion.div layoutId="pill-bg" className="pill-active-bg" />}
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="settings-content-pane">
          <motion.div 
            key={activeSubTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="settings-glass-card"
          >
            {activeSubTab === 'profile' && (
              <div className="settings-inner-section">
                <div className="section-header-styled">
                  <h3>Personal Information</h3>
                  <p>Update your profile details and avatar.</p>
                </div>

                <div className="profile-hero-upload">
                  <div className="avatar-preview-wrapper">
                    <div className="avatar-large-circle">JD</div>
                    <button className="avatar-edit-overlay">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="upload-instructions">
                    <p className="font-semibold">Your Profile Picture</p>
                    <p className="text-xs text-muted">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="premium-form-grid mt-8">
                  <div className="form-input-pair">
                    <div className="input-field-group">
                      <label>First Name</label>
                      <input 
                        type="text" 
                        value={formData.firstName} 
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="input-field-group">
                      <label>Last Name</label>
                      <input 
                        type="text" 
                        value={formData.lastName} 
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Email Address</label>
                    <div className="input-with-prefix-icon">
                      <Mail size={16} className="prefix-icon" />
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Biography</label>
                    <textarea 
                      rows="4" 
                      value={formData.bio} 
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'security' && (
              <div className="settings-inner-section">
                <div className="section-header-styled">
                  <h3>Security & Authentication</h3>
                  <p>Manage your password and account security settings.</p>
                </div>

                <div className="premium-form-grid mt-8">
                  <div className="input-field-group">
                    <label>Current Password</label>
                    <input type="password" placeholder="Enter current password" />
                  </div>
                  
                  <div className="form-input-pair">
                    <div className="input-field-group">
                      <label>New Password</label>
                      <input type="password" placeholder="Min. 8 characters" />
                    </div>
                    <div className="input-field-group">
                      <label>Confirm Password</label>
                      <input type="password" placeholder="Repeat new password" />
                    </div>
                  </div>

                  <div className="security-advanced-options mt-6">
                    <div className="security-feature-card">
                      <div className="feature-icon-box">
                        <Smartphone size={20} />
                      </div>
                      <div className="feature-text">
                        <p className="feature-title">Two-Factor Authentication</p>
                        <p className="feature-desc">Add an extra layer of security using your mobile device.</p>
                      </div>
                      <label className="premium-toggle">
                        <input type="checkbox" />
                        <span className="premium-slider"></span>
                      </label>
                    </div>

                    <div className="security-feature-card mt-4">
                      <div className="feature-icon-box">
                        <Fingerprint size={20} />
                      </div>
                      <div className="feature-text">
                        <p className="feature-title">Biometric Login</p>
                        <p className="feature-desc">Use TouchID or FaceID for faster, secure access.</p>
                      </div>
                      <label className="premium-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="premium-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'notifications' && (
              <div className="settings-inner-section">
                <div className="section-header-styled">
                  <h3>Notification Preferences</h3>
                  <p>Choose how you want to be notified about activity.</p>
                </div>

                <div className="security-advanced-options mt-8">
                  <div className="security-feature-card">
                    <div className="feature-icon-box"><Mail size={20} /></div>
                    <div className="feature-text">
                      <p className="feature-title">Email Notifications</p>
                      <p className="feature-desc">Receive daily reports and security alerts via email.</p>
                    </div>
                    <label className="premium-toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="premium-slider"></span>
                    </label>
                  </div>

                  <div className="security-feature-card mt-4">
                    <div className="feature-icon-box"><Bell size={20} /></div>
                    <div className="feature-text">
                      <p className="feature-title">Push Notifications</p>
                      <p className="feature-desc">Get instant updates on your desktop or mobile device.</p>
                    </div>
                    <label className="premium-toggle">
                      <input type="checkbox" />
                      <span className="premium-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'preferences' && (
              <div className="settings-inner-section">
                <div className="section-header-styled">
                  <h3>App Preferences</h3>
                  <p>Customize your workspace experience.</p>
                </div>

                <div className="premium-form-grid mt-8">
                  <div className="form-input-pair">
                    <div className="input-field-group">
                      <label>Language</label>
                      <select className="premium-select">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div className="input-field-group">
                      <label>Timezone</label>
                      <select className="premium-select">
                        <option>(GMT+05:30) India Standard Time</option>
                        <option>(GMT-08:00) Pacific Time</option>
                        <option>(GMT+00:00) London</option>
                      </select>
                    </div>
                  </div>

                  <div className="security-feature-card mt-6">
                    <div className="feature-icon-box"><Monitor size={20} /></div>
                    <div className="feature-text">
                      <p className="feature-title">Dark Mode</p>
                      <p className="feature-desc">Switch between light and dark themes for the dashboard.</p>
                    </div>
                    <label className="premium-toggle">
                      <input type="checkbox" />
                      <span className="premium-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="settings-action-footer">
              <button className="settings-cancel-btn">Discard Changes</button>
              <button className="settings-save-btn" onClick={handleSave}>
                <Save size={18} />
                <span>Save Settings</span>
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SettingsTab;

