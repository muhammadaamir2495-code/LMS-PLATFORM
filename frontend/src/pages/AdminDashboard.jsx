import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col } from 'react-bootstrap';
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

  const [activity, setActivity] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, coursesRes, activityRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/courses'),
          api.get('/admin/activity')
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data);
        setCourses(coursesRes.data.data);
        setActivity(activityRes.data.data);
      } catch (err) {
        toast.error('Could not load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Confirm user deletion?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User Deleted');
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Permanently remove this course?')) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success('Course Removed');
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <header className="mb-12">
        <div className="d-inline-flex align-items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full mb-4 fw-bold text-xs tracking-wider text-uppercase border-glass">
          Admin Account • System Control
        </div>
        <h1 className="mb-2 fw-black display-4 text-white">Admin Panel</h1>
        <p className="text-muted fs-5">Monitor and manage all users and courses on the platform.</p>
      </header>

      <Row className="mb-12 g-6">
        <Col md={3}><StatCard label="Total Users" value={stats.totalUsers} icon="bi-people" trend={12} /></Col>
        <Col md={3}><StatCard label="Students" value={stats.totalStudents} icon="bi-mortarboard" color="#6366f1" /></Col>
        <Col md={3}><StatCard label="Teachers" value={stats.totalInstructors} icon="bi-shield-check" color="#ec4899" /></Col>
        <Col md={3}><StatCard label="Courses" value={stats.totalCourses} icon="bi-layers" color="#10b981" trend={24} /></Col>
      </Row>

      <Row className="mb-12 g-8">
        <Col lg={8}>
          <div className="card glass-surface border-0 rounded-xl overflow-hidden shadow-2xl">
            <div className="card-header bg-white-5 p-6 border-bottom border-glass d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
              <div className="d-flex gap-2">
                <button onClick={() => setActiveTab('users')} className={`btn btn-xs fw-bold px-4 py-2.5 transition-all ${activeTab === 'users' ? 'btn-premium' : 'btn-ghost text-muted'}`}>USER LIST</button>
                <button onClick={() => setActiveTab('courses')} className={`btn btn-xs fw-bold px-4 py-2.5 transition-all ${activeTab === 'courses' ? 'btn-premium' : 'btn-ghost text-muted'}`}>COURSE LIST</button>
              </div>
              <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-dim"></i>
                <input type="text" className="form-control bg-white-5 border-glass py-2 ps-10 text-xs text-white" placeholder={`Search ${activeTab}...`} value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="card-body p-0">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="p-6">
                  {activeTab === 'users' ? (
                    filteredUsers.length === 0 ? <EmptyState icon="bi-people" title="No Users Found" /> : (
                      <div className="table-responsive">
                        <table className="table-premium">
                          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                          <tbody>
                            {filteredUsers.map((u) => (
                              <tr key={u._id}>
                                <td><div className="d-flex align-items-center gap-3"><div className="bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32, fontSize: '10px' }}>{u.name.charAt(0)}</div><span className="fw-bold text-white small">{u.name}</span></div></td>
                                <td><span className="text-dim small">{u.email}</span></td>
                                <td><span className={`badge px-3 py-1 rounded-full text-xs text-uppercase tracking-widest ${u.role === 'admin' ? 'bg-danger bg-opacity-20 text-danger' : 'bg-primary bg-opacity-20 text-primary'}`}>{u.role}</span></td>
                                <td><button onClick={() => handleDeleteUser(u._id)} className="btn btn-ghost text-danger p-2 hover-scale"><i className="bi bi-trash"></i></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  ) : (
                    filteredCourses.length === 0 ? <EmptyState icon="bi-layers" title="No Courses Found" /> : (
                      <div className="table-responsive">
                        <table className="table-premium">
                          <thead><tr><th>Title</th><th>Instructor</th><th>Status</th><th>Actions</th></tr></thead>
                          <tbody>
                            {filteredCourses.map((c) => (
                              <tr key={c._id}>
                                <td><span className="fw-bold text-white small">{c.title}</span></td>
                                <td><span className="text-dim small">{c.instructor?.name || 'System'}</span></td>
                                <td><span className="badge bg-success bg-opacity-20 text-success px-3 py-1 rounded-full text-xs text-uppercase">{c.status}</span></td>
                                <td><button onClick={() => handleDeleteCourse(c._id)} className="btn btn-ghost text-danger p-2 hover-scale"><i className="bi bi-trash"></i></button></td>
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
        </Col>

        <Col lg={4}>
          <div className="card glass-surface border-0 rounded-xl overflow-hidden shadow-2xl h-100">
            <div className="card-header bg-white-5 p-6 border-bottom border-glass"><h5 className="mb-0 text-white fw-bold small tracking-widest uppercase">Recent Activity</h5></div>
            <div className="card-body p-6">
              {activity.map((act) => (
                <div key={act.id} className="d-flex align-items-start gap-4 mb-6 pb-6 border-bottom border-glass border-opacity-10 last:border-0">
                  <div className={`p-2 rounded-lg bg-opacity-10 ${act.type === 'user' ? 'bg-primary text-primary' : act.type === 'course' ? 'bg-success text-success' : 'bg-warning text-warning'}`}>
                    <i className={`bi ${act.type === 'user' ? 'bi-person' : act.type === 'course' ? 'bi-journal' : 'bi-lightning'}`}></i>
                  </div>
                  <div>
                    <div className="text-white small fw-bold mb-1">{act.message}</div>
                    <div className="text-dim text-xs">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

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
