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
        <img 
          src={course.thumbnail && course.thumbnail !== 'no-photo.jpg' 
                ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${import.meta.env.VITE_API_URL}${course.thumbnail}`) 
                : `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} 
          className="w-full h-100 opacity-80 transition-smooth hover-scale" 
          style={{ objectFit: 'cover' }}
          alt={course.title}
        />
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
            {course.instructor?.name || 'Architect'}
          </span>
        </div>
        
        <h4 className="mb-6 flex-grow-1 text-white fw-bold leading-tight" style={{ fontSize: '1.25rem' }}>
          {course.title}
        </h4>
        
        <div className="mt-auto pt-6 border-top border-glass d-flex justify-content-between align-items-center">
          <div className="f