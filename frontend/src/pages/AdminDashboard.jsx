import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import EmptyState from '../components/dashboard/EmptyState';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // DATA STATE
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalStudents: 0, totalInstructors: 0 });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, coursesRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/courses')
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data);
        setCourses(coursesRes.data.data);
      } catch (err) {
        toast.error('Terminal Sync Failure');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    const typedConfirm = prompt('DANGER: This action is permanent. Type "DELETE" to confirm:');
    if (typedConfirm !== 'DELETE') return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('Subject Removed');
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      toast.error('Authorization Denied');
    }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <header className="mb-12">
        <div className="d-inline-flex align-items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full mb-4 fw-bold text-xs tracking-wider text-uppercase border-glass">
          Master Node • Global Intelligence
        </div>
        <h1 className="mb-2 fw-black display-4 text-white">Platform Oversight</h1>
        <p className="text-muted fs-5">Real-time telemetry and management of the NexusLMS ecosystem.</p>
      </header>

      <Row className="mb-12 g-6">
        <Col md={3}>
          <StatCard 
            label="Platform Citizens" 
            value={stats.totalUsers} 
            icon="bi-people" 
            trend={12} 
            subLabel="Total active accounts"
          />
        </Col>
        <Col md={3}>
          <StatCard 
            label="Active Nodes" 
            value={stats.totalStudents} 
            icon="bi-mortarboard" 
            color="#6366f1"
            subLabel="Student Enrollment Hub" 
          />
        </Col>
        <Col md={3}>
          <StatCard 
            label="Architect Core" 
            value={stats.totalInstructors} 
            icon="bi-shield-check" 
            color="#ec4899"
            subLabel="Licensed Instructors" 
          />
        </Col>
        <Col md={3}>
          <StatCard 
            label="Neural Assets" 
            value={stats.totalCourses} 
            icon="bi-layers" 
            color="#10b981"
            trend={24} 
            subLabel="Published Modules" 
          />
        </Col>
      </Row>

      <div className="card glass-surface border-0 rounded-xl overflow-hidden shadow-2xl">
        <div className="card-header bg-white-5 p-6 border-bottom border-glass d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
          <div className="d-flex gap-2">
            <button 
              onClick={() => setActiveTab('users')} 
              className={`btn btn-xs fw-bold px-4 py-2.5 transition-all ${activeTab === 'users' ? 'btn-premium' : 'btn-ghost text-muted'}`}
            >
              IDENTITY REGISTRY
            </button>
            <button 
              onClick={() => setActiveTab('courses')} 
              className={`btn btn-xs fw-bold px-4 py-2.5 transition-all ${activeTab === 'courses' ? 'btn-premium' : 'btn-ghost text-muted'}`}
            >
              MODULE CATALOG
            </button>
          </div>
          <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
            <i className="bi bi-filter position-absolute top-50 start-0 translate-middle-y ms-3 text-dim"></i>
            <input 
              type="text" 
              className="form-control bg-white-5 border-glass py-2 ps-10 text-xs text-white" 
              placeholder={`Search ${activeTab}...`} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card-body p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {activeTab === 'users' ? (
                filteredUsers.length === 0 ? (
                  <EmptyState icon="bi-people" title="No Users Found" description="The registry is currently empty or your search yielded no results." />
                ) : (
                  <div className="table-responsive">
                    <table className="table-v2">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Credential</th>
                          <th>Permission</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u._id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36, fontSize: '12px' }}>
                                  {u.name.charAt(0)}
                                </div>
                                <span className="fw-bold text-white">{u.name}</span>
                              </div>
                            </td>
                            <td><span className="text-dim small">{u.email}</span></td>
                            <td>
                              <span className={`badge px-3 py-1 rounded-full text-xs text-uppercase tracking-widest ${u.role === 'admin' ? 'bg-danger bg-opacity-20 text-danger' : u.role === 'instructor' ? 'bg-secondary bg-opacity-20 text-secondary' : 'bg-primary bg-opacity-20 text-primary'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <button onClick={() => handleDeleteUser(u._id)} className="btn btn-ghost text-danger p-2 hover-scale"><i className="bi bi-trash"></i></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                filteredCourses.length === 0 ? (
                  <EmptyState icon="bi-layers" title="No Courses Found" description="The catalog is currently empty or your search yielded no results." />
                ) : (
                  <div className="table-responsive">
                    <table className="table-v2">
                      <thead>
                        <tr>
                          <th>Module Title</th>
                          <th>Category Node</th>
                          <th>Status</th>
                          <th>Architect</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map((c) => (
                          <tr key={c._id}>
                            <td><span className="fw-bold text-white">{c.title}</span></td>
                            <td><span className="text-dim small tracking-widest text-uppercase">{c.category}</span></td>
                            <td>
                              <span className={`badge px-3 py-1 rounded-full text-xs text-uppercase tracking-widest ${c.status === 'published' ? 'bg-success bg-opacity-20 text-success' : 'bg-warning bg-opacity-20 text-warning'}`}>
                                {c.status}
                              </span>
                            </td>
                            <td><span className="text-dim small">{c.instructor?.name || 'SYSTEM'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
        .border-glass { border: 1px solid var(--border-glass); }
        .hover-scale:hover { transform: scale(1.15); transition: all 0.2s ease; }
        .btn-xs { font-size: 10px; }
        .ps-10 { padding-left: 2.5rem !important; }
      `}} />
    </DashboardLayout>
  );
};

export default AdminDashboard;
