import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null
  });

  // 🎯 Persistent timer reference to prevent duplicates
  const logoutTimerRef = useRef(null);

  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearLogoutTimer();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({ user: null, loading: false, error: null });
  }, [clearLogoutTimer]);

  const startLogoutTimer = useCallback((token) => {
    clearLogoutTimer(); 
    try {
      const decoded = jwtDecode(token);
      
      // 🛡️ Enterprise Guard: Validate expiry existence
      if (!decoded.exp) throw new Error("Invalid Token Structure");

      const timeLeft = (decoded.exp * 1000) - Date.now();

      // 🛡️ Enterprise Guard: Clock drift or immediate expiry protection
      // If expired or time is suspiciously far in future (invalid sync)
      if (timeLeft <= 0 || timeLeft > 30 * 24 * 60 * 60 * 1000) { 
        logout();
        return;
      }

      logoutTimerRef.current = setTimeout(() => {
        logout();
        window.location.href = '/login?session=expired';
      }, timeLeft);
    } catch (error) {
      logout();
    }
  }, [logout, clearLogoutTimer]);

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
          const userInfo = JSON.parse(savedUser);
          if (!userInfo.role) throw new Error("Corrupted Profile");
          
          // 🛡️ Safety First: Start timer ONLY if validation passes
          setAuthState({ user: userInfo, loading: false, error: null });
          startLogoutTimer(token);
        } catch (error) {
          logout();
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();

    const handleUnauthorized = () => {
      logout();
      window.location.href = '/login?session=expired';
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
      clearLogoutTimer();
    };
  }, [logout, startLogoutTimer, clearLogoutTimer]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({ user, loading: false, error: null });
      startLogoutTimer(token);
      
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
      startLogoutTimer(token);
      
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
    getDashboardPath
  }), [authState.user, authState.loading, authState.error, logout, getDashboardPath]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
