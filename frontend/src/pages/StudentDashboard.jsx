import React, { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import EmptyState from '../components/dashboard/EmptyState';
import { SkeletonCard, SkeletonStatCard } from '../components/SkeletonLoader';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get('/student/my-courses');
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
      api.put(`/student/progress/${courseId}`, { progress: newProgress }),
      {
        loading: 'Updating records...',
        success: () => {
          setEnrollments(enrollments.map(item => (item.course?._id === courseId) ? { ...item, progress: newProgress } : item));
          return 'Milestone recorded';
        },
        error: 'Update failed'
      }
    );
  };

  const filteredEnrollments = enrollments.filter(e => e.course?.title.toLowerCase().includes(search.toLowerCase()));
  const lastAccessed = enrollments.find(e => e.progress < 100) || enrollments[0];

  return (
    <DashboardLayout>
      <header className="mb-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
        <div>
          <div className="d-inline-flex align-items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full mb-4 fw-bold text-xs tracking-wider text-uppercase border-glass">STUDENT PORTAL</div>
          <h1 className="mb-2 fw-black display-4 text-white">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted fs-5">You have completed {enrollments.filter(e => e.progress === 100).length} modules this month.</p>
        </div>
        <div className="position-relative" style={{ maxWidth: '350px', width: '100%' }}>
          <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-4 text-dim"></i>
          <input type="text" className="form-control bg-white-5 border-glass py-3 ps-12 text-white rounded-xl shadow-inner" placeholder="Search my courses..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>

      {loading ? (
        <Row className="mb-12 g-6">
          <Col md={12}><SkeletonCard /></Col>
          {[1,2,3].map(n => <Col key={n} md={4}><SkeletonCard /></Col>)}
        </Row>
      ) : enrollments.length === 0 ? (
        <EmptyState icon="bi-mortarboard" title="No Enrollments Yet" description="Explore our catalog to start your learning journey." actionText="BROWSE CATALOG" onAction={() => window.location.href='/courses'} />
      ) : (
        <>
          {!search && lastAccessed && (
            <section className="mb-16">
              <div className="d-flex align-items-center gap-3 mb-8"><i className="bi bi-lightning-charge-fill text-warning fs-4"></i><h3 className="mb-0 text-white fw-bold">Continue Learning</h3></div>
              <div className="card glass-surface border-0 rounded-2xl overflow-hidden shadow-2xl p-8">
                <Row className="align-items-center g-8">
                  <Col lg={7}>
                    <div className="text-xs fw-bold text-primary text-uppercase tracking-widest mb-3">{lastAccessed.course?.category}</div>
                    <h2 className="text-white fw-black mb-6">{lastAccessed.course?.title}</h2>
                    <div className="mb-8">
                      <div className="d-flex justify-content-between mb-2 text-xs font-bold text-dim tracking-wider uppercase"><span>PROGRESSION</span><span>{lastAccessed.progress}%</span></div>
                      <div className="progress bg-white-5" style={{ height: '8px', borderRadius: '10px' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${lastAccessed.progress}%` }} className="progress-bar bg-gradient-primary" style={{ borderRadius: '10px' }}></motion.div>
                      </div>
                    </div>
                    <div className="d-flex gap-4">
                      <Link to={`/courses/${lastAccessed.course?._id}`} className="btn-premium px-8 py-3 rounded-xl shadow-lg">RESUME COURSE</Link>
                      {lastAccessed.progress < 100 && (
                        <button onClick={() => handleUpdateProgress(lastAccessed.course?._id, lastAccessed.progress)} className="btn btn-ghost border-glass px-6 rounded-xl text-white font-bold text-xs tracking-widest">NEXT LESSON</button>
                      )}
                    </div>
                  </Col>
                  <Col lg={5} className="d-none d-lg-block">
                    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ height: '240px' }}>
                      <div className="w-full h-100 bg-gradient-to-br from-indigo-900 to-purple-900 d-flex align-items-center justify-content-center"><i className="bi bi-play-circle text-white-20 display-1"></i></div>
                    </div>
                  </Col>
                </Row>
              </div>
            </section>
          )}

          <section>
            <div className="d-flex align-items-center justify-content-between mb-8"><h3 className="mb-0 text-white fw-bold">Enrolled Modules</h3></div>
            <Row className="g-8">
              {filteredEnrollments.map((enrollment, idx) => (
                <Col key={enrollment._id} md={6} lg={4}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="card stat-card-premium h-100 border-0 d-flex flex-column p-0 overflow-hidden">
                    <div className="position-relative" style={{ height: '140px' }}>
                      <div className="w-full h-100 bg-gradient-to-br from-slate-800 to-slate-900 d-flex align-items-center justify-content-center"><i className="bi bi-layers text-white-5 fs-2"></i></div>
                    </div>
                    <div className="p-6 flex-grow-1 d-flex flex-column">
                      <div className="text-dim text-xs fw-bold text-uppercase tracking-widest mb-3">{enrollment.course?.category}</div>
                      <h5 className="mb-6 fw-bold text-white leading-tight">{enrollment.course?.title}</h5>
                      <div className="mt-auto pt-6 border-glass">
                        <div className="d-flex justify-content-between mb-3 text-xs fw-bold text-dim"><span>Status: {enrollment.progress === 100 ? 'Completed' : 'In Progress'}</span><span>{enrollment.progress || 0}%</span></div>
                        <div className="progress bg-white-5 mb-6" style={{ height: '6px' }}><motion.div initial={{ width: 0 }} animate={{ width: `${enrollment.progress || 0}%` }} className="progress-bar bg-primary"></motion.div></div>
                        <Link to={`/courses/${enrollment.course?._id}`} aria-label={`View details for ${enrollment.course?.title}`} className="btn btn-ghost border-glass text-white text-xs fw-bold w-full py-2.5 transition-all hover:bg-white-5">VIEW DETAILS</Link>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </section>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
        .bg-gradient-primary { background: linear-gradient(90deg, var(--primary-color), #818cf8); }
        .last\\:border-0:last-child { border: 0 !important; }
      `}} />
    </DashboardLayout>
  );
};

export default StudentDashboard;
