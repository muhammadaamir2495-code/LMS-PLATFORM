import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-app overflow-hidden">
      <div className="position-absolute w-100 h-100 opacity-20" style={{ background: 'radial-gradient(circle at center, var(--primary-color) 0%, transparent 70%)', filter: 'blur(100px)' }}></div>
      <div className="text-center position-relative z-1 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="display-1 fw-black text-white mb-0" style={{ fontSize: '12rem', letterSpacing: '-0.1em', opacity: 0.1 }}>404</h1>
          <div className="mt-n16">
            <h2 className="text-white fw-black display-4 mb-4">You've reached<br/>the edge of space.</h2>
            <p className="text-muted fs-5 mb-10 mx-auto" style={{ maxWidth: '400px' }}>
              The module you are looking for has been moved or doesn't exist in our current curriculum.
            </p>
            <Link to="/" className="btn-premium px-10 py-3.5 rounded-xl shadow-glow text-decoration-none d-inline-block fw-bold tracking-widest text-xs">
              TAKE ME HOME
            </Link>
          </div>
        </motion.div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .mt-n16 { margin-top: -6rem !important; }
        .shadow-glow { box-shadow: 0 0 30px rgba(99, 102, 241, 0.4); }
      `}} />
    </div>
  );
};

export default NotFound;
