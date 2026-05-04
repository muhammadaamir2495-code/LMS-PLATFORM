import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Layout & Safety
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

// Auth & Guards
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CourseListing = lazy(() => import('./pages/CourseListing'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const About = lazy(() => import('./pages/About'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const InstructorDashboard = lazy(() => import('./pages/InstructorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const SessionSettings = lazy(() => import('./pages/SessionSettings'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingFallback = () => (
  <div className="min-vh-100 d-flex align-items-center justify-content-center bg-app">
    <div className="spinner-border text-primary" role="status"></div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<CourseListing />} />
          <Route path="/courses" element={<CourseListing />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/instructor-dashboard" element={<ProtectedRoute roles={['instructor', 'admin']}><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute roles={['student', 'instructor', 'admin']}><ProfileSettings /></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute roles={['student', 'instructor', 'admin']}><SessionSettings /></ProtectedRoute>} />
          
          {/* 🛑 404 Catch-all */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="d-flex flex-column min-vh-100 bg-app">
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
          <Navbar />
          <main className="flex-grow-1">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;