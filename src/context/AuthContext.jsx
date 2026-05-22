/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('[Auth] Session restored from storage:', parsedUser.username);
        return parsedUser;
      } catch (err) {
        console.error('[Auth] Failed to parse saved user:', err);
        localStorage.removeItem('user');
      }
    }
    return null;
  });
  const loading = false;


  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('[Auth] Login successful for:', userData.username);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log('[Auth] User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
