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
    const confirmed = await new Promise(resolve => {
      const toastId = toast((t) => (
        <span>
          Cancel registration?
          <button onClick={() => { toast.dismiss(t.id); resolve(true); }} className="btn btn-sm btn-primary ml-4">Yes</button>
          <button onClick={() => { toast.dismiss(t.id); resolve(false); }} className="btn btn-sm btn-outline ml-2">No</button>
        </span>
      ), { duration: 6000 });
    });

    if (!confirmed) return;

    try {
      await registrationAPI.cancel(regId);
      setRegistrations(registrations.filter((r) => r.id !== regId));
      toast.success('Registration cancelled successfully.');
    } catch {
      toast.error('Failed to cancel registration.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString([], {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="page container" id="user-dashboard">
      <div className="page-header">
        <h1 className="gradient-text">My Dashboard</h1>
        <p>Welcome back, {user?.name}! Manage your learning journey here.</p>
      </div>

      <div className="dash-stats-grid animate-fade-in">
        <div className="dash-stat-card card">
          <span className="stat-icon">📅</span>
          <div className="stat-content">
            <span className="stat-value">{registrations.length}</span>
            <span className="stat-label">Registrations</span>
          </div>
        </div>
        <div className="dash-stat-card card">
          <span className="stat-icon">🎓</span>
          <div className="stat-content">
            <span className="stat-value">{registrations.filter(r => r.attended).length}</span>
            <span className="stat-label">Sessions Attended</span>
          </div>
        </div>
        <div className="dash-stat-card card">
          <span className="stat-icon">🔥</span>
          <div className="stat-content">
            <span className="stat-value">{recommended.length}</span>
            <span className="stat-label">New Recommendations</span>
          </div>
        </div>
      </div>

      <section className="dash-section" id="my-registrations">
        <div className="section-header-flex mb-6">
          <h3>Your Upcoming Sessions</h3>
          {registrations.length > 0 && <span className="item-count">{registrations.length} Total</span>}
        </div>
        
        {registrations.length > 0 ? (
          <div className="registrations-list grid grid-2">
            {registrations.map((reg) => (
              <div key={reg.id} className="registration-item card glass shadow-sm">
                <div className="reg-info">
                  <h4 className="reg-title">{reg.webinarTitle}</h4>
                  <p className="reg-date">📅 {formatDate(reg.dateTime)}</p>
                </div>
                <div className="reg-actions">
                  <Link to={`/webinars/${reg.webinarId}`} className="btn btn-sm btn-outline">Details</Link>
                  {!reg.attended && (
                    <button className="btn btn-sm btn-outline btn-error" onClick={() => handleCancel(reg.id)}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-dashboard-state glass">
            <h3>No registrations yet</h3>
            <p>Ready to start learning? Explore our featured webinars below.</p>
            <Link to="/webinars" className="btn btn-primary">Browse Webinars</Link>
          </div>
        )}
      </section>

      {recommended.length > 0 && (
        <section className="dash-section" id="recommended-webinars">
          <div className="section-header-flex mb-6">
            <h3>Recommended Webinars</h3>
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
  );
}
