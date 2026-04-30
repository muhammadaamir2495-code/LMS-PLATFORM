import React, { useState, useContext } from 'react';
import { Row, Col, Form, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const ProfileSettings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const updateData = { name: formData.name, email: formData.email };
      if (formData.password) updateData.password = formData.password;

      const response = await api.put('/users/profile', updateData);
      
      if (response.data.success) {
        toast.success('Profile Updated');
        // Update local context
        setUser({ ...user, ...response.data.data });
        setFormData({ ...formData, password: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-12">
        <div className="d-inline-flex align-items-center bg-accent bg-opacity-10 text-accent px-3 py-1 rounded-full mb-4 fw-bold text-xs tracking-wider text-uppercase border-glass">
          Account Settings • Profile Update
        </div>
        <h1 className="mb-2 fw-black display-4 text-white">Profile Settings</h1>
        <p className="text-muted fs-5">Update your personal information and account password.</p>
      </header>

      <Row>
        <Col lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-surface p-10 p-lg-16 rounded-3xl shadow-2xl border-glass"
          >
            <Form onSubmit={handleSubmit}>
              <div className="mb-12">
                <h4 className="text-white fw-bold mb-8 d-flex align-items-center gap-3">
                  <i className="bi bi-person-circle text-primary"></i> Basic Information
                </h4>
                <Row className="g-6">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Full Name</Form.Label>
                      <Form.Control 
                        className="form-control bg-white-5 border-glass py-3 text-white text-xs"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Email Address</Form.Label>
                      <Form.Control 
                        className="form-control bg-white-5 border-glass py-3 text-white text-xs"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="mb-12 pt-8 border-top border-glass">
                <h4 className="text-white fw-bold mb-8 d-flex align-items-center gap-3">
                  <i className="bi bi-shield-lock text-primary"></i> Password Update
                </h4>
                <p className="text-dim small mb-8">Leave blank if you don't want to change your password.</p>
                <Row className="g-6">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">New Password</Form.Label>
                      <Form.Control 
                        className="form-control bg-white-5 border-glass py-3 text-white text-xs"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Confirm Password</Form.Label>
                      <Form.Control 
                        className="form-control bg-white-5 border-glass py-3 text-white text-xs"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="d-flex justify-content-end mt-12">
                <button 
                  type="submit" 
                  className="btn-premium px-12 py-3.5 text-xs fw-black tracking-widest shadow-glow"
                  disabled={loading}
                >
                  {loading ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </Form>
          </motion.div>
        </Col>

        <Col lg={4} className="mt-8 mt-lg-0">
          <Card className="glass-surface border-glass rounded-3xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="bg-primary bg-opacity-20 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4 fw-black fs-2 shadow-glow" style={{ width: 80, height: 80 }}>
                {user?.name?.charAt(0)}
              </div>
              <h5 className="text-white fw-bold mb-1">{user?.name}</h5>
              <span className="badge bg-white-10 text-muted px-3 py-1 rounded-full text-xs text-uppercase tracking-widest border-glass">
                {user?.role}
              </span>
            </div>
            <div className="border-top border-glass pt-8">
              <div className="d-flex justify-content-between text-xs mb-4">
                <span className="text-dim fw-bold tracking-widest">ACCOUNT STATUS</span>
                <span className="text-success fw-bold tracking-widest">ACTIVE</span>
              </div>
              <div className="d-flex justify-content-between text-xs">
                <span className="text-dim fw-bold tracking-widest">USER ID</span>
                <span className="text-white opacity-50 tracking-widest">{user?._id?.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          </Card>

          <div className="p-8 bg-danger bg-opacity-5 rounded-3xl border border-danger border-opacity-10">
            <h6 className="text-danger fw-black text-xs tracking-widest mb-4">DELETE ACCOUNT</h6>
            <p className="text-dim small mb-6 leading-relaxed">Deleting your account will permanently remove all your progress and courses.</p>
            <button className="btn btn-ghost text-danger border-glass text-xs fw-bold w-full py-2.5 hover-bg-danger">
              DELETE ACCOUNT
            </button>
          </div>
        </Col>
      </Row>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
        .bg-white-10 { background: rgba(255, 255, 255, 0.1); }
        .border-glass { border: 1px solid var(--border-glass); }
        .rounded-3xl { border-radius: 2rem; }
        .shadow-glow { box-shadow: 0 0 30px rgba(99, 102, 241, 0.2); }
        .leading-relaxed { line-height: 1.6; }
        .hover-bg-danger:hover { background: rgba(239, 68, 68, 0.1) !important; border-color: rgba(239, 68, 68, 0.2) !important; }
      `}} />
    </DashboardLayout>
  );
};

export default ProfileSettings;
