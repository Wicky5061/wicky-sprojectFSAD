import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { webinarAPI } from '../services/api';
import WebinarCard from '../components/WebinarCard';
import './Landing.css';

export default function Landing() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    loadData();
    
    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [loading]);

  const loadData = async () => {
    try {
      const [webRes, countRes] = await Promise.all([
        webinarAPI.getUpcoming().catch(() => ({ data: [] })),
        webinarAPI.getCount().catch(() => ({ data: { total: 0 } })),
      ]);
      setWebinars(webRes.data?.slice(0, 6) || []);
      setStats(countRes.data || { total: 0 });
    } catch (err) {
      console.error('Failed to load landing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const speakers = [
    { id: 1, name: 'Dr. Sarah Johnson', title: 'Senior Cloud Architect', expertise: 'AWS & Kubernetes', image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random&color=fff' },
    { id: 2, name: 'Michael Chen', title: 'Lead Full Stack Engineer', expertise: 'React, Node.js & TypeScript', image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random&color=fff' },
    { id: 3, name: 'Alex Williams', title: 'Cybersecurity Analyst', expertise: 'Ethical Hacking & SecOps', image: 'https://ui-avatars.com/api/?name=Alex+Williams&background=random&color=fff' },
    { id: 4, name: 'Jessica Lee', title: 'AI Research Scientist', expertise: 'Deep Learning & LLMs', image: 'https://ui-avatars.com/api/?name=Jessica+Lee&background=random&color=fff' },
  ];

  const testimonials = [
    { id: 1, name: 'Emily Davis', text: 'The React architecture workshop was a complete game-changer for my career. The instructor was brilliant and the content was extremely practical!', rating: 5, photo: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random&color=fff' },
    { id: 2, name: 'David Miller', text: 'I love how interactive the live sessions are. Being able to ask questions and get immediate feedback is so much better than pre-recorded videos.', rating: 5, photo: 'https://ui-avatars.com/api/?name=David+Miller&background=random&color=fff' },
    { id: 3, name: 'Sophia Wilson', text: 'The post-webinar resources and recording access are worth every second. I finally understood AWS networking thanks to Sarah\'s session.', rating: 5, photo: 'https://ui-avatars.com/api/?name=Sophia+Wilson&background=random&color=fff' },
    { id: 4, name: 'James Thompson', text: 'WebinarHub is my go-to platform for staying updated with the latest tech trends. The community and the quality of speakers are unmatched.', rating: 5, photo: 'https://ui-avatars.com/api/?name=James+Thompson&background=random&color=fff' },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-animation">
          <div className="blob"></div>
          <div className="blob"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text-area">
            <span className="hero-badge">🚀 Expert-Led Learning</span>
            <h1 className="hero-title">
              Learn Real-World Skills from <span className="gradient-text">Industry Experts</span>
            </h1>
            <p className="hero-subtitle">
              Join live webinars, participate in hands-on workshops, and master the technology that matters today. No more learning in silos.
            </p>
            <div className="hero-actions">
              <Link to="/webinars" className="btn btn-primary btn-lg">Browse Webinars</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Get Started Free</Link>
            </div>
          </div>
          
          <div className="hero-stats-floating shadow-lg">
            <div className="floating-stat">
              <span className="stat-num">{stats.total || '50'}+</span>
              <span className="stat-desc">Webinars</span>
            </div>
            <div className="floating-stat">
              <span className="stat-num">500+</span>
              <span className="stat-desc">Students</span>
            </div>
            <div className="floating-stat">
              <span className="stat-num">20+</span>
              <span className="stat-desc">Experts</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section bg-secondary">
        <div className="container">
          <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
          <div className="steps-grid">
            <div className="step-card card">
              <div className="step-icon">🔍</div>
              <h3>1. Browse</h3>
              <p>Explore our catalog of upcoming live webinars across various tech domains.</p>
            </div>
            <div className="step-card card">
              <div className="step-icon">📝</div>
              <h3>2. Register</h3>
              <p>Click once to join any session you're interested in. It's that simple.</p>
            </div>
            <div className="step-card card">
              <div className="step-icon">🎓</div>
              <h3>3. Learn</h3>
              <p>Join the live stream, interact with experts, and access post-event materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="speakers-section">
        <div className="container">
          <h2 className="section-title">Learn from <span className="gradient-text">Top Experts</span></h2>
          <div className="speakers-grid">
            {speakers.map(speaker => (
              <div key={speaker.id} className="speaker-card card">
                <img src={speaker.image} alt={speaker.name} className="speaker-image" />
                <h3>{speaker.name}</h3>
                <p className="speaker-title">{speaker.title}</p>
                <span className="speaker-expertise">{speaker.expertise}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Timeline Section */}
      <section className="timeline-section bg-secondary">
        <div className="container">
          <div className="section-header-flex">
            <h2 className="section-title text-left">Upcoming <span className="gradient-text">Schedule</span></h2>
            <Link to="/webinars" className="btn btn-sm btn-outline">View All &rarr;</Link>
          </div>
          
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="timeline">
              {webinars.slice(0, 3).map((webinar, idx) => (
                <div key={webinar.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-date">{new Date(webinar.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="timeline-content card">
                    <h3>{webinar.title}</h3>
                    <p>{webinar.instructor} &bull; {webinar.category}</p>
                    <Link to={`/webinars/${webinar.id}`} className="btn btn-sm btn-primary">Join Live</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Students <span className="gradient-text">Say</span></h2>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-card card">
                <div className="rating">{'★'.repeat(t.rating)}</div>
                <p>"{t.text}"</p>
                <div className="testimonial-user">
                  <img src={t.photo} alt={t.name} />
                  <span>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="container glass cta-inner">
          <h2>Ready to Ignite Your Learning Journey?</h2>
          <p>Join over 5,000+ engineers learning and growing with WebinarHub every day.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
