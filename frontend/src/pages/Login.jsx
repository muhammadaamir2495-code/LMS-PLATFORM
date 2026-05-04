import React, { useState, useContext, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const { login, getDashboardPath } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (isInvalid) setIsInvalid(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email: formData.email, password: formData.password });
      if (res.success) {
        toast.success('Access Granted');
        const destination = location.state?.from?.pathname || getDashboardPath(res.user.role);
        navigate(destination, { replace: true });
      } else {
        setIsInvalid(true);
        toast.error(res.message || 'Authentication failed');
      }
    } catch (err) {
      toast.error('Handshake failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-view min-vh-100 bg-app overflow-hidden">
      <div className="auth-split-layout d-flex min-vh-100">
        {/* Left Visual Panel */}
        <div className="auth-left-panel d-none d-lg-flex flex-grow-1 position-relative overflow-hidden p-16 align-items-center">
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)', zIndex: 0 }}></div>
          <div className="position-relative z-1">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-white-5 backdrop-blur border-glass rounded-xl d-inline-flex align-items-center justify-content-center mb-8 p-4 shadow-2xl">
                <i className="bi bi-mortarboard-fill fs-1 text-primary"></i>
              </div>
              <h1 className="display-2 fw-black text-white mb-6" style={{ letterSpacing: '-0.06em', lineHeight: '1' }}>
                Learn.<br />Build.<br />Scale.
              </h1>
              <p className="text-muted fs-5 leading-relaxed" style={{ maxWidth: '340px' }}>
                Welcome back. Log in to access your learning dashboard and continue building your future.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right-panel flex-grow-1 d-flex align-items-center justify-content-center p-4 p-md-6 p-lg-12">
          <motion.div 
            className="glass-surface p-6 p-md-10 p-lg-16 shadow-2xl"
            style={{ width: '100%', maxWidth: '520px', borderRadius: 'clamp(16px, 4vw, 32px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8 mb-md-12">
              <h2 className="text-white fw-black mb-2 display-6 tracking-tight">Welcome Back</h2>
              <p className="text-muted small fw-medium tracking-wide">Log in to your account to continue.</p>
            </div>

            <motion.div 
              animate={isInvalid ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-6">
                  <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Email</Form.Label>
                  <div className="position-relative">
                    <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-4 text-dim"></i>
                    <Form.Control 
                      ref={emailRef}
                      className="form-control bg-white-5 border-glass py-3 ps-12 text-white text-xs"
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="name@nexuslms.com"
                      required 
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-8">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-0 tracking-widest">Password</Form.Label>
                    <Link to="#" className="text-primary text-xs fw-bold text-decoration-none opacity-80">FORGOT PASSWORD?</Link>
                  </div>
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
                    />
                    <i 
                      className={`bi bi-eye${showPassword ? '-slash' : ''} position-absolute top-50 end-0 translate-middle-y me-4 text-dim cursor-pointer`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-10">
                  <Form.Check 
                    type="checkbox" 
                    id="rememberMe" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    label={<span className="text-xs text-muted fw-bold tracking-wide cursor-pointer ms-2">Remember Me</span>}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-premium w-full py-3.5 mb-8 text-xs fw-bold tracking-widest shadow-glow"
                  disabled={loading}
                >
                  {loading ? 'LOGGING IN...' : 'LOG IN'}
                </button>
                
                <div className="text-center">
                  <span className="text-dim text-xs fw-bold tracking-wide">NEW HERE? </span>
                  <Link to="/register" className="text-primary text-xs fw-bold text-decoration-none hover-white">GET STARTED</Link>
                </div>
              </Form>
            </motion.div>
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
        
        @media (max-width: 991px) {
          .auth-view { background: var(--bg-app); }
          .glass-surface { background: transparent; border: none; backdrop-filter: none; box-shadow: none; padding: 1.5rem !important; }
          .auth-right-panel { padding: 0; }
        }
      `}} />
    </div>
  );
};

export default Login;
