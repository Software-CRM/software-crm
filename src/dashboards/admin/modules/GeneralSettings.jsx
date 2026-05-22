

import React, { useState, useEffect } from 'react';

import {
  Bell,
  Monitor,
  CheckCircle2,
  Save,
  Camera,
  Mail,
  Smartphone,
  Fingerprint,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { profileService } from '../../../services/profileService';

import './GeneralSettings.css';

const SettingsTab = ({
  profileData,
  setProfileData,
  isDarkMode,
  setIsDarkMode,
  onUserUpdate,
}) => {

  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);

  // FORM STATE

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: 'Product Designer at Cabptoid Solutions.',
    role: '',
  });

  // SETTINGS STATE

  const [settings, setSettings] = useState({
    twoFactor: false,
    biometric: true,
    emailNotifications: true,
    pushNotifications: false,
    darkMode: isDarkMode,
  });

  // LOAD PROFILE DATA

  // useEffect(() => {

  //   const nameParts = profileData.fullName.split(' ');

  //   setFormData({
  //     firstName: nameParts[0] || '',
  //     lastName: nameParts.slice(1).join(' ') || '',
  //     email: profileData.email || '',
  //     role: profileData.role || '',
  //     bio: 'Product Designer at Cabptoid Solutions.',
  //   });

  // }, [profileData]);


  useEffect(() => {

  if (!profileData) return;

  // SAVE ORIGINAL DATA
  setOriginalProfile(profileData);

  const nameParts = profileData.fullName?.split(' ') || [];

  setFormData({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: profileData.email || '',
    role: profileData.role || '',
    bio: profileData.bio || 'Product Designer at Cabptoid Solutions.',
  });

}, []);

  // SAVE SETTINGS

  const handleSave = async () => {
    setSaving(true);

    // Prepare updated profile and persist locally first so user doesn't lose changes
    let updatedProfile = {
      ...profileData,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: formData.role,
    };

    // Persist local changes immediately
    setProfileData(updatedProfile);
    if (typeof onUserUpdate === 'function') {
      onUserUpdate({
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        role: updatedProfile.role,
        profileImage: updatedProfile.profileImage,
      });
    }

    try {
      // If there's a selected file, upload it and update the profileImage path
      if (selectedProfileFile) {
        try {
          const uploadResult = await profileService.uploadProfileImage(
            selectedProfileFile,
          );

          const profileImagePath =
            uploadResult.path || uploadResult.imageUrl || uploadResult.url;

          if (profileImagePath) {
            updatedProfile = { ...updatedProfile, profileImage: profileImagePath };
            setProfileData(updatedProfile);
            if (typeof onUserUpdate === 'function') {
              onUserUpdate({ profileImage: profileImagePath });
            }
          }
        } catch (uplErr) {
          // Upload failed: keep local DataURL so user doesn't lose the preview
          console.error('Profile image upload failed:', uplErr);
          alert('Profile image upload failed — changes saved locally.');
        }
      }

      // Attempt to persist profile to backend; failure should not remove local state
      try {
        await profileService.updateProfile(updatedProfile);
        setSuccess(true);
      } catch (persistErr) {
        console.error('Profile update failed:', persistErr);
        // save pending so retry happens later
        try { localStorage.setItem('pendingProfileUpdate', JSON.stringify(updatedProfile)); } catch(e){}
        alert('Profile saved locally but failed to persist to server. It will retry later.');
      }

      // Ensure parent `user` is updated with the full updated profile (includes image)
      if (typeof onUserUpdate === 'function') {
        onUserUpdate({
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          role: updatedProfile.role,
          profileImage: updatedProfile.profileImage,
        });
      }

      setSelectedProfileFile(null);
    } finally {
      setSaving(false);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  // PROFILE IMAGE UPLOAD

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Read file as Data URL so it persists across refreshes until server persists
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({ ...profileData, profileImage: reader.result });
        setSelectedProfileFile(file);
      };
      reader.onerror = (err) => {
        console.error('Failed reading profile file:', err);
        // fallback to object URL
        const imageUrl = URL.createObjectURL(file);
        setProfileData({ ...profileData, profileImage: imageUrl });
        setSelectedProfileFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // TOGGLE SETTINGS

  const handleToggle = (field) => {

    const updatedSettings = {
      ...settings,
      [field]: !settings[field],
    };

    setSettings(updatedSettings);

    // DARK MODE

    if (field === 'darkMode') {

      const updatedDarkMode = !settings.darkMode;

      setIsDarkMode(updatedDarkMode);

      if (updatedDarkMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  };

  // DISCARD CHANGES

  // const handleDiscard = () => {
  //   // revert form fields to last saved profileData
  //   const nameParts = profileData.fullName.split(' ');
  //   setFormData({
  //     firstName: nameParts[0] || '',
  //     lastName: nameParts.slice(1).join(' ') || '',
  //     email: profileData.email || '',
  //     role: profileData.role || '',
  //     bio: formData.bio,
  //   });

  //   // revert any preview of profile image
  //   setProfileData((prev) => ({
  //     ...prev,
  //     profileImage: profileData.profileImage || prev.profileImage,
  //   }));

  //   setSelectedProfileFile(null);
  //   setSuccess(false);
  // };

  const handleDiscard = () => {

  if (!originalProfile) return;

  const nameParts = originalProfile.fullName?.split(' ') || [];

  // RESET FORM
  setFormData({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: originalProfile.email || '',
    role: originalProfile.role || '',
    bio: originalProfile.bio || '',
  });

  // RESET PROFILE IMAGE
  setProfileData(originalProfile);
  setOriginalProfile(updatedProfile);

  // REMOVE SELECTED FILE
  setSelectedProfileFile(null);

  // RESET SUCCESS
  setSuccess(false);
};
  return (

    <div className="tab-content settings-tab">

      {/* HEADER */}

      <div className="tab-header-actions mb-8">

        <div className="tab-header-text">

          <h2 className="text-2xl font-bold">
            General Settings
          </h2>

          <p className="text">
            Manage your personal preferences and account settings.
          </p>

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

              <span>
                Changes saved successfully
              </span>

            </motion.div>

          )}

        </AnimatePresence>

      </div>

      {/* MAIN LAYOUT */}

      <div className="settings-grid-layout">

        {/* PROFILE SECTION */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="settings-glass-card"
        >

          <div className="section-header-styled">

            <div className="section-title-icon">
              <h3>Personal Information</h3>
            </div>

            <p>
              Update your profile details and avatar.
            </p>

          </div>

          {/* PROFILE IMAGE */}

          <div className="profile-hero-upload">

            <div className="avatar-preview-wrapper">

              <div className="avatar-large-circle">

                {profileData.profileImage ? (

                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="settings-profile-image"
                  />

                ) : (

                  `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`

                )}

              </div>

              <input
                type="file"
                accept="image/*"
                id="profileUpload"
                hidden
                onChange={handleProfileUpload}
              />

              <label
                htmlFor="profileUpload"
                className="avatar-edit-overlay"
              >
                <Camera size={16} />
              </label>

            </div>

            <div className="upload-instructions">

              <p className="font-semibold">
                Your Profile Picture
              </p>

              <p className="text-xs text-muted">
                JPG, GIF or PNG. Max size of 2MB.
              </p>

            </div>

          </div>

          {/* FORM */}

          <div className="premium-form-grid mt-8">

            <div className="form-input-pair">

              <div className="input-field-group">

                <label>First Name</label>

                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstName: e.target.value,
                    })
                  }
                />

              </div>

              <div className="input-field-group">

                <label>Last Name</label>

                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastName: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="input-field-group">

              <label>Email Address</label>

              <div className="input-with-prefix-icon">

                <Mail size={16} className="prefix-icon" />

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            {/* ROLE */}

            <div className="input-field-group">

              <label>Designation</label>

              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
              />

            </div>

            {/* BIO */}

            <div className="input-field-group">

              <label>Biography</label>

              <textarea
                rows="4"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: e.target.value,
                  })
                }
              />

            </div>

          </div>

        </motion.div>

        {/* SECURITY */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="settings-glass-card mt-6"
        >

          <div className="section-header-styled">

            <div className="section-title-icon">
              <h3>Security & Authentication</h3>
            </div>

            <p>
              Manage your password and account security settings.
            </p>

          </div>

          <div className="premium-form-grid mt-8">

            <div className="input-field-group">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
              />
            </div>

            <div className="form-input-pair">

              <div className="input-field-group">
                <label>New Password</label>

                <input
                  type="password"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div className="input-field-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  placeholder="Repeat new password"
                />
              </div>

            </div>

            <div className="security-advanced-options mt-6">

              {/* TWO FACTOR */}

              <div className="security-feature-card">

                <div className="feature-icon-box">
                  <Smartphone size={20} />
                </div>

                <div className="feature-text">

                  <p className="feature-title">
                    Two-Factor Authentication
                  </p>

                  <p className="feature-desc">
                    Add an extra layer of security.
                  </p>

                </div>

                <label className="premium-toggle">

                  <input
                    type="checkbox"
                    checked={settings.twoFactor}
                    onChange={() => handleToggle('twoFactor')}
                  />

                  <span className="premium-slider"></span>

                </label>

              </div>

              {/* BIOMETRIC */}

              <div className="security-feature-card mt-4">

                <div className="feature-icon-box">
                  <Fingerprint size={20} />
                </div>

                <div className="feature-text">

                  <p className="feature-title">
                    Biometric Login
                  </p>

                  <p className="feature-desc">
                    Use FaceID or fingerprint login.
                  </p>

                </div>

                <label className="premium-toggle">

                  <input
                    type="checkbox"
                    checked={settings.biometric}
                    onChange={() => handleToggle('biometric')}
                  />

                  <span className="premium-slider"></span>

                </label>

              </div>

            </div>

          </div>

        </motion.div>

        {/* NOTIFICATIONS */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="settings-glass-card mt-6"
        >

          <div className="section-header-styled">

            <div className="section-title-icon">
              <h3>Notification Preferences</h3>
            </div>

            <p>
              Choose how you want to receive notifications.
            </p>

          </div>

          <div className="security-advanced-options mt-8">

            <div className="security-feature-card">

              <div className="feature-icon-box">
                <Mail size={20} />
              </div>

              <div className="feature-text">

                <p className="feature-title">
                  Email Notifications
                </p>

                <p className="feature-desc">
                  Receive reports and alerts via email.
                </p>

              </div>

              <label className="premium-toggle">

                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() =>
                    handleToggle('emailNotifications')
                  }
                />

                <span className="premium-slider"></span>

              </label>

            </div>

            <div className="security-feature-card mt-4">

              <div className="feature-icon-box">
                <Bell size={20} />
              </div>

              <div className="feature-text">

                <p className="feature-title">
                  Push Notifications
                </p>

                <p className="feature-desc">
                  Get instant updates on your device.
                </p>

              </div>

              <label className="premium-toggle">

                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() =>
                    handleToggle('pushNotifications')
                  }
                />

                <span className="premium-slider"></span>

              </label>

            </div>

          </div>

        </motion.div>

        {/* APP PREFERENCES */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="settings-glass-card mt-6"
        >

          <div className="section-header-styled">

            <div className="section-title-icon">
              <h3>App Preferences</h3>
            </div>

            <p>
              Customize your workspace experience.
            </p>

          </div>

          <div className="premium-form-grid mt-8">

            <div className="form-input-pair">

              <div className="input-field-group">

                <label>Language</label>

                <select className="premium-select">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                </select>

              </div>

              <div className="input-field-group">

                <label>Timezone</label>

                <select className="premium-select">
                  <option>
                    (GMT+05:30) India Standard Time
                  </option>

                  <option>
                    (GMT-08:00) Pacific Time
                  </option>

                </select>

              </div>

            </div>

            {/* DARK MODE */}

            <div className="security-feature-card mt-6">

              <div className="feature-icon-box">
                <Monitor size={20} />
              </div>

              <div className="feature-text">

                <p className="feature-title">
                  Dark Mode
                </p>

                <p className="feature-desc">
                  Switch between light and dark themes.
                </p>

              </div>

              <label className="premium-toggle">

                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => handleToggle('darkMode')}
                />

                <span className="premium-slider"></span>

              </label>

            </div>

          </div>

        </motion.div>

        {/* FOOTER */}

        <div className="settings-action-footer">

          <button className="settings-cancel-btn" onClick={handleDiscard} disabled={saving}>
            Discard Changes
          </button>

          <button
            className="settings-save-btn"
            onClick={handleSave}
            disabled={saving}
          >

            <Save size={18} />

            <span>
              {saving ? 'Saving...' : 'Save Settings'}
            </span>

          </button>

        </div>

      </div>

    </div>
  );
};

export default SettingsTab;