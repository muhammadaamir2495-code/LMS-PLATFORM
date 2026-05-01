import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Offcanvas } from 'react-bootstrap';

const SidebarItem = ({ to, icon, label, active }) => (
  <Link to={to} className={`sidebar-item ${active ? 'active' : ''}`}>
    <i className={`bi ${icon}`}></i>
    <span>{label}</span>
    {active && (
      <motion.div 
        layoutId="active-indicator" 
        className="position-absolute end-0 me-2 bg-primary rounded-full" 
        style={{ height: '16px', width: '3px' }} 
      />
    )}
  </Link>
);

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const roleConfigs = {
    admin: [
      { to: '/admin-dashboard', icon: 'bi-grid-1x2', label: 'Platform' },
      { to: '/courses', icon: 'bi-collection', label: 'Courses' },
      { to: '/settings', icon: 'bi-gear', label: 'Settings' }
    ],
    instructor: [
      { to: '/instructor-dashboard', icon: 'bi-columns-gap', label: 'Overview' },
      { to: '/courses', icon: 'bi-journal-plus', label: 'My Courses' },
      { to: '/settings', icon: 'bi-person-gear', label: 'Profile' }
    ],
    student: [
      { to: '/student-dashboard', icon: 'bi-mortarboard', label: 'Courses' },
      { to: '/courses', icon: 'bi-search', label: 'Browse' },
      { to: '/settings', icon: 'bi-person-badge', label: 'Profile' }
    ]
  };

  const menuItems = roleConfigs[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="d-flex flex-column h-100">
      <div className="px-4 mb-10 d-flex align-items-center gap-3">
        <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none text-white">
          <div className="bg-primary text-white rounded-md d-flex align-items-center justify-content-center shadow-lg" style={{ width: 36, height: 36 }}>
            <i className="bi bi-mortarboard-fill fs-5"></i>
          </div>
          <span className="fw-black fs-4 tracking-tighter">NexusLMS</span>
        </Link>
      </div>

      <div className="flex-grow-1 px-2">
        <div className="px-4 mb-4 text-xs fw-bold text-dim text-uppercase tracking-widest">Main Menu</div>
        {menuItems.map((item, idx) => (
          <SidebarItem 
            key={idx} 
            to={item.to} 
            icon={item.icon} 
            label={item.label} 
            active={location.pathname === item.to} 
          />
        ))}
      </div>

      <div className="mt-auto px-2 pb-4">
        <div className="p-4 bg-white-5 rounded-xl border-glass d-flex align-items-center gap-3 mb-4">
          <div className="bg-primary bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: 36, height: 36 }}>
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <div className="fw-bold text-xs text-truncate">{user.name}</div>
            <div className="text-dim text-uppercase fw-bold" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>{user.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-item w-full bg-transparent border-0 text-danger hover-bg-danger-soft">
          <i className="bi bi-box-arrow-left"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="d-flex min-vh-100 bg-app">
      {/* Desktop Sidebar */}
      <aside className="sidebar-v2 d-none d-lg-flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Offcanvas show={mobileOpen} onHide={() => setMobileOpen(false)} className="bg-app text-white border-glass" style={{ width: '280px' }}>
        <Offcanvas.Body className="p-4 overflow-hidden">
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Framework */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100">
        {/* Header */}
        <header className="glass-surface sticky-top p-4 d-flex align-items-center justify-content-between gap-8" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', zIndex: 900 }}>
          <div className="d-flex align-items-center gap-4 flex-grow-1">
            <button className="d-lg-none btn btn-ghost text-white p-0 border-0" onClick={() => setMobileOpen(true)}>
              <i className="bi bi-list fs-3"></i>
            </button>
            <div className="position-relative d-none d-md-block" style={{ maxWidth: '400px', width: '100%' }}>
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-dim"></i>
              <input 
                type="text" 
                className="form-control bg-white-5 border-glass py-2 ps-10 text-xs text-white" 
                placeholder="Search for courses..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/courses?search=${e.target.value}`);
                  }
                }}
              />
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-6">
            <div className="d-flex align-items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success shadow-success"></div>
              <span className="text-xs fw-bold text-success tracking-widest text-uppercase">System Active</span>
            </div>
            <div className="v-divider"></div>
            <button className="btn btn-ghost text-white p-0 position-relative border-0">
              <i className="bi bi-bell fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-primary border border-2 border-app rounded-circle"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Surface */}
        <main className="dashboard-content flex-grow-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-app { background-color: var(--bg-dark); }
        .shadow-success { box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
        .v-divider { width: 1px; height: 24px; background: var(--border-glass); }
        .ps-10 { padding-left: 2.5rem !important; }
        .hover-bg-danger-soft:hover { background: rgba(239, 68, 68, 0.1) !important; color: #ef4444 !important; }
        .w-full { width: 100%; }
      `}} />
    </div>
  );
};

export default DashboardLayout;
