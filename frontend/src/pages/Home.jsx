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
      <section className="hero-section position-relative overflow-hidden d-flex flex-column justify-content-center" style={{ minHeight: '100vh', zIndex: 1 }}>
        {/* Navbar Spacer */}
        <div className="navbar-spacer" style={{ height: '120px' }}></div>
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
        
        {/* Floating Premium Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="position-absolute d-none d-lg-block"
          style={{ top: '25%', left: '10%', zIndex: 1 }}
        >
          <div className="glass-surface p-4 rounded-2xl border-glass shadow-2xl backdrop-blur">
            <i className="bi bi-cpu text-primary fs-3"></i>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="position-absolute d-none d-lg-block"
          style={{ top: '40%', right: '12%', zIndex: 1 }}
        >
          <div className="glass-surface p-4 rounded-2xl border-glass shadow-2xl backdrop-blur">
            <i className="bi bi-command text-secondary fs-3"></i>
          </div>
        </motion.div>

        <Container className="position-relative z-1">
          <Row className="justify-content-center text-center">
            <Col lg={11} xl={10}>
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div variants={itemVariants} className="d-inline-flex align-items-center bg-white-5 border-glass rounded-full px-4 px-md-6 py-2.5 mb-8 mb-md-10 backdrop-blur shadow-glow-sm mt-6 mt-md-10">
                  <span className="text-xs fw-black text-primary tracking-widest uppercase d-flex align-items-center gap-2" style={{ fontSize: 'clamp(0.6rem, 2vw, 0.75rem)' }}>
                    <span className="d-inline-block w-2 h-2 rounded-circle bg-primary pulse-dot"></span>
                    Nexus LMS • Built for the Future
                  </span>
                </motion.div>
                
                <motion.h1 variants={itemVariants} className="display-1 fw-black mb-6 mb-md-8 text-white tracking-tightest leading-none">
                  Modern Learning <br /> <span className="text-gradient-premium">for Everyone.</span>
                </motion.h1>
                
                <motion.p variants={itemVariants} className="fs-5 fs-md-4 text-muted mx-auto mb-10 mb-md-14 fw-medium leading-relaxed" style={{ maxWidth: '720px', opacity: 0.8 }}>
                  The simple way for schools to teach and students to learn. <br className="d-none d-md-block" /> 
                  Create courses, grow your skills, and track your progress effortlessly.
                </motion.p>
                
                <motion.div variants={itemVariants} className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-4 gap-md-5 mb-20 mb-md-28">
                  <Link to="/register" className="btn-premium px-8 px-md-14 py-3 py-md-4 fs-6 fs-md-5 shadow-glow-lg transition-all hover-translate-y w-100 w-sm-auto">
                    Get Started
                  </Link>
                  <Link to="/courses" className="btn btn-ghost border-glass text-white px-8 px-md-14 py-3 py-md-4 fs-6 fs-md-5 backdrop-blur hover-bg-glass transition-all w-100 w-sm-auto">
                    Browse Courses
                  </Link>
                </motion.div>
                
                {/* Dashboard Mockup - Ultra High Fidelity */}
                <motion.div 
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 100, rotateX: 20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="position-relative perspective-2000"
                >
                  <div className="glass-surface border-0 p-3 rounded-4xl shadow-glow-xl overflow-hidden">
                    <div className="bg-app rounded-3xl border border-glass overflow-hidden position-relative">
                      {/* Browser Header UI */}
                      <div className="bg-white-5 p-4 border-bottom border-glass d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                          <div className="bg-danger rounded-circle opacity-50" style={{ width: 10, height: 10 }}></div>
                          <div className="bg-warning rounded-circle opacity-50" style={{ width: 10, height: 10 }}></div>
                          <div className="bg-success rounded-circle opacity-50" style={{ width: 10, height: 10 }}></div>
                        </div>
                        <div className="bg-white-5 px-4 py-1 rounded-full text-xs text-dim border-glass">nexuslms.io/terminal</div>
                        <div className="opacity-0 w-12"></div>
                      </div>
                      <div className="w-full h-100 bg-gradient-to-br from-indigo-900 to-purple-900 d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                        <i className="bi bi-display text-white-10 display-1"></i>
                      </div>
                    </div>
                  </div>
                  {/* Background Neural Glow */}
                  <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 bg-primary opacity-20 blur-4xl" style={{ zIndex: -1 }}></div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. TRUST SECTION */}
      <section className="py-24 py-lg-32 border-top border-bottom border-glass bg-white-2">
        <Container>
          <div className="text-center mb-20">
            <span className="text-xs fw-black text-dim text-uppercase tracking-widest opacity-60">Trusted by modern institutions</span>
          </div>
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-16 gap-lg-24 opacity-40 grayscale invert px-4">
            {['Stanford', 'MIT', 'Harvard', 'Oxford', 'Berkeley'].map(name => (
              <span key={name} className="fs-1 fw-black text-white font-serif tracking-tighter">{name}</span>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. FEATURES SECTION - Stripe style */}
      <section id="features" className="py-40 py-lg-64">
        <Container>
          <div className="text-center mb-32">
            <div className="d-inline-flex align-items-center bg-primary bg-opacity-10 text-primary px-5 py-2 rounded-full mb-10 fw-black text-xs tracking-wider text-uppercase border-glass">
              Platform Features
            </div>
            <h2 className="display-2 fw-black text-white mb-8 tracking-tightest leading-none">Everything you need to succeed.</h2>
            <p className="text-muted fs-4 mx-auto opacity-70" style={{ maxWidth: '720px' }}>A complete platform to build, learn, and grow your skills with professional tools.</p>
          </div>
          <Row className="g-12 g-lg-16 px-lg-4">
            {[
              { title: "Course Builder", desc: "Create high-quality courses quickly with our professional tools.", icon: "bi-layers" },
              { title: "Progress Tracking", desc: "Monitor student growth and track success with real-time data.", icon: "bi-activity" },
              { title: "Role Management", desc: "Manage students and teachers with advanced roles and permissions.", icon: "bi-shield-lock" },
              { title: "Enterprise Security", desc: "Keep your data and accounts safe with industry-leading security.", icon: "bi-fingerprint" },
              { title: "Fast Delivery", desc: "Deliver videos and lessons instantly to users around the globe.", icon: "bi-cloud-check" },
              { title: "Real-time Analytics", desc: "Visualize your growth and learning with easy-to-read reports.", icon: "bi-graph-up-arrow" }
            ].map((f, i) => (
              <Col lg={4} md={6} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -16, scale: 1.02 }}
                  className="card stat-card-premium h-100 p-14 border-glass bg-white-5 transition-smooth rounded-4xl shadow-glow-sm"
                >
                  <div className="text-primary fs-1 mb-10">
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h4 className="fw-black text-white mb-5 tracking-tight fs-3">{f.title}</h4>
                  <p className="text-muted fs-6 mb-0 leading-relaxed opacity-70">{f.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-40 py-lg-64 bg-white-2 border-top border-bottom border-glass">
        <Container>
          <Row className="align-items-center g-20 g-lg-32">
            <Col lg={6}>
              <h2 className="display-1 fw-black text-white mb-12 tracking-tightest leading-none">Launch your learning <br /> in minutes.</h2>
              <div className="d-flex flex-column gap-16 mt-12">
                {[
                  { step: "01", title: "Setup Profile", desc: "Sign up as a student or teacher and create your profile in seconds." },
                  { step: "02", title: "Create Courses", desc: "Upload your lessons, set pricing, and share your knowledge globally." },
                  { step: "03", title: "Track Growth", desc: "Engage with students and monitor progress with advanced analytics." }
                ].map((s, i) => (
                  <div key={i} className="d-flex gap-12">
                    <div className="text-primary fw-black display-4 opacity-10 leading-none">{s.step}</div>
                    <div>
                      <h4 className="fw-black text-white mb-4 tracking-tight fs-3">{s.title}</h4>
                      <p className="text-muted mb-0 fs-5 leading-relaxed opacity-70">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={6}>
              <motion.div 
                whileHover={{ rotateY: -8, rotateX: 5 }}
                className="glass-surface p-4 rounded-4xl shadow-glow-xl transition-smooth"
              >
                <div className="w-full h-100 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-3xl d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                   <i className="bi bi-code-square text-white-10 display-2"></i>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 5. DASHBOARD PREVIEWS */}
      <section className="py-40 py-lg-64">
        <Container>
          <div className="text-center mb-32">
            <h2 className="display-2 fw-black text-white mb-8 tracking-tightest leading-none">One platform, total control.</h2>
            <p className="text-muted fs-4 mx-auto opacity-70" style={{ maxWidth: '720px' }}>Dedicated workspaces designed for students, teachers, and admins.</p>
          </div>
          <Row className="g-16 g-lg-24 px-lg-4">
            {[
              { role: "Student", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80" },
              { role: "Instructor", img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80" },
              { role: "Admin", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" }
            ].map((d, i) => (
              <Col md={4} key={i}>
                <div className="text-center group cursor-pointer">
                  <div className="glass-surface mb-12 shadow-glow-lg rounded-4xl overflow-hidden transition-smooth group-hover-scale">
                    <div className="bg-white-5 p-4 border-bottom border-glass d-flex gap-2.5 px-8">
                      <div className="bg-danger opacity-50 rounded-full" style={{ width: 12, height: 12 }}></div>
                      <div className="bg-warning opacity-50 rounded-full" style={{ width: 12, height: 12 }}></div>
                      <div className="bg-success opacity-50 rounded-full" style={{ width: 12, height: 12 }}></div>
                    </div>
                    <div className="w-full h-auto bg-gradient-to-b from-gray-800 to-gray-900 d-flex align-items-center justify-content-center" style={{ height: '360px' }}>
                      <i className="bi bi-cpu text-white-5 display-3"></i>
                    </div>
                  </div>
                  <h4 className="fw-black text-white tracking-tight fs-3">{d.role} Terminal</h4>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="py-40 py-lg-64 bg-white-2 border-top border-bottom border-glass">
        <Container>
          <div className="text-center mb-32">
            <h2 className="display-2 fw-black text-white mb-8 tracking-tightest leading-none">Simple, transparent pricing.</h2>
            <p className="text-muted fs-4 mx-auto opacity-70" style={{ maxWidth: '600px' }}>Choose the plan that is right for your needs.</p>
          </div>
          <Row className="justify-content-center g-12 g-lg-16 px-lg-4">
            {[
              { plan: "Free", price: "0", features: ["Up to 3 Courses", "Basic Tracking", "Unlimited Students", "Community Support"], btn: "Get Started" },
              { plan: "Pro", price: "49", features: ["Unlimited Courses", "Advanced Reports", "Custom Branding", "Priority Support", "Email Marketing"], btn: "Start Free Trial", popular: true },
              { plan: "Enterprise", price: "Custom", features: ["SSO Integration", "White-labeling", "Full API Access", "Account Manager", "SLA Guarantee"], btn: "Contact Sales" }
            ].map((p, i) => (
              <Col lg={4} md={6} key={i}>
                <div className={`card h-100 p-16 border-glass bg-white-5 shadow-glow-lg position-relative transition-smooth rounded-4xl ${p.popular ? 'ring-primary-glow' : ''}`}>
                  {p.popular && (
                    <div className="position-absolute top-0 start-50 translate-middle">
                      <span className="badge bg-primary px-8 py-2.5 rounded-full text-xs fw-black tracking-widest text-uppercase shadow-lg">Most Popular</span>
                    </div>
                  )}
                  <h3 className="fw-black text-white mb-6 tracking-tight fs-2">{p.plan}</h3>
                  <div className="d-flex align-items-baseline mb-14">
                    <span className="display-3 fw-black text-white">${p.price}</span>
                    {p.price !== 'Custom' && <span className="text-dim ms-4 fw-bold fs-5 opacity-60">/mo</span>}
                  </div>
                  <ul className="list-unstyled d-flex flex-column gap-7 mb-16">
                    {p.features.map(f => (
                      <li key={f} className="text-sm fw-black text-muted tracking-wide d-flex align-items-center gap-5">
                        <i className="bi bi-check-circle-fill text-primary fs-5"></i> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`btn-premium w-full py-5 fs-6 fw-black rounded-2xl d-flex align-items-center justify-content-center ${p.popular ? 'shadow-glow-lg' : 'bg-white-10 border-glass'}`}>
                    {p.btn.toUpperCase()}
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-48 py-lg-64">
        <Container>
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className="card glass-surface p-24 p-lg-40 text-center border-glass shadow-glow-xl position-relative overflow-hidden"
            style={{ borderRadius: '80px' }}
          >
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-20 blur-4xl" style={{ filter: 'blur(200px)', transform: 'translate(-30%, -30%)' }}></div>
            <div className="position-absolute bottom-0 end-0 w-100 h-100 bg-secondary opacity-10 blur-4xl" style={{ filter: 'blur(200px)', transform: 'translate(30%, 30%)' }}></div>
            
            <div className="position-relative z-1">
              <h2 className="display-1 fw-black text-white mb-16 tracking-tightest leading-none">Start building your <br /> <span className="text-gradient-premium">future</span> today.</h2>
              <div className="d-flex justify-content-center gap-8">
                <Link to="/register" className="btn-premium px-20 py-5 fs-3 shadow-glow-lg rounded-3xl transition-smooth hover-translate-y text-decoration-none d-flex align-items-center justify-content-center">
                  Get Started for Free
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>


      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-rgb: 99, 102, 241;
          --secondary-rgb: 168, 85, 247;
          --bg-dark: #020617;
          --surface: rgba(15, 23, 42, 0.6);
          --border: rgba(255, 255, 255, 0.08);
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --text-dim: #cbd5e1;
          --radius-xl: 32px;
          --radius-lg: 24px;
          --radius-md: 12px;
          --ease: cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bg-app { 
          background: var(--bg-dark); 
          color: var(--text-main);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }

        /* Optimized Noise Overlay */
        .bg-app::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3e%3cfilter id='n'%3e%3cturbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3e%3c/filter%3e%3crect width='100%25' height='100%25' filter='url(%23n)'/%3e%3c/svg%3e");
          opacity: 0.015;
          pointer-events: none;
          z-index: 50;
        }

        /* Typography & Gradients */
        .tracking-tightest { letter-spacing: -0.04em !important; }
        .leading-none { line-height: 1.1 !important; }
        .text-gradient-premium { 
          background: linear-gradient(90deg, #fff, #818cf8, #c084fc, #fff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          will-change: background-position;
          animation: shine 8s linear infinite;
        }
        @keyframes shine { to { background-position: 200% center; } }
        
        .text-dim { color: var(--text-dim) !important; }
        .text-muted { color: var(--text-muted) !important; }

        /* Performance Optimized Hero */
        .hero-section {
          background: radial-gradient(circle at 50% -20%, rgba(var(--primary-rgb), 0.12), transparent 70%);
        }

        .blur-3xl { filter: blur(40px); }
        .blur-4xl { filter: blur(60px); }

        /* Surfaces & Glassmorphism */
        .glass-surface {
          background: var(--surface);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--border);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
        }

        .bg-white-5 { background: rgba(255, 255, 255, 0.03) !important; border: 1px solid var(--border); }
        .bg-white-2 { background: rgba(255, 255, 255, 0.01) !important; }

        /* Premium Buttons */
        .btn-premium {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff !important;
          border: none;
          padding: 12px 32px;
          font-weight: 600;
          border-radius: var(--radius-md);
          transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .btn-premium::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s var(--ease);
        }

        .btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
        }

        .btn-premium:hover::after { transform: translateX(100%); }

        .btn-ghost {
          border-radius: var(--radius-md);
          transition: all 0.2s var(--ease);
        }

        .btn-ghost:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        /* Cards & Interactivity */
        .stat-card-premium {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid var(--border);
          transition: all 0.3s var(--ease);
          will-change: transform, box-shadow;
        }

        .stat-card-premium:hover {
          background: rgba(30, 41, 59, 0.5);
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.5);
        }

        .shadow-glow-lg { box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4); }
        .shadow-glow-xl { box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5); }

        .ring-primary-glow {
          box-shadow: 0 0 0 2px #6366f1, 0 0 20px rgba(99, 102, 241, 0.2) !important;
        }

        /* Optimized Animations */
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .pulse-dot { animation: pulse-dot 3s infinite ease-in-out; }

        .pulse-line { stroke-opacity: 0.15; }
        .pulse-line-delayed { stroke-opacity: 0.1; }

        /* Layout & Utilities */
        .rounded-4xl { border-radius: var(--radius-xl) !important; }
        .rounded-3xl { border-radius: var(--radius-lg) !important; }
        .rounded-full { border-radius: 9999px !important; }
        
        .grayscale-20 { filter: grayscale(20%) brightness(0.9); transition: filter 0.3s var(--ease); }
        .hover-none:hover { filter: grayscale(0%) brightness(1); }

        .group:hover .group-hover-scale { transform: scale(1.02) translateY(-4px); transition: transform 0.3s var(--ease); }

        /* Responsive Polish */
        @media (max-width: 991px) {
          .display-1 { font-size: calc(2.5rem + 3vw) !important; }
          .py-40 { py-24 !important; }
          .mb-28 { mb-16 !important; }
        }

        @media (max-width: 767px) {
          .display-1 { font-size: 3rem !important; }
          .d-flex.gap-5 { flex-direction: column; width: 100%; gap: 1rem !important; }
          .btn-premium, .btn-ghost { width: 100%; padding: 14px; }
          .hero-section { min-height: auto !important; padding-top: 100px; padding-bottom: 60px; }
        }
      `}} />
    </div>
  );
};

export default Home;
