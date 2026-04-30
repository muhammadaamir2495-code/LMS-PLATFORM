import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data.data);
        
        if (isAuthenticated && user?.role === 'student') {
          try {
            const enrollmentsRes = await api.get('/my-courses');
            const isEnrolled = enrollmentsRes.data.data.some(
              (enrollment) => enrollment.course._id === id || enrollment.course === id
            );
            if (isEnrolled) setEnrollSuccess(true);
          } catch (err) {
            console.error('Enrollment check failed', err);
          }
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course details');
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEnrollLoading(true);
    try {
      await api.post('/enroll', { courseId: id });
      setEnrollSuccess(true);
      toast.success('Enrollment successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-app">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-6 text-xs fw-bold text-uppercase tracking-widest">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-app">
        <div className="glass-surface p-12 text-center shadow-2xl border-glass" style={{ maxWidth: '520px', borderRadius: '32px' }}>
          <i className="bi bi-exclamation-triangle text-danger fs-1 mb-8 d-block"></i>
          <h2 className="mb-4 text-white fw-black">Course Not Found</h2>
          <p className="text-muted mb-10">{error || 'We couldn\'t find the course you\'re looking for. It may have been moved.'}</p>
          <Link to="/courses" className="btn-premium px-12 py-3 text-xs fw-bold">Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-app min-vh-100 text-white">
      {/* 1. HERO SECTION - Premium Dark SaaS Style */}
      <section className="position-relative py-24 py-lg-32 overflow-hidden border-bottom border-glass">
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)', zIndex: 0 }}></div>
        
        <Container className="position-relative z-1">
          <Row className="align-items-center g-16">
            <Col lg={7}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="d-flex align-items-center gap-4 mb-8">
                  <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-20 px-4 py-2 text-xs fw-bold tracking-widest text-uppercase">
                    {course.category}
                  </span>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-star-fill text-warning"></i>
                    <span className="text-muted text-xs fw-bold tracking-widest">4.9 RATING</span>
                  </div>
                </div>
                <h1 className="display-3 fw-black text-white mb-8 tracking-tighter" style={{ lineHeight: '1' }}>{course.title}</h1>
                <p className="fs-5 text-muted mb-10 leading-relaxed" style={{ maxWidth: '640px' }}>{course.description}</p>
                
                <div className="d-flex align-items-center gap-4 pt-4 border-top border-glass border-opacity-50">
                  <div className="bg-white-5 rounded-circle d-flex align-items-center justify-content-center text-dim shadow-lg" style={{ width: 56, height: 56 }}>
                    <i className="bi bi-person fs-4"></i>
                  </div>
                  <div>
                    <div className="text-dim text-xs fw-bold text-uppercase tracking-widest mb-1">Instructor</div>
                    <div className="fw-bold text-white fs-5">{course.instructor?.name || 'Nexus Expert'}</div>
                  </div>
                </div>
              </motion.div>
            </Col>
            
            <Col lg={5} className="d-none d-lg-block">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-surface p-2 shadow-2xl rounded-3xl border-glass">
                <img 
                  src={course.thumbnail && course.thumbnail !== 'no-photo.jpg' 
                        ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${import.meta.env.VITE_API_URL}${course.thumbnail}`) 
                        : `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80`} 
                  className="w-full rounded-2xl opacity-80"
                  style={{ height: '360px', objectFit: 'cover' }}
                  alt={course.title}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. CONTENT SECTION */}
      <Container className="py-24">
        <Row className="g-16">
          <Col lg={8}>
            <div className="mb-16">
              <h3 className="mb-8 fw-black text-white tracking-tight">Overview</h3>
              <div className="glass-surface p-10 rounded-2xl border-glass">
                <p className="text-muted fs-6 leading-relaxed mb-0" style={{ whiteSpace: 'pre-wrap' }}>{course.description}</p>
              </div>
            </div>

            <div className="mb-16">
              <h3 className="mb-8 fw-black text-white tracking-tight">What you'll learn</h3>
              <Row className="g-6">
                {[
                  "Master project architecture",
                  "Professional developer workflows",
                  "Performance optimization",
                  "Industry-recognized certification"
                ].map((item, idx) => (
                  <Col md={6} key={idx}>
                    <div className="d-flex align-items-center gap-4 p-5 bg-white-5 border-glass rounded-xl shadow-sm">
                      <div className="bg-success bg-opacity-20 text-success rounded-circle p-1 d-flex">
                        <i className="bi bi-check2 fw-black"></i>
                      </div>
                      <span className="text-xs fw-bold text-muted tracking-wide">{item}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          <Col lg={4}>
            <div className="sticky-top" style={{ top: '2rem' }}>
              <div className="glass-surface p-10 shadow-2xl border-glass" style={{ borderRadius: '32px' }}>
                <div className="mb-10 pb-10 border-bottom border-glass">
                  <span className="text-dim text-xs fw-bold text-uppercase d-block mb-3 tracking-widest">Pricing</span>
                  <div className="d-flex align-items-baseline gap-3">
                    <h2 className="display-4 fw-black text-white mb-0">${course.price}</h2>
                    <span className="text-dim fw-bold">USD</span>
                  </div>
                </div>

                {enrollSuccess ? (
                  <div className="bg-success bg-opacity-5 p-8 rounded-2xl border border-success border-opacity-10 text-center">
                    <div className="bg-success bg-opacity-20 text-success rounded-circle d-inline-flex p-4 mb-6">
                      <i className="bi bi-patch-check-fill fs-2"></i>
                    </div>
                    <h4 className="fw-black text-white mb-2 tracking-tight">Enrolled</h4>
                    <p className="text-muted small mb-8">You've successfully enrolled in this course.</p>
                    <Link to="/student-dashboard" className="btn-premium w-full py-3 text-xs fw-bold tracking-widest">Go to Dashboard</Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-6">
                    <button 
                      className="btn-premium w-full py-4 text-xs fw-black tracking-widest shadow-glow" 
                      onClick={handleEnroll}
                      disabled={enrollLoading || (user && user.role !== 'student')}
                    >
                      {enrollLoading ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                    {user && user.role !== 'student' && (
                      <div className="p-4 bg-white-5 rounded-xl text-center border-glass">
                        <span className="text-xs text-dim fw-bold tracking-wide">Only students can join this course</span>
                      </div>
                    )}
                    <div className="pt-6">
                      <h6 className="text-dim text-xs fw-bold tracking-widest text-uppercase mb-6">What is inside</h6>
                      <ul className="list-unstyled d-flex flex-column gap-5 mb-0">
                        <li className="d-flex align-items-center gap-4 text-xs fw-bold text-muted tracking-wide text-uppercase">
                          <i className="bi bi-play-circle text-primary fs-5"></i> 40+ hours content
                        </li>
                        <li className="d-flex align-items-center gap-4 text-xs fw-bold text-muted tracking-wide text-uppercase">
                          <i className="bi bi-file-earmark-arrow-down text-primary fs-5"></i> 12 practice files
                        </li>
                        <li className="d-flex align-items-center gap-4 text-xs fw-bold text-muted tracking-wide text-uppercase">
                          <i className="bi bi-award text-primary fs-5"></i> Course certificate
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
        .border-glass { border: 1px solid var(--border-glass); }
        .rounded-2xl { border-radius: 1.25rem; }
        .rounded-3xl { border-radius: 2rem; }
        .shadow-glow { box-shadow: 0 0 30px rgba(99, 102, 241, 0.3); }
        .leading-relaxed { line-height: 1.6; }
        .tracking-tighter { letter-spacing: -0.06em; }
      `}} />
    </div>
  );
};

export default CourseDetail;
