import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationAPI, webinarAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import WebinarCard from '../components/WebinarCard';
import './Dashboard.css';

/**
 * User Dashboard — My registrations, recommended webinars.
 * Demonstrates: Context API usage, multiple API calls, conditional rendering.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [regRes, recRes] = await Promise.all([
        registrationAPI.getUserRegistrations().catch(() => ({ data: [] })),
        webinarAPI.getUpcoming().catch(() => ({ data: [] })),
      ]);
      setRegistrations(regRes.data || []);
      setRecommended((recRes.data || []).slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (regId) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      await registrationAPI.cancel(regId);
      setRegistrations(registrations.filter((r) => r.id !== regId));
    } catch {
      alert('Failed to cancel registration.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page container" id="user-dashboard">
      <div className="page-header animate-fade-in">
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.name}! Here are your upcoming sessions.</p>
      </div>

      {/* Stats Overview */}
      <div className="dash-stats glass animate-fade-in">
        <div className="dash-stat-item">
          <span className="dash-stat-value">{registrations.length}</span>
          <span className="dash-stat-label">My Registrations</span>
        </div>
        <div className="dash-stat-item">
          <span className="dash-stat-value">
            {registrations.length}
          </span>
          <span className="dash-stat-label">Upcoming</span>
        </div>
        <div className="dash-stat-item">
          <span className="dash-stat-value">
            {registrations.filter((r) => r.attended).length}
          </span>
          <span className="dash-stat-label">Attended</span>
        </div>
      </div>

      {/* My Registrations */}
      <section className="dash-section" id="my-registrations">
        <h2>📋 My Registrations</h2>
        {registrations.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Webinar</th>
                  <th>Registered On</th>
                  <th>Attended</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <Link to={`/webinars/${reg.webinarId}`} className="reg-webinar-link">
                        {reg.webinarTitle || 'Webinar'}
                      </Link>
                    </td>
                    <td>{formatDate(reg.registeredAt)}</td>
                    <td>{reg.attended ? '✅' : '—'}</td>
                    <td>
                      {!reg.attended ? (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleCancel(reg.id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No registrations yet</h3>
            <p>
              Browse our <Link to="/webinars">webinars</Link> and register for one!
            </p>
          </div>
        )}
      </section>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="dash-section" id="recommended-webinars">
          <div className="section-header">
            <h2>🔥 Recommended for You</h2>
            <Link to="/webinars" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="grid grid-3 stagger">
            {recommended.map((w) => (
              <WebinarCard key={w.id} webinar={w} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
