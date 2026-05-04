import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Modal, Form } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import EmptyState from '../components/dashboard/EmptyState';
import { SkeletonCard, SkeletonStatCard } from '../components/SkeletonLoader';
import ConfirmModal from '../components/ConfirmModal';

const InstructorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', category: 'Web Development', thumbnail: null });
  const [showStudents, setShowStudents] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

  const categories = ['Web Development', 'UI/UX Design', 'Data Science', 'Digital Marketing', 'Business'];

  const fetchCourses = async () => {
    try {
      const response = await api.get('/instructor/courses');
      setCourses(response.data.data);
    } catch (err) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleViewStudents = async (courseId) => {
    setAnalyticsLoading(true);
    setShowStudents(true);
    try {
      const res = await api.get(`/instructor/courses/${courseId}/students`);
      setEnrolledStudents(res.data.data);
    } catch (err) {
      toast.error('Could not fetch student list');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleShow = (mode = 'create', course = null) => {
    setModalMode(mode);
    if (mode === 'edit' && course) {
      setCurrentCourse(course);
      setFormData({ title: course.title, description: course.description, price: course.price, category: course.category, thumbnail: null });
    } else {
      setFormData({ title: '', description: '', price: '', category: 'Web Development', thumbnail: null });
    }
    setShow(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => { if (formData[key]) data.append(key, formData[key]); });

    try {
      if (modalMode === 'create') await api.post('/courses', data);
      else await api.put(`/courses/${currentCourse._id}`, data);
      toast.success('Course Saved');
      setShow(false);
      fetchCourses();
    } catch (err) {
      toast.error('Error saving course');
    } finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/courses/${confirmDelete.id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (err) {
      toast.error('Error deleting course');
    }
  };

  const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrollmentsCount || 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + ((c.enrollmentsCount || 0) * (c.price || 0)), 0);
  const maxEnrollments = Math.max(...courses.map(c => c.enrollmentsCount || 1), 1);

  return (
    <DashboardLayout>
      <header className="mb-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
        <div>
          <div className="d-inline-flex align-items-center bg-secondary bg-opacity-10 text-secondary px-3 py-1 rounded-full mb-4 fw-bold text-xs tracking-wider text-uppercase border-glass">INSTRUCTOR HUB</div>
          <h1 className="mb-2 fw-black display-4 text-white">Project Management</h1>
          <p className="text-muted fs-5">Develop and monitor your educational content and student growth.</p>
        </div>
        <button className="btn-premium px-8 py-3" onClick={() => handleShow('create')}><i className="bi bi-plus-lg me-2"></i> CREATE NEW COURSE</button>
      </header>

      <Row className="mb-16 g-6">
        {loading ? [1,2,3].map(n => <Col key={n} md={4}><SkeletonStatCard /></Col>) : (
          <>
            <Col md={4}><StatCard label="My Courses" value={courses.length} icon="bi-layers" /></Col>
            <Col md={4}><StatCard label="Total Students" value={totalEnrollments} icon="bi-people" color="#ec4899" /></Col>
            <Col md={4}><StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon="bi-currency-dollar" color="#10b981" /></Col>
          </>
        )}
      </Row>

      <Row className="mb-16 g-8">
        <Col lg={8}>
          <section>
            <div className="d-flex align-items-center justify-content-between mb-8"><h3 className="mb-0 text-white fw-bold">Published Modules</h3></div>
            {loading ? <Row className="g-8">{[1, 2].map((n) => ( <Col key={n} md={6}><SkeletonCard /></Col> ))}</Row> : courses.length === 0 ? <EmptyState icon="bi-pencil" title="No Courses Found" /> : (
              <Row className="g-8">
                {courses.map((course, idx) => (
                  <Col key={course._id} md={6}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="card stat-card-premium h-100 border-0 d-flex flex-column p-0 overflow-hidden shadow-2xl">
                      <div className="position-relative" style={{ height: '140px' }}>
                        <div className="w-full h-100 bg-gradient-to-br from-slate-800 to-slate-900 d-flex align-items-center justify-content-center"><i className="bi bi-layers text-white-5 fs-2"></i></div>
                        <div className="position-absolute top-0 end-0 m-4"><span className={`badge ${course.status === 'published' ? 'bg-success' : 'bg-warning'} bg-opacity-20 backdrop-blur border border-white border-opacity-10 px-3 py-1.5 text-xs text-uppercase fw-bold`}>{course.status}</span></div>
                      </div>
                      <div className="card-body p-6 flex-grow-1 d-flex flex-column">
                        <div className="text-dim text-xs fw-bold text-uppercase tracking-widest mb-3">{course.category}</div>
                        <h5 className="mb-6 fw-bold text-white small leading-tight">{course.title}</h5>
                        <div className="d-flex justify-content-between align-items-center mb-6 text-xs text-dim"><span>Students:</span><span className="text-white fw-bold">{course.enrollmentsCount || 0}</span></div>
                        <div className="mt-auto pt-6 border-glass d-flex gap-2">
                          <button aria-label="View Course Analytics" className="btn btn-ghost border-glass text-white text-xs fw-bold w-full py-2.5" onClick={() => handleViewStudents(course._id)}>ANALYTICS</button>
                          <button aria-label="Edit Course" className="btn btn-ghost border-glass text-white text-xs fw-bold w-full py-2.5" onClick={() => handleShow('edit', course)}>EDIT</button>
                          <button aria-label="Delete Course" className="btn btn-ghost py-2.5 text-danger border-glass px-4" onClick={() => setConfirmDelete({ show: true, id: course._id })}><i className="bi bi-trash"></i></button>
                        </div>
                      </div>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </section>
        </Col>

        <Col lg={4}>
          <div className="card glass-surface border-0 rounded-2xl overflow-hidden shadow-2xl h-100">
            <div className="card-header bg-white-5 p-6 border-bottom border-glass"><h5 className="mb-0 text-white fw-bold small tracking-widest uppercase d-flex align-items-center gap-2"><i className="bi bi-bar-chart text-secondary"></i> Distribution</h5></div>
            <div className="card-body p-6">
              {loading ? [1,2,3].map(n => <div key={n} className="mb-6"><SkeletonStatCard /></div>) : courses.map(c => (
                <div key={c._id} className="mb-8">
                  <div className="d-flex justify-content-between mb-2 text-xs fw-bold">
                    <span className="text-white truncate" style={{ maxWidth: '70%' }}>{c.title}</span>
                    <span className="text-dim">{c.enrollmentsCount || 0}</span>
                  </div>
                  <div className="progress bg-white-5" style={{ height: '6px', borderRadius: '10px' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${((c.enrollmentsCount || 0) / maxEnrollments) * 100}%` }} className="progress-bar bg-secondary" style={{ borderRadius: '10px' }}></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      <ConfirmModal 
        show={confirmDelete.show} 
        onHide={() => setConfirmDelete({ show: false, id: null })} 
        onConfirm={handleDelete}
        title="Delete Module?"
        message="This will permanently remove the course and all associated student data."
      />

      <Modal show={showStudents} onHide={() => setShowStudents(false)} centered size="lg" className="premium-modal">
        <Modal.Header closeButton className="border-0 px-8 pt-8 bg-app text-white">
          <Modal.Title className="fw-black text-white text-xs tracking-widest uppercase">Performance Tracking</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-8 py-6 bg-app">
          {analyticsLoading ? <div className="text-center py-12"><div className="spinner-border text-primary"></div></div> : enrolledStudents.length === 0 ? <EmptyState icon="bi-people" title="No Students Yet" /> : (
            <div className="table-responsive">
              <table className="table-premium">
                <thead><tr><th>Student</th><th>Email</th><th>Progress</th><th>Join Date</th></tr></thead>
                <tbody>
                  {enrolledStudents.map((e) => (
                    <tr key={e._id}>
                      <td className="text-white small fw-bold">{e.student?.name}</td>
                      <td className="text-dim small">{e.student?.email}</td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="progress bg-white-5 flex-grow-1" style={{ height: '4px', width: '60px' }}><div className="progress-bar bg-primary" style={{ width: `${e.progress}%` }}></div></div>
                          <span className="text-xs fw-bold text-white">{e.progress}%</span>
                        </div>
                      </td>
                      <td className="text-dim small">{new Date(e.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={() => setShow(false)} centered size="lg" className="premium-modal">
        <Modal.Header closeButton className="border-0 px-8 pt-8 bg-app text-white">
          <Modal.Title className="fw-black text-white">{modalMode === 'create' ? 'CREATE NEW COURSE' : 'EDIT COURSE'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-8 py-8 bg-app">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-6">
              <Form.Label className="text-dim text-xs fw-bold tracking-widest uppercase mb-3">Course Title</Form.Label>
              <Form.Control type="text" name="title" className="form-control-premium" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Master React in 30 Days" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-6">
                  <Form.Label className="text-dim text-xs fw-bold tracking-widest uppercase mb-3">Category</Form.Label>
                  <Form.Select name="category" className="form-control-premium" value={formData.category} onChange={handleInputChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-6">
                  <Form.Label className="text-dim text-xs fw-bold tracking-widest uppercase mb-3">Price ($)</Form.Label>
                  <Form.Control type="number" name="price" className="form-control-premium" value={formData.price} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-8">
              <Form.Label className="text-dim text-xs fw-bold tracking-widest uppercase mb-3">Description</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" className="form-control-premium" value={formData.description} onChange={handleInputChange} required />
            </Form.Group>
            <button type="submit" className="btn-premium w-full py-4 rounded-xl shadow-2xl fw-bold text-xs tracking-widest" disabled={formLoading}>
              {formLoading ? 'PROCESSING...' : modalMode === 'create' ? 'PUBLISH COURSE' : 'UPDATE COURSE'}
            </button>
          </Form>
        </Modal.Body>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .form-control-premium { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 12px 16px; border-radius: 12px; font-size: 14px; }
        .form-control-premium:focus { background: rgba(255,255,255,0.08); border-color: var(--primary-color); box-shadow: none; color: white; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}} />
    </DashboardLayout>
  );
};

export default InstructorDashboard;
