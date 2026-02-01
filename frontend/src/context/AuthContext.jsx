// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const phone = localStorage.getItem('userPhone');
    
    if (token && phone) {
      setUser({ phone, token });
    }
    setLoading(false);
  }, []);

  const login = (phone, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userPhone', phone);
    setUser({ phone, token });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPhone');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
