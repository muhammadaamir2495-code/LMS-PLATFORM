import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-app overflow-hidden text-white">
      {/* 1. HERO SECTION - Premium Dark SaaS Style */}
      <section className="pt-32 pb-20 pt-lg-48 pb-lg-32 overflow-hidden position-relative">
        {/* Background Gradients */}
        <div className="position-absolute top-0 start-50 translate-middle-x w-100 h-100" style={{ background: 'radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', zIndex: 0 }}></div>
        <div className="position-absolute bottom-0 end-0 w-50 h-50 blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)', zIndex: 0 }}></div>
        
        {/* Neural Pulse SVG Animation */}
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-20 pointer-events-none" style={{ zIndex: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="pulse-line" d="M-100 200C100 250 300 150 500 200C700 250 900 150 1100 200C1300 250 1500 150 1700 200" stroke="var(--primary)" strokeWidth="1" strokeDasharray="5 5" />
            <path className="pulse-line-delayed" d="M-100 400C100 350 300 450 500 400C700 350 900 450 1100 400C1300 350 1500 450 1700 400" stroke="var(--secondary)" strokeWidth="1" strokeDasharray="5 10" />
            <path className="pulse-line" d="M-100 600C100 650 300 550 500 600C700 650 900 550 1100 600C1300 650 1500 550 1700 600" stroke="var(--primary)" strokeWidth="1" strokeDasharray="10 5" />
          </svg>
        </div>
        
        <Container className="position-relative z-1">
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div variants={itemVariants} className="d-inline-flex align-items-center bg-white-5 border-glass rounded-full px-5 py-2 mb-10 backdrop-blur">
                  <span className="text-xs fw-bold text-primary tracking-widest uppercase">✨ The New Standard for Digital Education</span>
                </motion.div>
                
                <motion.h1 variants={itemVariants} className="display-1 fw-black mb-8 text-white" style={{ letterSpacing: '-0.06em', lineHeight: '0.9' }}>
                  Modern Learning <br /> Engineering for <span className="text-gradient">the Future.</span>
                </motion.h1>
                
                <motion.p variants={itemVariants} className="fs-5 text-muted mx-auto mb-12" style={{ maxWidth: '680px' }}>
                  Teach, learn, and scale with a unified SaaS platform engineered for clarity, speed, and institutional growth. Built for the modern architect.
                </motion.p>
                
                <motion.div variants={itemVariants} className="d-flex justify-content-center gap-4 mb-24">
                  <Link to="/register" className="btn-premium px-12 py-3.5 fs-6 shadow-2xl">
                    Get Started Free
                  </Link>
                  <Link to="/courses" className="btn btn-ghost border-glass text-white px-12 py-3.5 fs-6 hover-bg-glass">
                    Explore Catalog
                  </Link>
                </motion.div>
                
                {/* Dashboard Mockup - Floating Effect */}
                <motion.div 
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 60, rotateX: 15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="position-relative"
                >
                  <div className="glass-surface border-0 p-2 overflow-hidden shadow-2xl" style={{ borderRadius: '32px', transform: 'perspective(1200px)' }}>
                    <div className="bg-app p-2 rounded-2xl border border-glass">
                      <img 
                        src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80" 
                        alt="Dashboard Mockup" 
                        className="w-full h-auto rounded-xl opacity-80"
                      />
                    </div>
                  </div>
                  {/* Subtle glow behind mockup */}
                  <div className="position-absolute top-50 start-50 translate-middle w-75 h-75 bg-primary opacity-20 blur-3xl" style={{ filter: 'blur(150px)', zIndex: -1 }}></div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. TRUST SECTION */}
      <section className="py-16 border-top border-bottom border-glass bg-white-2">
        <Container>
          <div className="text-center mb-10">
            <span className="text-xs fw-bold text-dim text-uppercase tracking-widest">Powering global intelligence at</span>
          </div>
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-12 opacity-30 grayscale invert">
            {['Stanford', 'MIT', 'Harvard', 'Oxford', 'Berkeley'].map(name => (
              <span key={name} className="fs-3 fw-black text-white font-serif tracking-tighter">{name}</span>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. FEATURES SECTION - Stripe style */}
      <section id="features" className="py-24 py-lg-32">
        <Container>
          <div className="text-center mb-20">
            <div className="d-inline-flex align-items-center bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full mb-6 fw-bold text-xs tracking-wider text-uppercase">
              Core Capabilities
            </div>
            <h2 className="display-4 fw-black text-white mb-4">Engineered for excellence.</h2>
            <p className="text-muted fs-5">A comprehensive suite of tools built to elevate the learning experience.</p>
          </div>
          <Row className="g-8">
            {[
              { title: "Smart Course Builder", desc: "Construct multi-layered curriculums with our intuitive authoring environment.", icon: "bi-layers" },
              { title: "Neural Telemetry", desc: "Monitor student ingestion and progress with granular data points and automated milestones.", icon: "bi-activity" },
              { title: "Universal Permissions", desc: "Advanced RBAC systems for students, instructors, and platform administrators.", icon: "bi-shield-lock" },
              { title: "Identity Protection", desc: "Enterprise-grade JWT signatures ensure your intellectual property remains secure.", icon: "bi-fingerprint" },
              { title: "Edge Module Delivery", desc: "Seamlessly manage and deliver rich media content via global high-speed CDN.", icon: "bi-cloud-check" },
              { title: "Platform Insights", desc: "Visualize institutional growth with real-time analytics and predictive telemetry.", icon: "bi-graph-up-arrow" }
            ].map((f, i) => (
              <Col md={4} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card stat-card-premium h-100 p-10 border-glass bg-white-5 transition-smooth"
                >
                  <div className="text-primary fs-2 mb-6">
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h4 className="fw-bold text-white mb-3">{f.title}</h4>
                  <p className="text-muted small mb-0 leading-relaxed">{f.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 py-lg-32 bg-white-2 border-top border-bottom border-glass">
        <Container>
          <Row className="align-items-center g-16">
            <Col lg={6}>
              <h2 className="display-3 fw-black text-white mb-8" style={{ letterSpacing: '-0.05em', lineHeight: '1' }}>From initialization <br /> to scale in minutes.</h2>
              <div className="d-flex flex-column gap-10">
                {[
                  { step: "01", title: "Identity Initialization", desc: "Join as an instructor or student and set up your professional profile." },
                  { step: "02", title: "Module Authoring", desc: "Upload your content, set valuation, and publish to the global catalog." },
                  { step: "03", title: "Global Ingestion", desc: "Engage with students and monitor growth with real-time platform telemetry." }
                ].map((s, i) => (
                  <div key={i} className="d-flex gap-8">
                    <div className="text-primary fw-black fs-2 opacity-20">{s.step}</div>
                    <div>
                      <h4 className="fw-bold text-white mb-2">{s.title}</h4>
                      <p className="text-muted mb-0 fs-6">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={6}>
              <div className="glass-surface p-2 rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" 
                  className="rounded-xl w-full h-auto opacity-70" 
                  alt="Development"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 5. DASHBOARD PREVIEWS */}
      <section className="py-24 py-lg-32">
        <Container>
          <div className="text-center mb-20">
            <h2 className="display-4 fw-black text-white mb-4 text-center">One platform, three experiences.</h2>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>Tailored operational terminals for every user role in the ecosystem.</p>
          </div>
          <Row className="g-12">
            {[
              { role: "Student", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80" },
              { role: "Instructor", img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80" },
              { role: "Admin", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" }
            ].map((d, i) => (
              <Col md={4} key={i}>
                <div className="text-center group cursor-pointer">
                  <div className="glass-surface mb-6 shadow-2xl rounded-2xl overflow-hidden transition-smooth group-hover-scale">
                    <div className="bg-white-5 p-2 border-bottom border-glass d-flex gap-1.5 px-4">
                      <div className="bg-danger opacity-50 rounded-full" style={{ width: 8, height: 8 }}></div>
                      <div className="bg-warning opacity-50 rounded-full" style={{ width: 8, height: 8 }}></div>
                      <div className="bg-success opacity-50 rounded-full" style={{ width: 8, height: 8 }}></div>
                    </div>
                    <img src={d.img} className="w-full h-auto opacity-50 grayscale hover-none" style={{ height: '260px', objectFit: 'cover' }} alt={d.role} />
                  </div>
                  <h4 className="fw-bold text-white tracking-tight">{d.role} Terminal</h4>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="py-24 py-lg-32 bg-white-2 border-top border-bottom border-glass">
        <Container>
          <div className="text-center mb-20">
            <h2 className="display-4 fw-black text-white mb-4">Simple, transparent valuation.</h2>
            <p className="text-muted fs-5">Choose the access tier that fits your institutional ambition.</p>
          </div>
          <Row className="justify-content-center g-8">
            {[
              { plan: "Free", price: "0", features: ["Up to 3 Modules", "Basic Telemetry", "Unlimited Students", "Community Support"], btn: "Get Started" },
              { plan: "Pro", price: "49", features: ["Unlimited Modules", "Advanced Analytics", "Custom Branding", "Priority Support", "Email Marketing"], btn: "Start Pro Trial", popular: true },
              { plan: "Institution", price: "Custom", features: ["SAML SSO Integration", "White-labeling", "Full API Access", "Dedicated Success Node", "SLA Guarantees"], btn: "Contact Sales" }
            ].map((p, i) => (
              <Col lg={4} key={i}>
                <div className={`card h-100 p-12 border-glass bg-white-5 shadow-2xl position-relative transition-smooth ${p.popular ? 'ring-primary-glow' : ''}`}>
                  {p.popular && (
                    <div className="position-absolute top-0 start-50 translate-middle">
                      <span className="badge bg-primary px-5 py-2 rounded-full text-xs fw-black tracking-widest text-uppercase shadow-lg">Most Popular</span>
                    </div>
                  )}
                  <h3 className="fw-black text-white mb-2">{p.plan}</h3>
                  <div className="d-flex align-items-baseline mb-10">
                    <span className="display-3 fw-black text-white">${p.price}</span>
                    {p.price !== 'Custom' && <span className="text-dim ms-2 fw-bold">/mo</span>}
                  </div>
                  <ul className="list-unstyled d-flex flex-column gap-5 mb-12">
                    {p.features.map(f => (
                      <li key={f} className="text-xs fw-bold text-muted tracking-wide d-flex align-items-center gap-3">
                        <i className="bi bi-check-circle-fill text-primary"></i> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`btn-premium w-full py-3.5 text-xs fw-black ${p.popular ? 'shadow-glow' : 'bg-white-10 border-glass'}`}>
                    {p.btn.toUpperCase()}
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-32">
        <Container>
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className="card glass-surface p-16 p-lg-28 text-center border-glass shadow-2xl position-relative overflow-hidden"
            style={{ borderRadius: '48px' }}
          >
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-20 blur-3xl" style={{ filter: 'blur(160px)', transform: 'translate(-30%, -30%)' }}></div>
            <div className="position-absolute bottom-0 end-0 w-100 h-100 bg-secondary opacity-10 blur-3xl" style={{ filter: 'blur(160px)', transform: 'translate(30%, 30%)' }}></div>
            
            <div className="position-relative z-1">
              <h2 className="display-2 fw-black text-white mb-10" style={{ letterSpacing: '-0.06em', lineHeight: '0.9' }}>Start building your <br /> <span className="text-gradient">learning platform</span> today.</h2>
              <div className="d-flex justify-content-center gap-4">
                <Link to="/register" className="btn-premium px-16 py-4 fs-5 shadow-2xl">
                  Get Started for Free
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-20 border-top border-glass bg-app">
        <Container>
          <Row className="g-12">
            <Col lg={4}>
              <div className="d-flex align-items-center gap-3 mb-8">
                <div className="bg-primary text-white rounded-md d-flex align-items-center justify-content-center shadow-lg" style={{ width: 36, height: 36 }}>
                  <i className="bi bi-mortarboard-fill fs-5"></i>
                </div>
                <span className="fw-black fs-4 text-white tracking-tightest">NexusLMS</span>
              </div>
              <p className="text-dim small mb-0" style={{ maxWidth: '300px' }}>
                Engineering the future of digital education with a focus on speed, design, and results. Built for high-scale institutions.
              </p>
            </Col>
            <Col md={4} lg={2}>
              <h6 className="fw-black text-white text-xs tracking-widest text-uppercase mb-8">Product</h6>
              <ul className="list-unstyled d-flex flex-column gap-5">
                <li><Link to="/courses" className="text-dim text-xs text-decoration-none hover-white">Explore</Link></li>
                <li><Link to="#" className="text-dim text-xs text-decoration-none hover-white">Features</Link></li>
                <li><Link to="#" className="text-dim text-xs text-decoration-none hover-white">Valuation</Link></li>
              </ul>
            </Col>
            <Col md={4} lg={2}>
              <h6 className="fw-black text-white text-xs tracking-widest text-uppercase mb-8">Company</h6>
              <ul className="list-unstyled d-flex flex-column gap-5">
                <li><Link to="#" className="text-dim text-xs text-decoration-none hover-white">About Us</Link></li>
                <li><Link to="#" className="text-dim text-xs text-decoration-none hover-white">Blog</Link></li>
                <li><Link to="#" className="text-dim text-xs text-decoration-none hover-white">Careers</Link></li>
              </ul>
            </Col>
            <Col md={4} lg={4}>
              <h6 className="fw-black text-white text-xs tracking-widest text-uppercase mb-8">Stay Updated</h6>
              <p className="text-dim text-xs mb-6">Join our newsletter for the latest in education tech.</p>
              <div className="d-flex gap-3">
                <input type="text" placeholder="you@example.com" className="form-control bg-white-5 border-glass text-xs py-3 px-5 text-white" style={{ borderRadius: '12px' }} />
                <button className="btn-premium px-6 py-3 text-xs">JOIN</button>
              </div>
            </Col>
          </Row>
          <div className="pt-16 mt-16 border-top border-glass d-flex flex-column flex-md-row justify-content-between align-items-center gap-6">
            <div className="text-dim text-xs fw-medium">&copy; 2026 NexusLMS Inc. All rights reserved. Built for scale.</div>
            <div className="d-flex gap-8">
              <i className="bi bi-twitter text-dim cursor-pointer hover-white fs-5"></i>
              <i className="bi bi-github text-dim cursor-pointer hover-white fs-5"></i>
              <i className="bi bi-linkedin text-dim cursor-pointer hover-white fs-5"></i>
            </div>
          </div>
        </Container>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-gradient { background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
        .bg-white-10 { background: rgba(255, 255, 255, 0.1); }
        .bg-white-2 { background: rgba(255, 255, 255, 0.02); }
        .border-glass { border: 1px solid var(--border-glass); }
        .shadow-glow { box-shadow: 0 0 30px rgba(99, 102, 241, 0.3); }
  