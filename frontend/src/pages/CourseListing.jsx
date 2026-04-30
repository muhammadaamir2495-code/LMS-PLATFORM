import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import api from '../services/api';
import EmptyState from '../components/dashboard/EmptyState';

const CourseListing = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, totalItems: 0 });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit: 6,
          sort
        });
        
        if (searchTerm) queryParams.append('search', searchTerm);
        if (category !== 'All') queryParams.append('category', category);

        const response = await api.get(`/courses?${queryParams.toString()}`);
        setCourses(response.data.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } catch (err) {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchTerm, category, sort, page]);

  return (
    <div className="bg-app min-vh-100 py-20 py-lg-32 text-white">
      <Container>
        <header className="mb-16 text-center">
          <div className="d-inline-flex align-items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full mb-6 fw-bold text-xs tracking-wider text-uppercase">
            Learn from the Best
          </div>
          <h1 className="mb-6 display-3 fw-black text-white tracking-tighter" style={{ letterSpacing: '-0.05em' }}>Explore the Library.</h1>
          <p className="text-muted mx-auto fs-5" style={{ maxWidth: '640px' }}>
            Choose from hundreds of professional courses. Learn from industry experts and build your skills effortlessly.
          </p>
        </header>

        {/* Filter Bar - Unified SaaS Style */}
        <div className="glass-surface p-6 mb-16 rounded-2xl shadow-2xl border-glass">
          <Row className="g-6 align-items-center">
            <Col lg={6}>
              <div className="position-relative">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-4 text-dim"></i>
                <Form.Control
                  type="text"
                  placeholder="Search courses..."
                  className="form-control bg-white-5 border-glass py-3 ps-12 text-white text-xs"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                />
              </div>
            </Col>
            <Col md={6} lg={3}>
              <Form.Select 
                className="form-control bg-white-5 border-glass py-3 text-white text-xs" 
                value={category} 
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              >
                <option value="All">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Business">Business</option>
              </Form.Select>
            </Col>
            <Col md={6} lg={3}>
              <Form.Select 
                className="form-control bg-white-5 border-glass py-3 text-white text-xs" 
                value={sort} 
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="latest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </Form.Select>
            </Col>
          </Row>
        </div>

        {loading ? (
          <Row className="g-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Col key={n} md={6} lg={4}><SkeletonCard /></Col>
            ))}
          </Row>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-10">
              <h3 className="mb-0 fw-bold text-white fs-4">
                {pagination.totalItems || courses.length} Courses Found
              </h3>
            </div>
            
            <Row className="g-10">
              <AnimatePresence mode="popLayout">
                {courses.length > 0 ? (
                  courses.map((course, index) => (
                    <Col key={course._id} md={6} lg={4}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                      >
                        <CourseCard course={course} />
                      </motion.div>
                    </Col>
                  ))
                ) : (
                  <Col xs={12}>
                    <EmptyState 
                      icon="bi-search"
                      title="No Results Found"
                      description="We couldn't find any courses matching your search. Try adjusting your filters."
                      actionText="Reset Filters"
                      onAction={() => { setSearchTerm(''); setCategory('All'); }}
                    />
                  </Col>
                )}
              </AnimatePresence>
            </Row>

            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-center mt-20">
                <div className="d-flex gap-3">
                  <button 
                    className="btn btn-ghost border-glass text-white px-8 py-2.5 text-xs fw-bold tracking-widest hover-bg-glass" 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)}
                  >
                    PREVIOUS
                  </button>
                  <button 
                    className="btn btn-ghost border-glass text-white px-8 py-2.5 text-xs fw-bold tracking-widest hover-bg-glass" 
                    disabled={page === pagination.totalPages} 
                    onClick={() => setPage(p => p + 1)}
                  >
                    NEXT
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
        .border-glass { border: 1px solid var(--border-glass); }
        .ps-12 { padding-left: 3rem !important; }
        .g-10 { --bs-gutter-x: 2.5rem; --bs-gutter-y: 2.5rem; }
        .hover-bg-glass:hover { background: rgba(255, 255, 255, 0.08); }
        .rounded-2xl { border-radius: 20px; }
      `}} />
    </div>
  );
};

export default CourseListing;
