import React, { useState, useContext, useEffect, useRef } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const res = await register(dataToSend);
      if (res.success) {
        toast.success('Sequence Complete: Account Initialized');
        const role = res.user.role;
        navigate(role === 'admin' ? '/admin-dashboard' : role === 'instructor' ? '/instructor-dashboard' : '/student-dashboard');
      } else {
        toast.error(res.message || 'Access Denied: Initialization Failure');
      }
    } catch (err) {
      // Interceptor handles the toast message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view min-vh-100 bg-app overflow-hidden">
      <div className="auth-split-layout d-flex min-vh-100">
        {/* Left Visual Panel */}
        <div className="auth-left-panel d-none d-lg-flex flex-grow-1 position-relative overflow-hidden p-16 align-items-center">
          <div className="position-absolute bottom-0 end-0 w-100 h-100" style={{ background: 'radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)', zIndex: 0 }}></div>
          <div className="position-relative z-1">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-white-5 backdrop-blur border-glass rounded-xl d-inline-flex align-items-center justify-content-center mb-8 p-4 shadow-2xl">
                <i className="bi bi-person-plus fs-1 text-primary"></i>
              </div>
              <h1 className="display-2 fw-black text-white mb-6" style={{ letterSpacing: '-0.06em', lineHeight: '1' }}>
                Join the<br />Future of<br />Learning.
              </h1>
              <p className="text-muted fs-5 leading-relaxed" style={{ maxWidth: '340px' }}>
                Create your account and start building your future today with professional courses.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right-panel flex-grow-1 d-flex align-items-center justify-content-center p-4 p-md-6 p-lg-12">
          <motion.div 
            className="glass-surface p-6 p-md-10 p-lg-12 shadow-2xl"
            style={{ width: '100%', maxWidth: '580px', borderRadius: 'clamp(16px, 4vw, 32px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8 mb-md-10">
              <h2 className="text-white fw-black mb-2 display-6 tracking-tight">Get Started</h2>
              <p className="text-muted small fw-medium tracking-wide">Join 10,000+ learners worldwide.</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-6">
                <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Full Name</Form.Label>
                <div className="position-relative">
                  <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-4 text-dim"></i>
                  <Form.Control 
                    ref={nameRef}
                    className="form-control bg-white-5 border-glass py-3 ps-12 text-white text-xs"
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g. John Doe"
                    required 
                  />
                  {errors.name && <div className="text-danger text-xs mt-1 fw-bold">{errors.name}</div>}
                </div>
              </Form.Group>

              <Form.Group className="mb-6">
                <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Email</Form.Label>
                <div className="position-relative">
                  <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-4 text-dim"></i>
                  <Form.Control 
                    className={`form-control bg-white-5 border-glass py-3 ps-12 text-white text-xs ${errors.email ? 'border-danger' : ''}`}
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="name@example.com"
                    required 
                  />
                  {errors.email && <div className="text-danger text-xs mt-1 fw-bold">{errors.email}</div>}
                </div>
              </Form.Group>

              <Row className="g-6">
                <Col md={6}>
                  <Form.Group className="mb-6">
                    <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Password</Form.Label>
                    <div className="position-relative">
                      <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-4 text-dim"></i>
                      <Form.Control 
                        className={`form-control bg-white-5 border-glass py-3 ps-12 text-white text-xs ${errors.password ? 'border-danger' : ''}`}
                        type={showPassword ? 'text' : 'password'} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="••••••••"
                        required 
                        minLength="6"
                      />
                      {errors.password && <div className="text-danger text-xs mt-1 fw-bold">{errors.password}</div>}
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-6">
                    <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Confirm Password</Form.Label>
                    <div className="position-relative">
                      <i className="bi bi-shield-check position-absolute top-50 start-0 translate-middle-y ms-4 text-dim"></i>
                      <Form.Control 
                        className={`form-control bg-white-5 border-glass py-3 ps-12 text-white text-xs ${errors.confirmPassword ? 'border-danger' : ''}`}
                        type={showPassword ? 'text' : 'password'} 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        placeholder="••••••••"
                        required 
                      />
                      {errors.confirmPassword && <div className="text-danger text-xs mt-1 fw-bold">{errors.confirmPassword}</div>}
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-10">
                <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-4 tracking-widest d-block">Choose Your Path</Form.Label>
                <div className="d-flex gap-4">
                  <motion.div 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-grow-1 p-4 border rounded-xl text-center cursor-pointer transition-smooth ${formData.role === 'student' ? 'border-primary bg-primary bg-opacity-10' : 'border-glass bg-white-5'}`}
                    onClick={() => setFormData({...formData, role: 'student'})}
                  >
                    <div className={`fw-black text-xs tracking-widest ${formData.role === 'student' ? 'text-primary' : 'text-muted'}`}>STUDENT</div>
                    <div className="text-dim mt-1" style={{ fontSize: '10px' }}>Learn New Skills</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-grow-1 p-4 border rounded-xl text-center cursor-pointer transition-smooth ${formData.role === 'instructor' ? 'border-secondary bg-secondary bg-opacity-10' : 'border-glass bg-white-5'}`}
                    onClick={() => setFormData({...formData, role: 'instructor'})}
                  >
                    <div className={`fw-black text-xs tracking-widest ${formData.role === 'instructor' ? 'text-secondary' : 'text-muted'}`}>TEACHER</div>
                    <div className="text-dim mt-1" style={{ fontSize: '10px' }}>Create Content</div>
                  </motion.div>
                </div>
              </Form.Group>

              <button 
                type="submit" 
                className="btn-premium w-full py-3.5 mb-8 text-xs fw-bold tracking-widest shadow-glow"
                disabled={loading}
              >
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
              
              <div className="text-center">
                <span className="text-dim text-xs fw-bold tracking-wide">ALREADY HAVE AN ACCOUNT? </span>
                <Link to="/login" className="text-primary text-xs fw-bold text-decoration-none hover-white">LOG IN</Link>
              </div>
            </Form>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
        .border-glass { border: 1px solid var(--border-glass); }
        .ps-12 { padding-left: 3rem !important; }
        .leading-relaxed { line-height: 1.6; }
        .shadow-glow { box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3); }
        .hover-white:hover { color: white !important; }
        .w-full { width: 100%; }
        .transition-smooth { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        
        @media (max-width: 991px) {
          .auth-view { background: var(--bg-app); }
          .glass-surface { background: transparent; border: none; backdrop-filter: none; box-shadow: none; padding: 1.5rem !important; }
          .auth-right-panel { padding: 0; }
        }
      `}} />
    </div>
  );
};

export default Register;
