import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Smart Redirect Handler
 * Automatically sends logged-in users to their correct dashboard
 * while allowing them to browse the landing page if they explicitly choose to.
 * Primarily used for the Root path "/" or "/login"
 */
const RoleBasedRedirect = ({ children, toDashboardOnly = false }) => {
  const { user, loading, getDashboardPath } = useContext(AuthContext);

  if (loading) return null;

  if (user) {
    // If we're on login page or if we want strict dashboard enforcement
    if (toDashboardOnly) {
      return <Navigate to={getDashboardPath(user.role)} replace />;
    }
  }

  return children;
};

export default RoleBasedRedirect;
