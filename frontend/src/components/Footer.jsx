import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  // Hide global Footer in Dashboards
  const isDashboard = location.pathname.includes('-dashboard');
  if (isDashboard) return null;

  return (
    <footer className="bg-app text-white pt-20 pb-12 border-top border-glass">
      <Container>
        <Row className="gy-10 mb-16">
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center mb-8">
              <div className="bg-primary text-white rounded-md d-flex align-items-center justify-content-center me-3 shadow-glow" style={{ width: 36, height: 36 }}>
                <i className="bi bi-mortarboard-fill fs-5"></i>
              </div>
              <h4 className="fw-black mb-0 tracking-tightest">NexusLMS</h4>
            </div>
            <p className="text-dim pe-lg-5 fs-6 leading-relaxed">
              Engineering the future of digital education with a focus on speed, design, and results. Built for the modern architect.
            </p>
            <div className="d-flex gap-6 mt-8">
              <a href="#" className="text-dim text-decoration-none hover-white transition-smooth"><i className="bi bi-twitter fs-5"></i></a>
              <a href="#" className="text-dim text-decoration-none hover-white transition-smooth"><i className="bi bi-github fs-5"></i></a>
              <a href="https://www.linkedin.com/in/muhammad-aamir-7b901739b/" target="_blank" rel="noopener noreferrer" className="text-dim text-decoration-none hover-white transition-smooth"><i className="bi bi-linkedin fs-5"></i></a>
            </div>
          </Col>
          <Col lg={2} md={6}>
            <h6 className="fw-black mb-6 text-uppercase tracking-widest text-white text-xs">Product</h6>
            <ul className="list-unstyled d-flex flex-column gap-4">
              <li><Link to="/" className="text-dim text-xs fw-bold tracking-wide text-decoration-none hover-white transition-smooth">HOME</Link></li>
              <li><Link to="/courses" className="text-dim text-xs fw-bold tracking-wide text-decoration-none hover-white transition-smooth">CATALOG</Link></li>
              <li><Link to="/pricing" className="text-dim text-xs fw-bold tracking-wide text-decoration-none hover-white transition-smooth">VALUATION</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h6 className="fw-black mb-6 text-uppercase tracking-widest text-white text-xs">Categories</h6>
            <ul className="list-unstyled d-flex flex-column gap-4">
              <li><Link to="/courses" className="text-dim text-xs fw-bold tracking-wide text-decoration-none hover-white transition-smooth">WEB DEVELOPMENT</Link></li>
              <li><Link to="/courses" className="text-dim text-xs fw-bold tracking-wide text-decoration-none hover-white transition-smooth">DATA SCIENCE</Link></li>
              <li><Link to="/courses" className="text-dim text-xs fw-bold tracking-wide text-decoration-none hover-white transition-smooth">UI/UX DESIGN</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h6 className="fw-black mb-6 text-uppercase tracking-widest text-white text-xs">Intelligence Node</h6>
            <ul className="list-unstyled d-flex flex-column gap-5 text-dim">
              <li className="d-flex align-items-center gap-4 text-xs fw-bold tracking-wide">
                <i className="bi bi-envelope-fill text-primary"></i>
                <span>muhammadaamir2495@gmail.com</span>
              </li>
              <li className="d-flex align-items-center gap-4 text-xs fw-bold tracking-wide">
                <i className="bi bi-telephone-fill text-primary"></i>
                <span>+92 343 6448495</span>
              </li>
            </ul>
          </Col>
        </Row>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-8 border-top border-glass">
          <small className="text-dim fw-medium mb-4 mb-md-0 tracking-wide">&copy; {new Date().getFullYear()} NexusLMS Inc. All rights reserved. Built for scale.</small>
          <div className="d-flex gap-8">
            <small><Link to="#" className="text-dim text-xs fw-bold tracking-wide text-decoration-none hover-white transition-smooth">PRIVACY</Link></small>
            <small><Link to="#" className="text-dim text-xs fw-bold tracking-wide text-decoration-none hover-white transition-smooth">TERMS</Link></s