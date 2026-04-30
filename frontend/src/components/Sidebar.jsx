import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ onClick }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  const links = [];

  if (user.role === 'student') {
    links.push({ path: '/student-dashboard', icon: 'bi-grid-1x2', label: 'My Learning' });
    links.push({ path: '/courses', icon: 'bi-search', label: 'Explore Courses' });
  } else if (user.role === 'instructor') {
    links.push({ path: '/instructor-dashboard', icon: 'bi-layout-text-sidebar-reverse', label: 'Dashboard' });
    links.push({ path: '/courses', icon: 'bi-book', label: 'All Courses' });
  } else if (user.role === 'admin') {
    links.push({ path: '/admin-dashboard', icon: 'bi-speedometer2', label: 'Platform Overview' });
    links.push({ path: '/courses', icon: 'bi-collection', label: 'Manage Courses' });
  }

  return (
    <div className="sidebar">
      <div className="p-8 pb-10">
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <div className="bg-primary text-white rounded-md d-flex align-items-center justify-content-center" style={{ width: 28, height: 28 }}>
            <i className="bi bi-mortarboard-fill small"></i>
          </div>
          <span className="fw-bold tracking-tight text-gray-900" style={{ fontSize: '18px' }}>NexusLMS</span>
        </Link>
      </div>
      
      <div className="px-6 mb-4 small fw-bold text-uppercase tracking-widest text-muted" style={{ fontSize: '10px', opacity: 0.5 }}>
        Management
      </div>

      <Nav className="flex-column flex-grow-1 px-3">
        {links.map((link) => (
          <Nav.Link 
            key={link.path}
            as={Link} 
            to={link.path} 
            onClick={onClick}
            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            <i className={`bi ${link.icon} fs-6`}></i>
            <span>{link.label}</span>
          </Nav.Link>
        ))}
      </Nav>
      
      <div className="mt-auto p-6 border-top">
        <div className="d-flex align-items-center bg-gray-50 bg-opacity-50 p-3 rounded-xl border">
          <div className="bg-white border rounded-circle d-flex align-items-center justify-content-center text-gray-400" style={{width: 32, height: 32}}>
            <i className="bi bi-person small"></i>
          </div>
          <div className="ms-3 overflow-hidden">
            <div className="fw-bold text-gray-900 text-xs text-truncate">{user.name}</div>
            <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
