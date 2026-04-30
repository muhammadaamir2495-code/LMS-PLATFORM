import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // Redirect to their respective dashboard if not authorized
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" />;
    if (user.role === 'instructor') return <Navigate to="/instructor-dashboard" />;
    return <Navigate to="/student-dashboard" />;
  }

  return children;
};

export default PrivateRoute;
