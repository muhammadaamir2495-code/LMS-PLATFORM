import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({ user: null, loading: false, error: null });
  }, []);

  /**
   * CENTRALIZED ROLE ROUTING LOGIC
   * Single source of truth for dashboard mapping
   */
  const getDashboardPath = useCallback((role) => {
    const normalizedRole = role?.toLowerCase();
    switch (normalizedRole) {
      case 'admin': return '/admin-dashboard';
      case 'instructor': return '/instructor-dashboard';
      case 'student': return '/student-dashboard';
      default: return '/login';
    }
  }, []);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            const userInfo = JSON.parse(savedUser);
            // Ensure role exists to prevent routing loops
            if (!userInfo.role) throw new Error("Corrupted User Profile");
            setAuthState({ user: userInfo, loading: false, error: null });
            return;
          }
        } catch (error) {
          logout();
        }
      }
      setAuthState(prev => ({ ...prev, loading: false }));
    };

    initializeAuth();

    const handleUnauthorized = () => {
      logout();
      window.location.href = '/login';
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, [logout]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({ user, loading: false, error: null });
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      setAuthState(prev => ({ ...prev, error: message }));
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({ user, loading: false, error: null });
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const contextValue = useMemo(() => ({
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
    getDashboardPath // Centralized helper
  }), [authState.user, authState.loading, authState.error, logout, getDashboardPath]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
