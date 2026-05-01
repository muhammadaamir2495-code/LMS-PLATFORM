import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CourseCard = ({ course }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="card h-100 d-flex flex-column border-0 glass-surface overflow-hidden shadow-2xl" 
      style={{ borderRadius: '24px' }}
    >
      <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
        <div className="w-full h-100 bg-gradient-to-br from-indigo-900 to-purple-900 d-flex align-items-center justify-content-center" style={{ minHeight: '200px' }}>
          <i className="bi bi-journal-code text-white-10 fs-1"></i>
        </div>
        <div className="position-absolute top-0 start-0 m-4">
          <span className="badge bg-primary bg-opacity-20 backdrop-blur border border-primary border-opacity-20 px-3 py-2 text-xs fw-bold tracking-widest text-uppercase">
            {course.category}
          </span>
        </div>
      </div>

      <div className="card-body p-6 d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="bg-white-5 rounded-circle d-flex align-items-center justify-content-center text-dim" style={{ width: 28, height: 28 }}>
            <i className="bi bi-person text-xs"></i>
          </div>
          <span className="text-dim text-xs fw-bold text-uppercase tracking-widest">
            {course.instructor?.name || 'Instructor'}
          </span>
        </div>
        
        <h4 className="mb-6 flex-grow-1 text-white fw-bold leading-tight" style={{ fontSize: '1.25rem' }}>
          {course.title}
        </h4>
        
        <div className="mt-auto pt-6 border-top border-glass d-flex justify-content-between align-items-center">
          <div className="fw-black text-white fs-4">
            ${course.price}
          </div>
          <Link to={`/courses/${course._id}`} className="btn-premium py-2 px-6 text-xs fw-bold tracking-widest text-decoration-none">
            View Course
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .leading-tight { line-height: 1.25; }
        .hover-scale:hover { transform: scale(1.1); }
        .transition-smooth { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
      `}} />
    </motion.div>
  );
};

export default CourseCard;
