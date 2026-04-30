import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Auth & Guards
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseListing from './pages/CourseListing';
import CourseDetail from './pages/CourseDetail';

// Dashboards
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSettings from './pages/ProfileSettings';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<CourseListing />} />
        <Route path="/courses" element={<CourseListing />} />
        <Route path="/courses/:id" element={<CourseDetail />} />

        {/* 🔐 Auth Routes (Static) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🛡️ Protected Dashboards */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute roles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor-dashboard"
          element={
            <ProtectedRoute roles={['instructor', 'admin']}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={['student', 'instructor', 'admin']}>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* 🛑 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
  