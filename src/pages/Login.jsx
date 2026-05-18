import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useCompany } from '../context/useCompany';
import defaultLogo from '../assets/logo.png';

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { settings } = useCompany();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Server error: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        onLoginSuccess(data);
        const roleRoutes = {
          'ADMIN': '/admin/dashboard',
          'MANAGER': '/manager-dashboard',
          'CLIENT': '/client/portal',
          'EMPLOYEE': '/workspace/tasks'
        };
        navigate(roleRoutes[data.role] || '/login');
      }, 100);

    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Connection Failed: Is backend running?');
    }
  };

  return (
    <div className="login-page-wrapper min-h-screen w-full flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <div className="bg-blob-3"></div>
      <div className="bg-grid-overlay"></div>

      <div className="login-card-container w-full max-w-[1050px] mx-auto overflow-hidden flex flex-col lg:flex-row relative z-10">
        {/* Left Side: Hero Image Section */}
        <div className="login-hero-section flex-[1.2] relative hidden lg:flex items-center justify-center h-full self-stretch p-8">
          <div className="hero-overlay"></div>
          <div className="hero-glass-card">
            <div className="hero-content">
              <h1>Scalable Enterprise <br />Intelligence</h1>
              <p>Unified software solutions designed to orchestrate and automate complex workflows for global organizations.</p>
              <div className="hero-stats">
                <div className="hero-stat-item">
                  <span>99.9%</span>
                  <p>Uptime</p>
                </div>
                <div className="hero-stat-item">
                  <span>24/7</span>
                  <p>Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="login-form-section flex-1 bg-white flex flex-col justify-center items-center p-6 lg:p-12 h-full self-stretch">
          <div className="form-inner-container w-full max-w-[400px] mx-auto flex flex-col gap-4">
            <div className="brand-header">
              <img
                src={settings.logo || defaultLogo}
                alt={settings.companyName}
                className="form-brand-logo"
              />
            </div>

            {error && <div className="error-alert"><span>⚠️</span> {error}</div>}
            {isSuccess && <div className="success-alert">Success! Redirecting to your portal...</div>}

            <form onSubmit={handleSubmit} className="modern-login-form">
              <div className="form-group">
                <label>Username</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError(''); // Clear error on type
                    }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon password-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(''); // Clear error on type
                    }}
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? "👁️‍🗨️" : "👁️"}
                  </span>
                </div>
              </div>

              <div className="form-extra">
                <label className="remember-me-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="modern-forgot-link">Forgot Password?</a>
              </div>

              <button type="submit" disabled={isLoading || isSuccess} className="modern-submit-btn">
                {isLoading ? "Verifying..." : isSuccess ? "Redirecting..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;