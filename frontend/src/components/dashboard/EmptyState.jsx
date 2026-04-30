import React from 'react';
import { motion } from 'framer-motion';

/**
 * UNIFIED EMPTY STATE COMPONENT
 * Used across dashboards when no data is returned from the API.
 */
const EmptyState = ({ icon, title, description, actionText, onAction }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="card stat-card-premium text-center py-20 py-lg-28 glass-surface rounded-xl border-dashed"
  >
    <div 
      className="bg-white-5 rounded-circle d-inline-flex align-items-center justify-content-center mb-6 shadow-2xl" 
      style={{ width: 84, height: 84 }}
    >
      <i className={`bi ${icon} text-muted fs-1`}></i>
    </div>
    
    <h3 className="mb-3 text-white fw-bold">{title}</h3>
    
    <p className="text-muted mb-8 mx-auto px-4" style={{ maxWidth: '400px' }}>
      {description}
    </p>
    
    {actionText && onAction && (
      <button 
        onClick={onAction}
        className="btn-premium px-10 py-3 text-xs fw-bold tracking-widest text-uppercase"
      >
        {actionText}
      </button>
    )}

    <style dangerouslySetInnerHTML={{ __html: `
      .border-dashed { 
        border: 2px dashed rgba(255, 255, 255, 0.1) !important; 
        background: rgba(255, 255, 255, 0.01) !important; 
      }
    `}} />
  </motion.div>
);

export default EmptyState;
