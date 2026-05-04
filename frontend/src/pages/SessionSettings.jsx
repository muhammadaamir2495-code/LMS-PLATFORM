import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { SkeletonStatCard } from '../components/SkeletonLoader';

const SessionSettings = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/auth/sessions');
      setSessions(res.data.data);
    } catch (err) {
      toast.error('Failed to sync sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await api.delete(`/auth/sessions/${id}`);
      setSessions(sessions.filter(s => s._id !== id));
      toast.success('Device logged out');
    } catch (err) {
      toast.error('Revocation failed');
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-12">
        <div className="d-inline-flex align-items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full mb-4 fw-bold text-xs tracking-wider text-uppercase border-glass">Security Settings</div>
        <h1 className="mb-2 fw-black display-4 text-white">Active Sessions</h1>
        <p className="text-muted fs-5">Manage and revoke access from your currently logged-in devices.</p>
      </header>

      <Row className="g-8">
        <Col lg={8}>
          <div className="card glass-surface border-0 rounded-xl overflow-hidden shadow-2xl">
            <div className="card-header bg-white-5 p-6 border-bottom border-glass">
              <h5 className="mb-0 text-white fw-bold small tracking-widest uppercase">Your Connected Devices</h5>
            </div>
            <div className="card-body p-6">
              {loading ? [1,2,3].map(n => <div key={n} className="mb-4"><SkeletonStatCard /></div>) : (
                <div className="d-flex flex-column gap-4">
                  <AnimatePresence>
                    {sessions.map((session) => (
                      <motion.div 
                        key={session._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-4 bg-white-5 rounded-xl border-glass d-flex align-items-center justify-content-between gap-4"
                      >
                        <div className="d-flex align-items-center gap-4">
                          <div className="bg-primary bg-opacity-10 text-primary rounded-xl p-3">
                            <i className={`bi ${session.userAgent?.includes('Mobi') ? 'bi-phone' : 'bi-laptop'} fs-4`}></i>
                          </div>
                          <div>
                            <div className="fw-bold text-white d-flex align-items-center gap-2">
                              {session.userAgent?.split(' ')[0] || 'Unknown Browser'}
                              {session.ipAddress === '::1' || session.ipAddress === '127.0.0.1' ? <Badge bg="success" className="text-xs fw-bold">Current Device</Badge> : null}
                            </div>
                            <div className="text-dim text-xs mt-1">
                              IP: {session.ipAddress} • Last used: {new Date(session.lastUsedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="text-danger border-glass hover-bg-danger-soft px-4 py-2 text-xs fw-black"
                          onClick={() => handleRevoke(session._id)}
                        >
                          LOGOUT
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="card glass-surface border-0 rounded-xl overflow-hidden shadow-2xl p-6 bg-primary bg-opacity-5 border-primary border-opacity-20">
            <h5 className="text-white fw-black mb-4">Security Tip</h5>
            <p className="text-dim text-sm mb-6">If you notice any unfamiliar devices in this list, we recommend revoking their access immediately and changing your password.</p>
            <div className="bg-white-5 p-4 rounded-xl text-xs text-muted border-glass">
              Your IP: <span className="text-primary fw-bold">Dynamic</span>
            </div>
          </div>
        </Col>
      </Row>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
        .border-glass { border: 1px solid var(--border-glass); }
        .hover-bg-danger-soft:hover { background: rgba(239, 68, 68, 0.1) !important; color: #ef4444 !important; }
      `}} />
    </DashboardLayout>
  );
};

export default SessionSettings;
