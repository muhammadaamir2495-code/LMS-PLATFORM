import React, { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { SkeletonCard } from '../components/SkeletonLoader';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import EmptyState from '../components/dashboard/EmptyState';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get('/my-courses');
        setEnrollments(response.data.data);
      } catch (err) {
        toast.error('Sync failed');
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  const handleUpdateProgress = async (courseId, currentProgress) => {
    const newProgress = Math.min(currentProgress + 20, 100);
    toast.promise(
      api.put(`/progress/${courseId}`, { progress: newProgress }),
      {
        loading: 'Syncing sequence...',
        success: () => {
          setEnrollments(enrollments.map(item => 
            (item.course?._id === courseId) ? { ...item, progress: newProgress } : item
          ));
          return 'Milestone recorded';
        },
        error: 'Sync error'
      }
    );
  };

  const activeModules = enrollments.filter(e => e.progress < 100).length;
  const completedModules = enrollments.filter(e => e.progress === 100).length;
  const avgProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) / enrollments.length) 
    : 0;

  return (
    <DashboardLayout>
      <header className="mb-12">
        <div className="d-inline-flex align-items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full mb-4 fw-bold text-xs tracking-wider text-uppercase">
          Student Portal • Learning Environment
        </div>
        <h1 className="mb-4 display-4 fw-black text-white">Dashboard Overview</h1>
        <p className="text-muted fs-5" style={{ maxWidth: '600px' }}>
          Welcome back, {user.name}. You have {activeModules} active courses.
        </p>
      </header>

      <Row className="mb-12 g-6">
        <Col md={4}>
          <StatCard 
            label="Active Courses" 
            value={enrollments.length} 
            icon="bi-grid" 
            subLabel="Total enrolled courses"
          />
        </Col>
        <Col md={4}>
          <StatCard 
            label="Completed Courses" 
            value={completedModules} 
            icon="bi-patch-check" 
            color="#10b981"
            subLabel="Courses successfully finished"
          />
        </Col>
        <Col md={4}>
          <StatCard 
            label="Overall Progress" 
            value={`${avgProgress}%`} 
            icon="bi-activity" 
            color="#6366f1"
            trend={avgProgress > 0 ? 15 : 0}
            subLabel="Your total learning completion"
          />
        </Col>
      </Row>

      <section>
        <div className="d-flex align-items-center justify-content-between mb-8">
          <h3 className="mb-0 text-white fw-bold">My Courses</h3>
          <Link to="/courses" className="btn btn-ghost text-primary fw-bold text-xs tracking-widest">
            BROWSE COURSES <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>

        {loading ? (
          <Row className="g-8">
            {[1, 2, 3].map((n) => (
              <Col key={n} md={6} lg={4}><SkeletonCard /></Col>
            ))}
          </Row>
        ) : enrollments.length === 0 ? (
          <EmptyState 
            icon="bi-journal-plus"
            title="No Active Courses"
            description="You haven't enrolled in any courses yet. Explore our catalog to start building your skills."
            actionText="Explore Courses"
            onAction={() => window.location.href = '/courses'}
          />
        ) : (
          <Row className="g-8">
            {enrollments.map((enrollment, idx) => (
              <Col key={enrollment._id} md={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card stat-card-premium h-100 border-0 d-flex flex-column"
                >
                  <div className="position-relative overflow-hidden rounded-t-xl" style={{ height: '180px' }}>
                    <div className="w-full h-100 bg-gradient-to-br from-indigo-900 to-purple-900 d-flex align-items-center justify-content-center" style={{ height: '180px' }}>
                      <i className="bi bi-display text-white-10 fs-1"></i>
                    </div>
                    <div className="position-absolute top-0 start-0 m-4">
                      <span className="badge bg-primary bg-opacity-20 backdrop-blur text-primary border border-primary border-opacity-20 px-3 py-2 text-xs">
                        {enrollment.course?.category}
                      </span>
                    </div>
                  </div>
                  <div className="card-body p-6 flex-grow-1 d-flex flex-column">
                    <h5 className="mb-6 fw-bold text-white fs-5 leading-tight">{enrollment.course?.title}</h5>
                    
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-dim text-xs fw-bold tracking-widest text-uppercase">Course Progress</span>
                        <span className="text-white fw-black text-xs">{enrollment.progress || 0}%</span>
                      </div>
                      <div className="progress mb-8 bg-white-5" style={{ height: '6px', borderRadius: '3px' }}>
                        <div 
                          className="progress-bar bg-primary" 
                          style={{ 
                            width: `${enrollment.progress || 0}%`, 
                            borderRadius: '3px',
                            transition: 'width 1s ease-in-out' 
                          }}
                        ></div>
                      </div>
                      <div className="d-flex gap-3">
                        <Link to={`/courses/${enrollment.course?._id}`} className="btn btn-ghost border-glass text-white text-xs fw-bold w-full py-2.5">VIEW DETAILS</Link>
                        {enrollment.progress < 100 ? (
                          <button className="btn-premium w-full py-2.5 text-xs" onClick={() => handleUpdateProgress(enrollment.course?._id, enrollment.progress || 0)}>CONTINUE</button>
                        ) : (
                          <button className="btn btn-ghost w-full py-2.5 text-success text-xs fw-bold border-glass" disabled>
                            <i className="bi bi-patch-check-fill me-2"></i>COMPLETED
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
        .leading-tight { line-height: 1.25; }
        .rounded-t-xl { border-top-left-radius: 1rem; border-top-right-radius: 1rem; }
      `}} />
    </DashboardLayout>
  );
};

export default StudentDashboard;
