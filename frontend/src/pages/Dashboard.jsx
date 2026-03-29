import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationAPI, webinarAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import WebinarCard from '../components/WebinarCard';
import toast from 'react-hot-toast';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [allWebinars, setAllWebinars] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) loadData();
    else setLoading(false);
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [regRes, webRes] = await Promise.all([
        registrationAPI.getUserRegistrations(user?.id).catch(() => ({ data: [] })),
        webinarAPI.getAll().catch(() => ({ data: [] })),
      ]);
      
      const regs = regRes?.data || [];
      const webs = webRes?.data || [];
      
      setRegistrations(Array.isArray(regs) ? regs : []);
      setAllWebinars(Array.isArray(webs) ? webs : []);
      
      const rec = Array.isArray(webs) ? webs.filter(w => !regs.some(r => r.webinarId === w.id)).slice(0, 3) : [];
      setRecommended(rec);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load your dashboard. Please refresh or try again later.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = (reg) => {
    const certWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Certificate of Completion - ${reg.webinarTitle}</title>
          <style>
            body { font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f4f8; }
            .cert-card { border: 20px solid #2563eb; padding: 60px; text-align: center; background: white; width: 800px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); position: relative; }
            .branding { font-size: 24px; color: #2563eb; font-weight: 800; margin-bottom: 40px; }
            h1 { font-size: 48px; margin: 20px 0; color: #1e293b; }
            .recipient { font-size: 32px; border-bottom: 2px solid #cbd5e1; display: inline-block; padding: 0 40px; }
            .webinar { font-weight: 700; color: #2563eb; }
            .date { margin-top: 40px; color: #64748b; }
            .stamp { position: absolute; bottom: 40px; right: 40px; opacity: 0.2; transform: rotate(-20deg); font-size: 48px; border: 5px solid #2563eb; padding: 10px; color: #2563eb; font-weight: 900; }
          </style>
        </head>
        <body>
          <div class="cert-card">
            <div class="branding">WebinarHub PLATFORM</div>
            <p>This is to certify that</p>
            <div class="recipient">${user.name}</div>
            <p>has successfully completed the webinar</p>
            <h2 class="webinar">${reg.webinarTitle}</h2>
            <div class="date">${new Date().toLocaleDateString()}</div>
            <div class="stamp">VERIFIED</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    certWindow.document.write(content);
  };

  const stats = {
    total: registrations?.length || 0,
    upcoming: Array.isArray(registrations) ? registrations.filter(r => r?.dateTime && new Date(r.dateTime) > new Date()).length : 0,
    completed: Array.isArray(registrations) ? registrations.filter(r => r?.attended || (r?.dateTime && new Date(r.dateTime) < new Date())).length : 0,
    certificates: Array.isArray(registrations) ? registrations.filter(r => r?.attended).length : 0
  };

  const recentActivity = Array.isArray(registrations) ? registrations.slice(0, 3) : [];
  const upcomingReminders = Array.isArray(registrations)
    ? registrations
        .filter(r => {
          if (!r?.dateTime) return false;
          const diff = new Date(r.dateTime) - new Date();
          return diff > 0 && diff < (7 * 24 * 60 * 60 * 1000);
        })
        .slice(0, 3)
    : [];

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  if (error) {
    return (
      <div className="page container" id="dashboard-error">
        <div className="error-container card glass animate-fade-in">
          <span className="error-icon">⚠️</span>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page container" id="dashboard-no-auth">
        <div className="error-container card glass">
          <h2>Access Denied</h2>
          <p>Please log in to view your dashboard.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container" id="user-dashboard">
      <div className="page-header">
        <h1 className="gradient-text">Welcome back, {user?.name}!</h1>
        <p>Your personalized learning dashboard is ready.</p>
      </div>

      <div className="dash-stats-grid animate-fade-in">
        <div className="dash-stat-card card">
          <span className="stat-icon">📈</span>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Registrations</span>
          </div>
        </div>
        <div className="dash-stat-card card">
          <span className="stat-icon">🔔</span>
          <div className="stat-content">
            <span className="stat-value">{stats.upcoming}</span>
            <span className="stat-label">Upcoming Sessions</span>
          </div>
        </div>
        <div className="dash-stat-card card">
          <span className="stat-icon">✅</span>
          <div className="stat-content">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed Sessions</span>
          </div>
        </div>
        <div className="dash-stat-card card">
          <span className="stat-icon">📜</span>
          <div className="stat-content">
            <span className="stat-value">{stats.certificates}</span>
            <span className="stat-label">Certificates Earned</span>
          </div>
        </div>
      </div>

      <div className="learning-progress-section card glass mb-12">
        <div className="progress-info">
          <h3>Your Learning Journey</h3>
          <span>{Math.round((stats.certificates / (stats.total || 1)) * 100)}% Milestone Completed</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${(stats.certificates / (stats.total || 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="dashboard-grid-main">
        <div className="dashboard-main-col">
          <section className="dash-section" id="my-registrations">
            <div className="section-header-flex mb-6">
              <h3>Registered Webinars</h3>
              {registrations.length > 0 && <span className="item-count">{registrations.length} Total</span>}
            </div>
            
            {registrations.length > 0 ? (
              <div className="registrations-list grid grid-1">
                {registrations.map((reg) => (
                  <div key={reg.id} className="registration-item-full card glass shadow-sm">
                    <div className="reg-info">
                      <h4 className="reg-title">{reg.webinarTitle}</h4>
                      <p className="reg-meta">📅 {new Date(reg.dateTime).toLocaleDateString()} at {new Date(reg.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="reg-actions-flex">
                      <Link to={`/webinars/${reg.webinarId}`} className="btn btn-sm btn-outline">Details</Link>
                      {reg.attended && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleDownloadCertificate(reg)}>
                          Download Certificate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-dashboard-state glass">
                <h3>Start Your Journey</h3>
                <p>Register for your first webinar to see it here.</p>
                <Link to="/webinars" className="btn btn-primary">Discover Webinars</Link>
              </div>
            )}
          </section>

          {recommended.length > 0 && (
            <section className="dash-section" id="recommended">
              <div className="section-header-flex mb-6">
                <h3>Recommended for You</h3>
                <Link to="/webinars" className="btn btn-sm btn-outline">Explore More</Link>
              </div>
              <div className="grid grid-3">
                {recommended.map((w) => (
                  <WebinarCard key={w.id} webinar={w} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="dashboard-side-col">
          <div className="dashboard-sidebar-section card">
            <h3>Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="activity-list">
                {recentActivity.map(act => (
                  <div key={act.id} className="activity-item">
                    <span className="activity-icon">🔗</span>
                    <div className="activity-details">
                      <p>Registered for <strong>{act.webinarTitle}</strong></p>
                      <span className="activity-time">Just recently</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="empty-text">No recent activity.</p>}
          </div>

          <div className="dashboard-sidebar-section card mt-6">
            <h3>Upcoming Reminders</h3>
            {upcomingReminders.length > 0 ? (
              <div className="reminder-list">
                {upcomingReminders.map(rem => (
                  <div key={rem.id} className="reminder-item-card">
                    <div className="reminder-dot"></div>
                    <div className="reminder-info">
                      <p className="reminder-title">{rem.webinarTitle}</p>
                      <span className="reminder-time">In {Math.round((new Date(rem.dateTime) - new Date()) / (24 * 60 * 60 * 1000))} days</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="empty-text">No reminders for the next 7 days.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
