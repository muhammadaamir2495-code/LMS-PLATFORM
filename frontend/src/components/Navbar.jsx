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
      className={`navbar transition-smooth ${scrolled ? 'py-3 backdrop-blur border-bottom border-glass bg-glass' : 'py-5 bg-transparent'}`}
      style={{ zIndex: 1000 }}
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
          <Nav className="mx-auto gap-4 mt-4 mt-lg-0">
            <Nav.Link href="/#features" className={`text-xs fw-bold px-3 tracking-widest text-uppercase ${location.hash === '#features' ? 'text-primary' : 'text-muted hover-white'}`}>Features</Nav.Link>
            <Nav.Link href="/#how-it-works" className={`text-xs fw-bold px-3 tracking-widest text-uppercase ${location.hash === '#how-it-works' ? 'text-primary' : 'text-muted hover-white'}`}>Process</Nav.Link>
            <Nav.Link href="/#pricing" className={`text-xs fw-bold px-3 tracking-widest text-uppercase ${location.hash === '#pricing' ? 'text-primary' : 'text-muted hover-white'}`}>Pricing</Nav.Link>
            <Nav.Link as={Link} to="/courses" className={`text-xs fw-bold px-3 tracking-widest text-uppercase ${location.pathname === '/courses' || location.pathname.includes('/catalog') ? 'text-primary' : 'text-muted hover-white'}`}>Catalog</Nav.Link>
          </Nav>
          
          <Nav className="align-items-center gap-6 mt-6 mt-lg-0">
            {user ? (
              <div className="d-flex align-items-center gap-6">
                <Link to={getDashboardPath(user.role)} className="text-xs fw-black text-white text-decoration-none px-2 tracking-widest text-uppercase hover-primary transition-smooth">
                  CONSOLE
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost border-glass text-muted text-xs fw-black px-6 py-2 hover-bg-glass">
                  SIGN OUT
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-6">
                <Link to="/login" className="text-xs fw-black text-muted text-decoration-none hover-white px-2 tracking-widest text-uppercase transition-smooth">
                  SIGN IN
                </Link>
                <Link to="/register" className="btn-premium py-2.5 px-8 text-xs fw-black shadow-glow text-decoration-none">
                  JOIN NOW
                </Link>
              </div>
            )}
          </Nav>
 