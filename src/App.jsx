import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Dashboard Pages
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ClientDashboard from './dashboards/client/pages/ClientDashboard';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles, user }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
              <ProtectedRoute allowedRoles={['ADMIN']} user={user}>
                <AdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']} user={user}>
                <ManagerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/workspace/tasks"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']} user={user}>
                <EmployeeDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Client Routes */}
          <Route
            path="/client/portal"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']} user={user}>
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
