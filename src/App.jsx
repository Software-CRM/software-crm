import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

import { profileService } from './services/profileService';

// Dashboard Pages
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ClientDashboard from './dashboards/client/pages/ClientDashboard';

import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // If a pendingProfileUpdate exists (from offline/save-failure), merge and retry
    const raw = localStorage.getItem('pendingProfileUpdate');
    if (raw) {
      try {
        const pending = JSON.parse(raw);
        const merged = { ...userData, ...pending };
        setUser(merged);
        localStorage.setItem('user', JSON.stringify(merged));

        // fire-and-forget retry
        profileService.updateProfile(pending).then(() => {
          localStorage.removeItem('pendingProfileUpdate');
        }).catch((err) => {
          console.warn('Retry pending update after login failed:', err);
        });
      } catch (e) {
        console.error('Invalid pendingProfileUpdate on login:', e);
        localStorage.removeItem('pendingProfileUpdate');
      }
    }
  };

  // If there was a pending profile update saved locally (because server persist failed),
  // merge it into the current user and attempt to persist it now.
  useEffect(() => {
    const tryPending = async () => {
      const raw = localStorage.getItem('pendingProfileUpdate');
      if (!raw) return;

      let pending;
      try {
        pending = JSON.parse(raw);
      } catch (e) {
        console.error('Invalid pendingProfileUpdate:', e);
        localStorage.removeItem('pendingProfileUpdate');
        return;
      }

      // merge into user state
      setUser((current) => {
        const merged = { ...(current || {}), ...pending };
        localStorage.setItem('user', JSON.stringify(merged));
        return merged;
      });

      // attempt to persist to server
      try {
        await profileService.updateProfile(pending);
        localStorage.removeItem('pendingProfileUpdate');
      } catch (err) {
        console.warn('Retrying pending profile update failed:', err);
        // keep pending for next retry
      }
    };

    tryPending();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleUserUpdate = (updates) => {
    setUser((currentUser) => {
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLogin} />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard
                  user={user}
                  onLogout={handleLogout}
                  onUserUpdate={handleUserUpdate}
                />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/workspace/tasks"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <EmployeeDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Client Routes */}
          <Route
            path="/client/portal"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
