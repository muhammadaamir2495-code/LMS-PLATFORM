import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import EmptyState from '../components/dashboard/EmptyState';

import { SkeletonTable, SkeletonStatCard } from '../components/SkeletonLoader';
import ConfirmModal from '../components/ConfirmModal';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalStudents: 0, totalInstructors: 0 });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch] = useState('');
  const [activity, setActivity] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null, type: 'user' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        toast.error('Sync failed');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    const { id, type } = confirmDelete;
    try {
      if (type === 'user') {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } else {
        await api.delete(`/admin/courses/${id}`);
        setCourses(courses.filter(c => c._id !== id));
      }
      toast.success('Record Removed');
    } catch (err) {
      toast.error('Action denied');
    }
  };

  const filteredItems = (activeTab === 'users' ? users : courses).filter(item => {
    const term = search.toLowerCase();
    return activeTab === 'users' 
      ? (item.name.toLowerCase().includes(term) || item.email.toLowerCase().includes(term))
      : item.title.toLowerCase().includes(term);
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <DashboardLayout>
      <header className="mb-12">
        <div className="d-inline-flex align-items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full mb-4 fw-bold text-xs tracking-wider text-uppercase border-glass">SYSTEM ADMINISTRATION</div>
        <h1 className="mb-2 fw-black display-4 text-white">Project Overview</h1>
        <p className="text-muted fs-5">Managed control center for users, courses, and system integrity.</p>
      </header>

      <Row className="mb-12 g-6">
        {loading ? [1,2,3,4].map(n => <Col key={n} md={3}><SkeletonStatCard /></Col>) : (
          <>
            <Col md={3}><StatCard label="Total Users" value={stats.totalUsers} icon="bi-people" /></Col>
            <Col md={3}><StatCard label="Students" value={stats.totalStudents} icon="bi-mortarboard" color="#6366f1" /></Col>
            <Col md={3}><StatCard label="Teachers" value={stats.totalInstructors} icon="bi-shield-check" color="#ec4899" /></Col>
            <Col md={3}><StatCard label="Courses" value={stats.totalCourses} icon="bi-layers" color="#10b981" /></Col>
          </>
        )}
      </Row>

      <Row className="mb-12 g-8">
        <Col lg={8}>
          <div className="card glass-surface border-0 rounded-xl overflow-hidden shadow-2xl">
            <div className="card-header bg-white-5 p-6 border-bottom border-glass d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
              <div className="d-flex gap-2">
                {['users', 'courses'].map(tab => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }} className={`btn btn-xs fw-bold px-4 py-2.5 transition-all ${activeTab === tab ? 'btn-premium' : 'btn-ghost text-muted'}`}>{tab.toUpperCase()} LIST</button>
                ))}
              </div>
              <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-dim"></i>
                <input type="text" className="form-control bg-white-5 border-glass py-2 ps-10 text-xs text-white" placeholder={`Search ${activeTab}...`} value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
              </div>
            </div>

            <div className="card-body p-0 min-vh-50">
              {loading ? <div className="p-6"><SkeletonTable rows={6} /></div> : paginatedItems.length === 0 ? <div className="p-12"><EmptyState icon="bi-search" title="No Results Found" /></div> : (
                <div className="p-6">
                  <div className="table-responsive">
                    <table className="table-premium">
                      <thead>
                        {activeTab === 'users' 
                          ? <tr><th>User Identity</th><th>Email Address</th><th>Permission</th><th>Action</th></tr>
                          : <tr><th>Course Identifier</th><th>Instructor</th><th>Status</th><th>Action</th></tr>
                        }
                      </thead>
                      <tbody>
                        {paginatedItems.map((item) => (
                          <tr key={item._id}>
                            {activeTab === 'users' ? (
                              <>
                                <td><div className="d-flex align-items-center gap-3"><div className="bg-primary bg-opacity-20 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32, fontSize: '10px' }}>{item.name.charAt(0)}</div><span className="fw-bold text-white small">{item.name}</span></div></td>
                                <td><span className="text-dim small">{item.email}</span></td>
                                <td><span className={`badge px-3 py-1 rounded-full text-xs text-uppercase ${item.role === 'admin' ? 'bg-danger bg-opacity-20 text-danger' : 'bg-primary bg-opacity-20 text-primary'}`}>{item.role}</span></td>
                                <td><button aria-label="Delete User" onClick={() => setConfirmDelete({ show: true, id: item._id, type: 'user' })} className="btn btn-ghost text-danger p-2 hover-scale"><i className="bi bi-trash"></i></button></td>
                              </>
                            ) : (
                              <>
                                <td><span className="fw-bold text-white small">{item.title}</span></td>
                                <td><span className="text-dim small">{item.instructor?.name || 'System'}</span></td>
                                <td><span className="badge bg-success bg-opacity-20 text-success px-3 py-1 rounded-full text-xs text-uppercase">{item.status}</span></td>
                                <td><button aria-label="Delete Course" onClick={() => setConfirmDelete({ show: true, id: item._id, type: 'course' })} className="btn btn-ghost text-danger p-2 hover-scale"><i className="bi bi-trash"></i></button></td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center gap-2 mt-8">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button key={i} aria-label={`Go to page ${i + 1}`} onClick={() => setCurrentPage(i + 1)} className={`btn btn-xs fw-bold px-3 py-1.5 transition-all ${currentPage === i + 1 ? 'btn-premium' : 'btn-ghost text-muted border-glass'}`}>{i + 1}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="card glass-surface border-0 rounded-xl overflow-hidden shadow-2xl h-100">
            <div className="card-header bg-white-5 p-6 border-bottom border-glass"><h5 className="mb-0 text-white fw-bold small tracking-widest uppercase d-flex align-items-center gap-2"><i className="bi bi-activity text-primary"></i> Live Activity</h5></div>
            <div className="card-body p-6">
              {loading ? [1,2,3,4].map(n => <div key={n} className="mb-6"><SkeletonStatCard /></div>) : activity?.map((act) => (
                <div key={act.id} className="d-flex align-items-start gap-4 mb-6 pb-6 border-bottom border-glass border-opacity-10 last:border-0">
                  <div className={`p-2.5 rounded-xl bg-opacity-10 ${act.type === 'user' ? 'bg-primary text-primary' : act.type === 'course' ? 'bg-success text-success' : 'bg-warning text-warning'}`}><i className={`bi ${act.type === 'user' ? 'bi-person-plus' : act.type === 'course' ? 'bi-journal-check' : 'bi-lightning-charge'}`}></i></div>
                  <div className="flex-grow-1"><div className="text-white small fw-bold mb-1">{act?.message}</div><div className="text-dim text-xs d-flex align-items-center gap-1"><i className="bi bi-clock"></i> {act?.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      <ConfirmModal 
        show={confirmDelete.show} 
        onHide={() => setConfirmDelete({ ...confirmDelete, show: false })} 
        onConfirm={handleDelete}
        title={`Delete ${confirmDelete.type.charAt(0).toUpperCase() + confirmDelete.type.slice(1)}?`}
        message={`This action will permanently remove this ${confirmDelete.type} from the database.`}
      />

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
