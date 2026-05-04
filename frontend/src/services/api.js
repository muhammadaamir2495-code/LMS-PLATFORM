import axios from 'axios';

// 🎯 Ensure no hardcoded localhost URLs
const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API}/api/v1`,
  timeout: 10000, // 10s Enterprise Timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle session expiration
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }

    // Parse user-friendly error message
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Attach clean message for components to use
    error.friendlyMessage = message;
    
    return Promise.reject(error);
  }
);

export default api;
