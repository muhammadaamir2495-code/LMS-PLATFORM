import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

/**
 * PRODUCTION-GRADE API HOOK
 * Automatically handles:
 * - Loading states
 * - User-friendly error parsing
 * - Toast notifications
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(config);
      return response.data;
    } catch (err) {
      const msg = err.friendlyMessage || 'Something went wrong';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
};
