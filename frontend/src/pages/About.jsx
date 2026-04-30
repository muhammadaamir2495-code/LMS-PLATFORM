import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <div className="bg-light min-vh-100 fade-in-up">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5 position-relative" style={{ overflow: 'hidden' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
        <Container className="position-relative z-index-1 py-5 text-center">
          <h1 className="display-4 fw-bolder mb-3">Our Mission</h1>
          <p className="lead text-white-50 max-w-md mx-auto">
            Democratizing education by providing a world-class learning platform accessible to everyone, everywhere.
          </p>
        </Container>
      </div>

      <Container className="pb-5">
        <Row className="align-items-center mb-5 pb-4">
          <Col lg={6} className="mb-4 mb-lg-0 pe-lg-5">
            <h2 className="fw-bold mb-4">Empowering the future</h2>
            <p className="text-muted fs-5" style={{ lineHeight: '1.8' }}>
              Founded in 2026, NexusLMS has grown from a small startup to a global community of learners and educators. We believe that access to high-quality education is a fundamental human right, not a privilege.
            </p>
            <p className="text-muted fs-5 mb-0" style={{ lineHeight: '1.8' }}>
              Whether you're looking to advance your career, explore a new hobby, or completely change your professional path, our platform provides the tools, instructors, and resources you need to succeed.
            </p>
          </Col>
          <Col lg={6}>
            <div className="position-relative">
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary rounded-4 transform-shift-right opacity-10" style={{ transform: 'translate(20px, 20px)' }}></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Students collaborating" 
                className="img-fluid rounded-4 shadow-lg position-relative"
              />
            </div>
          </Col>
        </Row>

        {/* Stats */}
        <Row className="g-4 mb-5 pb-5">
          {[
            { value: "5M+", label: "Active Learners" },
            { value: "10K+", label: "Expert Instructors" },
            { value: "50K+", label: "Published Courses" },
            { value: "120+", label: "Countries Reached" }
          ].map((stat, idx) => (
            <Col md={3} sm={6} key={idx}>
              <Card className="text-center border-0 shadow-sm rounded-4 h-100 py-4 hover-lift">
                <Card.Body>
                  <h2 className="display-5 fw-bolder text-primary mb-2">{stat.value}</h2>
                  <p className="text-muted fw-medium mb-0 text-uppercase tracking-wider small">{stat.label}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default About;
