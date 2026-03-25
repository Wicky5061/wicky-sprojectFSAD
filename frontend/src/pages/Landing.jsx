import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { webinarAPI } from '../services/api';
import WebinarCard from '../components/WebinarCard';
import './Landing.css';

/**
 * Landing Page — Hero section + Featured webinars.
 * Demonstrates: useState, useEffect hooks, Axios API calls.
 */
export default function Landing() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" id="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="container hero-content animate-slide-up">
          <span className="hero-badge">🚀 Live Webinars & Workshops</span>
          <h1 className="hero-title">
            Learn From the <span className="gradient-text">Best Minds</span> in Tech
          </h1>
          <p className="hero-subtitle">
            Join thousands of learners on WebinarHub. Access live sessions, interactive workshops,
            and post-event resources — all in one platform.
          </p>
          <div className="hero-actions">
            <Link to="/webinars" className="btn btn-primary btn-lg" id="hero-explore-btn">
              Explore Webinars
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" id="hero-join-btn">
              Join Free
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.total || '0'}+</span>
              <span className="stat-label">Webinars</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">500+</span>
              <span className="stat-label">Learners</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">50+</span>
              <span className="stat-label">Instructors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section container" id="features-section">
        <h2 className="section-title">Why Choose <span className="gradient-text">WebinarHub?</span></h2>
        <div className="features-grid stagger">
          <div className="feature-card card">
            <div className="feature-icon">📡</div>
            <h3>Live Streaming</h3>
            <p>Join live sessions from anywhere. Interact with instructors in real time.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">📚</div>
            <h3>Rich Resources</h3>
            <p>Access slides, recordings, and materials even after the event ends.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">🎯</div>
            <h3>Easy Registration</h3>
            <p>Register for webinars with one click. Get reminders before events.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">🏆</div>
            <h3>Expert Instructors</h3>
            <p>Learn from industry veterans and thought leaders across domains.</p>
          </div>
        </div>
      </section>

      {/* Upcoming Webinars Section */}
      <section className="upcoming-section container" id="upcoming-section">
        <div className="section-header">
          <h2 className="section-title">Upcoming <span className="gradient-text">Webinars</span></h2>
          <Link to="/webinars" className="btn btn-outline btn-sm" id="view-all-webinars">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="loading-page">
            <div className="spinner"></div>
            <p>Loading webinars...</p>
          </div>
        ) : webinars.length > 0 ? (
          <div className="grid grid-3 stagger">
            {webinars.map((w) => (
              <WebinarCard key={w.id} webinar={w} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No upcoming webinars yet</h3>
            <p>Check back soon or create your first webinar!</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta-section">
        <div className="container cta-content">
          <h2>Ready to start learning?</h2>
          <p>Join WebinarHub today and access world-class webinars and workshops.</p>
          <Link to="/register" className="btn btn-accent btn-lg" id="cta-register-btn">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="brand-icon">⚡</span>
            <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1.1rem' }}>WebinarHub</span>
          </div>
          <p className="footer-text">© 2026 WebinarHub. Built with Spring Boot & React.</p>
        </div>
      </footer>
    </div>
  );
}
