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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Verification Error: Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const res = await register(dataToSend);
      if (res.success) {
        toast.success('Identity Created');
        const role = res.user.role;
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'instructor') navigate('/instructor-dashboard');
        else navigate('/student-dashboard');
      } else {
        toast.error(res.message || 'Identity initialization failed');
      }
    } catch (err) {
      toast.error('System synchronization failure');
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
                Join the<br />Future of<br />Software.
              </h1>
              <p className="text-muted fs-5 leading-relaxed" style={{ maxWidth: '340px' }}>
                Initialize your professional profile and begin your journey into high-scale engineering.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right-panel flex-grow-1 d-flex align-items-center justify-content-center p-6 p-lg-12">
          <motion.div 
            className="glass-surface p-10 p-lg-12 shadow-2xl"
            style={{ width: '100%', maxWidth: '580px', borderRadius: '32px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-white fw-black mb-2 display-6 tracking-tight">Create Identity</h2>
              <p className="text-muted small fw-medium tracking-wide">Join 10,000+ elite learners globally.</p>
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
                </div>
              </Form.Group>

              <Form.Group className="mb-6">
                <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Email Address</Form.Label>
                <div className="position-relative">
                  <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-4 text-dim"></i>
                  <Form.Control 
                    className="form-control bg-white-5 border-glass py-3 ps-12 text-white text-xs"
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="name@example.com"
                    required 
                  />
                </div>
              </Form.Group>

              <Row className="g-6">
                <Col md={6}>
                  <Form.Group className="mb-6">
                    <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Master Key</Form.Label>
                    <div className="position-relative">
                      <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-4 text-dim"></i>
                      <Form.Control 
                        className="form-control bg-white-5 border-glass py-3 ps-12 text-white text-xs"
                        type={showPassword ? 'text' : 'password'} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="••••••••"
                        required 
                        minLength="6"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-6">
                    <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Confirm Key</Form.Label>
                    <div className="position-relative">
                      <i className="bi bi-shield-check position-absolute top-50 start-0 translate-middle-y ms-4 text-dim"></i>
                      <Form.Control 
                        className="form-control bg-white-5 border-glass py-3 ps-12 text-white text-xs"
                        type={showPassword ? 'text' : 'password'} 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        placeholder="••••••••"
                        required 
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-10">
                <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-4 tracking-widest d-block">Access Permission Level</Form.Label>
                <div className="d-flex gap-4">
                  <motion.div 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-grow-1 p-4 border rounded-xl text-center cursor-pointer transition-smooth ${formData.role === 'student' ? 'border-primary bg-primary bg-opacity-10' : 'border-glass bg-white-5'}`}
                    onClick={() => setFormData({...formData, role: 'student'})}
                  >
                    <div className={`fw-black text-xs tracking-widest ${formData.role === 'student' ? 'text-primary' : 'text-muted'}`}>STUDENT</div>
                    <div className="text-dim mt-1" style={{ fontSize: '10px' }}>Learn Assets</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-grow-1 p-4 border rounded-xl text-center cursor-pointer transition-smooth ${formData.role === 'instructor' ? 'border-secondary bg-secondary bg-opacity-10' : 'border-glass bg-white-5'}`}
                    onClick={() => setFormData({...formData, role: 'instructor'})}
                  >
                    <div className={`fw-black text-xs tracking-widest ${formData.role === 'instructor' ? 'text-secondary' : 'text-muted'}`}>INSTRUCTOR</div>
                    <div className="text-dim mt-1" style={{ fontSize: '10px' }}>Architect Content</div>
                  </motion.div>
                </div>
              </Form.Group>

              <button 
                type="submit" 
                className="btn-premium w-full py-3.5 mb-8 text-xs fw-bold tracking-widest shadow-glow"
                disabled={loading}
              >
                {loading ? 'INITIALIZING PROFILE...' : 'CONSTRUCT IDENTITY'}
              </button>
              
              <div className="text-center">
                <span className="text-dim text-xs fw-bold tracking-wide">EXISTING IDENTITY? </span>
                <Link to="/login" className="text-primary text-xs fw-bold text-decoration-none hover-white">RETURN TO TERMINAL</Link>
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
