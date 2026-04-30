import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-app min-vh-100 text-white pb-20">
      {/* Hero Section */}
      <section className="position-relative py-24 py-lg-32 overflow-hidden border-bottom border-glass">
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-grid-white/[0.02] -z-1"></div>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)' }}></div>
        
        <Container className="position-relative z-1 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="d-inline-flex align-items-center bg-primary bg-opacity-10 text-primary px-4 py-1 rounded-full mb-8 fw-bold text-xs tracking-widest text-uppercase border-glass">
              Our Vision
            </div>
            <h1 className="display-2 fw-black text-white mb-8 tracking-tighter">The Future of <br /><span className="text-gradient-premium">Global Learning.</span></h1>
            <p className="text-muted fs-4 mx-auto leading-relaxed" style={{ maxWidth: '720px' }}>
              We are on a mission to make high-quality education accessible, affordable, and professional for every student in the world.
            </p>
          </motion.div>
        </Container>
      </section>

      <Container className="py-24">
        <Row className="align-items-center g-20 mb-24">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="display-4 fw-black text-white mb-8 tracking-tight">Built for the next generation.</h2>
              <p className="text-muted fs-5 leading-relaxed mb-8">
                NexusLMS started with a simple idea: learning should be as smooth and professional as the software we use every day. We've built a platform that combines modern design with powerful tools.
              </p>
              <p className="text-muted fs-5 leading-relaxed mb-0">
                Whether you're looking to start a new career, grow your business, or teach others, our platform gives you everything you need to succeed in the digital age.
              </p>
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-surface p-2 rounded-4xl border-glass shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Students collaborating" 
                className="w-full rounded-3xl opacity-80 h-auto"
                style={{ minHeight: '400px', objectFit: 'cover' }}
              />
            </motion.div>
          </Col>
        </Row>

        {/* Stats Grid */}
        <Row className="g-8">
          {[
            { value: "5M+", label: "ACTIVE LEARNERS", icon: "bi-people" },
            { value: "10K+", label: "EXPERT TEACHERS", icon: "bi-mortarboard" },
            { value: "50K+", label: "PUBLISHED COURSES", icon: "bi-layers" },
            { value: "120+", label: "COUNTRIES", icon: "bi-globe" }
          ].map((stat, idx) => (
            <Col lg={3} md={6} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-surface p-10 rounded-3xl border-glass text-center h-100 hover-translate-y transition-smooth"
              >
                <div className="text-primary fs-1 mb-6">
                  <i className={`bi ${stat.icon}`}></i>
                </div>
                <h3 className="display-5 fw-black text-white mb-2">{stat.value}</h3>
                <p className="text-dim text-xs fw-bold tracking-widest text-uppercase mb-0">{stat.label}</p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      <style dangerouslySetInnerHTML={{ __html: `
        .py-24 { padding: 6rem 0; }
        .py-32 { padding: 8rem 0; }
        .text-gradient-premium { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bg-app { background: var(--bg-dark); }
        .border-glass { border: 1px solid var(--border-glass); }
        .rounded-4xl { border-radius: 2.5rem; }
        .rounded-3xl { border-radius: 2rem; }
        .leading-relaxed { line-height: 1.6; }
        .tracking-tight { letter-spacing: -0.04em; }
        .tracking-tighter { letter-spacing: -0.06em; }
        .hover-translate-y:hover { transform: translateY(-8px); }
        .transition-smooth { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}} />
    </div>
  );
};

export default About;
