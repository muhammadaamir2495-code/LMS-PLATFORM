import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Modal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { SkeletonCard } from '../components/SkeletonLoader';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import EmptyState from '../components/dashboard/EmptyState';

const InstructorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', category: 'Web Development', thumbnail: null });

  const categories = ['Web Development', 'UI/UX Design', 'Data Science', 'Digital Marketing', 'Business'];

  const fetchCourses = async () => {
    try {
      const response = await api.get(`/courses?instructor=${user.id}`);
      setCourses(response.data.data);
    } catch (err) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

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
      toast.success('Sync Successful');
      setShow(false);
      fetchCourses();
    } catch (err) {
      toast.error('Operation Error');
    } finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirm Deletion Sequence?')) {
      try { await api.delete(`/courses/${id}`); toast.success('Module Removed'); fetchCourses(); }
      catch (err) { toast.error('Access Denied'); }
    }
  };

  const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrollmentsCount || 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + ((c.enrollmentsCount || 0) * (c.price || 0)), 0);

  return (
    <DashboardLayout>
      <header className="mb-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
        <div>
          <div className="d-inline-flex align-items-center bg-secondary bg-opacity-10 text-secondary px-3 py-1 rounded-full mb-4 fw-bold text-xs tracking-wider text-uppercase">
            Instructor Node • Authoritative Access
          </div>
          <h1 className="mb-2 fw-black display-4 text-white">Architect Terminal</h1>
          <p className="text-muted fs-5">Manage your modules and track global student ingestion.</p>
        </div>
        <button className="btn-premium px-8" onClick={() => handleShow('create')}>
          <i className="bi bi-plus-lg me-2"></i> INITIALIZE MODULE
        </button>
      </header>

      <Row className="mb-12 g-6">
        <Col md={4}>
          <StatCard 
            label="Published Modules" 
            value={courses.length} 
            icon="bi-layers" 
            subLabel="Total assets in catalog"
          />
        </Col>
        <Col md={4}>
          <StatCard 
            label="Total Ingestion" 
            value={totalEnrollments} 
            icon="bi-people" 
            color="#ec4899"
            subLabel="Total student enrollments"
          />
        </Col>
        <Col md={4}>
          <StatCard 
            label="Revenue Projection" 
            value={`$${totalRevenue.toLocaleString()}`} 
            icon="bi-currency-dollar" 
            color="#10b981"
            trend={12}
            subLabel="Estimated earnings (Gross)"
          />
        </Col>
      </Row>

      <section>
        <div className="d-flex align-items-center justify-content-between mb-8">
          <h3 className="mb-0 text-white fw-bold">Active Catalog</h3>
        </div>

        {loading ? (
          <Row className="g-8">
            {[1, 2, 3].map((n) => ( <Col key={n} md={6} lg={4}><SkeletonCard /></Col> ))}
          </Row>
        ) : courses.length === 0 ? (
          <EmptyState 
            icon="bi-pencil-square"
            title="Empty Repository"
            description="No active modules detected in your local authoring node. Start by creating your first educational sequence."
            actionText="Launch First Sequence"
            onAction={() => handleShow('create')}
          />
        ) : (
          <Row className="g-8">
            {courses.map((course, idx) => (
              <Col key={course._id} md={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card stat-card-premium h-100 border-0 d-flex flex-column"
                >
                  <div className="position-relative overflow-hidden rounded-t-xl" style={{ height: '180px' }}>
                    <img 
                      src={course.thumbnail && course.thumbnail !== 'no-photo.jpg' ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${import.meta.env.VITE_API_URL}${course.thumbnail}`) : `https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80`} 
                      className="w-full h-100 object-fit-cover opacity-60" alt={course.title} 
                    />
                    <div className="position-absolute top-0 end-0 m-4">
                      <span className={`badge ${course.status === 'published' ? 'bg-success' : 'bg-warning'} bg-opacity-20 backdrop-blur border border-white border-opacity-10 px-3 py-2 text-xs text-uppercase fw-bold`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                  <div className="card-body p-6 flex-grow-1 d-flex flex-column">
                    <div className="text-dim text-xs fw-bold text-uppercase tracking-widest mb-3">{course.category}</div>
                    <h5 className="mb-8 fw-bold text-white fs-5 leading-tight">{course.title}</h5>
                    <div className="mt-auto pt-6 border-glass d-flex gap-2">
                      <button className="btn btn-ghost border-glass text-white text-xs fw-bold w-full py-2.5" onClick={() => handleShow('edit', course)}>RECONFIGURE</button>
                      <button className="btn btn-ghost py-2.5 text-danger border-glass px-4" onClick={() => handleDelete(course._id)}><i className="bi bi-trash"></i></button>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </section>

      <Modal show={show} onHide={() => setShow(false)} centered size="lg" className="premium-modal">
        <Modal.Header closeButton className="border-0 px-8 pt-8 bg-app text-white">
          <Modal.Title className="fw-black text-white">{modalMode === 'create' ? 'INITIALIZE NEW SEQUENCE' : 'RECONFIGURE MODULE'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit} className="bg-app text-white">
          <Modal.Body className="px-8 py-4">
            <Row className="g-6">
              <Col md={7}>
                <Form.Group className="mb-6">
                  <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Identity Designation</Form.Label>
                  <Form.Control className="form-control bg-white-5 border-glass text-white py-2.5" type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                </Form.Group>
                <div className="d-flex gap-6 mb-6">
                  <Form.Group className="flex-grow-1">
                    <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Valuation ($)</Form.Label>
                    <Form.Control className="form-control bg-white-5 border-glass text-white py-2.5" type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                  </Form.Group>
                  <Form.Group className="flex-grow-1">
                    <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Category Node</Form.Label>
                    <Form.Select className="form-control bg-white-5 border-glass text-white py-2.5" name="category" value={formData.category} onChange={handleInputChange}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </Form.Select>
                  </Form.Group>
                </div>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-0">
                  <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Visual Asset</Form.Label>
                  <div className="border border-dashed border-glass rounded-xl p-8 text-center bg-white-5 cursor-pointer hover-bg-glass transition-all" onClick={() => document.getElementById('file-up').click()}>
                    <i className="bi bi-cloud-arrow-up fs-1 text-primary"></i>
                    <p className="text-xs text-dim mb-0 mt-3 fw-bold tracking-widest text-uppercase">Upload Thumbnail</p>
                    <input id="file-up" type="file" name="thumbnail" onChange={handleInputChange} hidden />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mt-6">
              <Form.Label className="text-xs fw-bold text-uppercase text-dim mb-2 tracking-widest">Module Documentation</Form.Label>
              <Form.Control className="form-control bg-white-5 border-glass text-white" as="textarea" rows={4} name="description" value={formData.description} onChange={handleInputChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 px-8 pb-8 pt-4 bg-app">
            <button type="button" className="btn btn-ghost text-dim fw-bold text-xs tracking-widest" onClick={() => setShow(false)}>ABORT</button>
            <button type="submit" className="btn-premium px-12 py-2.5 text-xs fw-bold" disabled={formLoading}>{formLoading ? 'SYNCHRONIZING...' : 'SAVE SEQUENCE'}</button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
        .border-glass { border: 1px solid var(--border-glass); }
        .premium-modal .modal-content { background: var(--bg-app); border: 1px solid var(--border-glass); border-radius: var(--radius-xl); overflow: hidden; }
        .hover-bg-glass:hover { background: rgba(255, 255, 255, 0.08); }
        .rounded-t-xl { border-top-left-radius: 1rem; border-top-right-radius: 1rem; }
        .leading-tight { line-height: 1.25; }
      `}} />
    </DashboardLayout>
  );
};

export default InstructorDashboard;
