import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';

const Navbar = () => {
  const { user, loading, logout, getDashboardPath } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Hide global Navbar in Dashboards
  const isDashboard = location.pathname.includes('-dashboard');
  if (isDashboard) return null;

  // Hydration guard
  if (loading) return null;

  return (
    <BsNavbar 
      expand="lg" 
      fixed="top" 
      className={`navbar transition-smooth ${scrolled ? 'py-3 backdrop-blur border-bottom border-glass bg-glass' : 'py-4 bg-transparent'}`}
      style={{ zIndex: 10000 }}
    >
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
          <div className="bg-primary text-white rounded-md d-flex align-items-center justify-content-center shadow-glow" style={{ width: 32, height: 32 }}>
            <i className="bi bi-mortarboard-fill fs-5"></i>
          </div>
          <span className="fw-black fs-4 text-white tracking-tightest">NexusLMS</span>
        </BsNavbar.Brand>
        
        <BsNavbar.Toggle aria-controls="navbar-nav" className="border-0 shadow-none">
          <i className="bi bi-list text-white fs-2"></i>
        </BsNavbar.Toggle>
        
        <BsNavbar.Collapse id="navbar-nav">
          <Nav className="mx-auto gap-2 gap-lg-4 mt-4 mt-lg-0 align-items-lg-center">
            <Nav.Link as={Link} to="/about" className={`text-xs fw-bold px-3 tracking-widest text-uppercase ${location.pathname === '/about' ? 'text-primary' : 'text-muted hover-white'}`}>About</Nav.Link>
            <Nav.Link as={Link} to="/courses" className={`text-xs fw-bold px-3 tracking-widest text-uppercase ${location.pathname === '/courses' || location.pathname.includes('/catalog') ? 'text-primary' : 'text-muted hover-white'}`}>Courses</Nav.Link>
            <Nav.Link href="/#pricing" className={`text-xs fw-bold px-3 tracking-widest text-uppercase ${location.hash === '#pricing' ? 'text-primary' : 'text-muted hover-white'}`}>Pricing</Nav.Link>
          </Nav>
          
          <Nav className="align-items-start align-items-lg-center gap-4 gap-lg-6 mt-6 mt-lg-0 flex-column flex-lg-row">
            {user ? (
              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-4 gap-lg-6 w-100 w-lg-auto">
                <Link to={getDashboardPath(user.role)} className="text-xs fw-black text-white text-decoration-none px-2 tracking-widest text-uppercase hover-primary transition-smooth">
                  Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost border-glass text-muted text-xs fw-black px-6 py-2 hover-bg-glass w-100 w-lg-auto">
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-4 gap-lg-6 w-100 w-lg-auto">
                <Link to="/login" className="text-sm fw-black text-white text-decoration-none hover-primary px-2 tracking-widest text-uppercase transition-smooth">
                  Login
                </Link>
                <Link to="/register" className="btn-premium py-2.5 px-8 text-xs fw-black shadow-glow text-decoration-none w-100 w-lg-auto">
                  Get Started
                </Link>
              </div>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-glass { background: var(--bg-glass); }
        .border-glass { border-bottom: 1px solid var(--border-glass) !important; }
        .backdrop-blur { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .hover-white:hover { color: white !important; }
        .hover-primary:hover { color: var(--primary) !important; }
        .shadow-glow { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
        .transition-smooth { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .tracking-tightest { letter-spacing: -0.08em; }
        .hover-bg-glass:hover { background: rgba(255, 255, 255, 0.05); color: white !important; }
      `}} />
    </BsNavbar>
  );
};

export default Navbar;
