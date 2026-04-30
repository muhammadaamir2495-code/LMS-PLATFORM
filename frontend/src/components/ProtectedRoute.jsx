import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * PRODUCTION-GRADE PROTECTED ROUTE
 * Fixed: Handles role mismatch by redirecting to user's valid dashboard
 * Fixed: Blocks all routing decisions until hydration (loading === false)
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, getDashboardPath } = useContext(AuthContext);
  const location = useLocation();

  // 1. HARD HYDRATION GUARD: Prevents "Flash of Guest" or premature redirects
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-app">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  // 2. UNAUTHENTICATED: Send to login but SAVE the current location for deep-linking
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. UNAUTHORIZED ROLE: Instead of kicking to "/", send them to THEIR OWN dashboard
  const userRole = user.role?.toLowerCase();
  const allowedRoles = roles?.map(r => r.toLowerCase());

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    const fallbackPath = getDashboardPath(user.role);
    console.warn(`RBAC Violation: User [${user.role}] attempted to access [${location.pathname}]. Re-routing to [${fallbackPath}]`);
    return <Navigate to={fallbackPath} replace />;
  }

  // 4. GRANTED: Proceed to content
  return children;
};

export default ProtectedRoute;
