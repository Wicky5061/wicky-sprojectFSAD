import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { webinarAPI, registrationAPI, resourceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './WebinarDetail.css';

/**
 * Webinar Detail Page — Full info, register button, resources.
 * Demonstrates: useParams, multiple API calls, conditional rendering.
 */
export default function WebinarDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [webinar, setWebinar] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadWebinar();
  }, [id]);

  const loadWebinar = async () => {
    try {
      const [webRes, resRes] = await Promise.all([
        webinarAPI.getById(id),
        resourceAPI.getByWebinar(id).catch(() => ({ data: [] })),
      ]);
      setWebinar(webRes.data);
      setResources(resRes.data || []);

      // Check if user is registered
      if (user) {
        try {
          const checkRes = await registrationAPI.checkRegistration(id);
          setIsRegistered(checkRes.data.registered);
        } catch {
          setIsRegistered(false);
        }
      }
    } catch (err) {
      console.error('Failed to load webinar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRegLoading(true);
    try {
      await registrationAPI.register(webinar.id);
      setIsRegistered(true);
      setMessage({ text: 'Successfully registered for this webinar!', type: 'success' });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to register.',
        type: 'error',
      });
    } finally {
      setRegLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading webinar...</p>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h3>Webinar not found</h3>
          <Link to="/webinars" className="btn btn-outline">Back to Webinars</Link>
        </div>
      </div>
    );
  }

  const statusClass = webinar.status?.toLowerCase() || 'upcoming';

  return (
    <div className="page container" id="webinar-detail-page">
      <div className="detail-layout animate-fade-in">
        {/* Main Content */}
        <div className="detail-main">
          {/* Cover Image */}
          <div className="detail-cover">
            {webinar.coverImageUrl ? (
              <img src={webinar.coverImageUrl} alt={webinar.title} />
            ) : (
              <div className="detail-cover-placeholder">
                <span>⚡</span>
              </div>
            )}
          </div>

          <div className="detail-body">
            <div className="detail-meta-top">
              <span className={`badge badge-${statusClass}`}>{webinar.status}</span>
              {webinar.category && (
                <span className="detail-category">{webinar.category}</span>
              )}
            </div>

            <h1 className="detail-title">{webinar.title}</h1>

            <div className="detail-instructor">
              <span className="instructor-avatar">👤</span>
              <div>
                <span className="instructor-label">Instructor</span>
                <span className="instructor-name">{webinar.instructor}</span>
              </div>
            </div>

            <div className="detail-description">
              <h2>About this Webinar</h2>
              <p>{webinar.description}</p>
            </div>

            {/* Resources */}
            {resources.length > 0 && (
              <div className="detail-resources">
                <h2>📚 Resources</h2>
                <div className="resources-list">
                  {resources.map((r) => (
                    <a
                      key={r.id}
                      href={r.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-item card"
                    >
                      <span className="resource-icon">
                        {r.fileType === 'PDF' ? '📄' : r.fileType === 'VIDEO' ? '🎥' : '📎'}
                      </span>
                      <div>
                        <span className="resource-title">{r.title}</span>
                        <span className="resource-type">{r.fileType}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Stream URL for Live/Completed */}
            {webinar.streamUrl && (webinar.status === 'LIVE' || webinar.status === 'COMPLETED') && (
              <div className="detail-stream">
                <h2>{webinar.status === 'LIVE' ? '📡 Live Stream' : '🎬 Recording'}</h2>
                <a
                  href={webinar.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent btn-lg"
                  id="stream-link"
                >
                  {webinar.status === 'LIVE' ? 'Join Live Stream' : 'Watch Recording'}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar">
          <div className="sidebar-card glass">
            <h3>Event Details</h3>
            <div className="sidebar-info">
              <div className="sidebar-row">
                <span className="sidebar-icon">📅</span>
                <div>
                  <span className="sidebar-label">Date & Time</span>
                  <span className="sidebar-value">{formatDate(webinar.dateTime)}</span>
                </div>
              </div>
              <div className="sidebar-row">
                <span className="sidebar-icon">⏱️</span>
                <div>
                  <span className="sidebar-label">Duration</span>
                  <span className="sidebar-value">{webinar.durationMinutes} minutes</span>
                </div>
              </div>
              <div className="sidebar-row">
                <span className="sidebar-icon">👥</span>
                <div>
                  <span className="sidebar-label">Participants</span>
                  <span className="sidebar-value">
                    {webinar.status === 'LIVE'
                      ? `${webinar.registrationCount || 0} watching now`
                      : webinar.status === 'COMPLETED'
                      ? `${webinar.registrationCount || 0} attended`
                      : `${webinar.registrationCount || 0} registered (${Math.max(0, (webinar.maxParticipants || 100) - (webinar.registrationCount || 0))} seats left)`}
                  </span>
                </div>
              </div>
            </div>

            {message.text && (
              <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            {webinar.status !== 'CANCELLED' && !isAdmin() && (
              isRegistered ? (
                <div className="registered-badge">
                  <span>✅</span> You are registered
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-lg sidebar-cta"
                  id="register-btn"
                  onClick={handleRegister}
                  disabled={regLoading || webinar.registrationCount >= webinar.maxParticipants}
                >
                  {regLoading
                    ? 'Registering...'
                    : webinar.registrationCount >= webinar.maxParticipants
                    ? 'Event Full'
                    : 'Register Now — Free'}
                </button>
              )
            )}

            {isAdmin() && (
              <Link
                to={`/admin/webinars/edit/${webinar.id}`}
                className="btn btn-outline sidebar-cta"
                id="edit-webinar-btn"
              >
                ✏️ Edit Webinar
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
