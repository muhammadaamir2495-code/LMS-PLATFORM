import React from 'react';
import { motion } from 'framer-motion';

/**
 * PRODUCTION-GRADE STAT CARD
 * Shared across all dashboards for visual consistency.
 */
const StatCard = ({ label, value, icon, trend, subLabel, color = "var(--primary)" }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="stat-card-premium h-100 overflow-hidden"
  >
    <div className="d-flex justify-content-between align-items-start mb-6">
      <div 
        className="rounded-lg d-flex align-items-center justify-content-center shadow-sm" 
        style={{ 
          width: 44, 
          height: 44, 
          backgroundColor: `${color}1A`, // 10% opacity
          color: color 
        }}
      >
        <i className={`bi ${icon} fs-4`}></i>
      </div>
      {trend !== undefined && (
        <div className={`px-2 py-1 rounded-full text-xs fw-bold ${trend > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
    
    <div className="text-muted text-xs fw-bold text-uppercase tracking-widest mb-2">
      {label}
    </div>
    
    <div className="display-6 fw-black mb-2 text-white">
      {value}
    </div>
    
    {subLabel && (
      <div className="text-dim text-xs fw-medium mt-1">
        {subLabel}
      </div>
    )}

    {/* Subtle Background Decoration */}
    <div className="position-absolute bottom-0 start-0 w-100 opacity-10" style={{ height: '32px' }}>
      <svg width="100%" height="32" viewBox="0 0 100 32" preserveAspectRatio="none">
        <path 
          d="M0 32C20 28 40 36 60 24C80 12 100 16 100 16V32H0Z" 
          fill={color} 
        />
      </svg>
    </div>
  </motion.div>
);

export default StatCard;
