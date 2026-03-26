import { Link } from 'react-router-dom';
import './WebinarCard.css';

/**
 * Reusable Webinar card component.
 * Props: webinar object with title, description, instructor, dateTime, status, category, etc.
 */
export default function WebinarCard({ webinar }) {
  const statusClass = webinar.status?.toLowerCase() || 'upcoming';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Link to={`/webinars/${webinar.id}`} className="webinar-card" id={`webinar-card-${webinar.id}`}>
      <div className="webinar-card-header">
        {webinar.coverImageUrl ? (
          <img src={webinar.coverImageUrl} alt={webinar.title} className="webinar-cover" />
        ) : (
          <div className="webinar-cover-placeholder">
            <span>⚡</span>
          </div>
        )}
        {webinar.status === 'LIVE' ? (
          <span className="badge badge-live" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 6, height: 6, backgroundColor: '#f87171', borderRadius: '50%' }}></span>
            LIVE
          </span>
        ) : (
          <span className={`badge badge-${statusClass}`}>{webinar.status}</span>
        )}
      </div>

      <div className="webinar-card-body">
        {webinar.category && (
          <span className="webinar-category">{webinar.category}</span>
        )}
        <h3 className="webinar-title">{webinar.title}</h3>
        <p className="webinar-desc">
          {webinar.description?.length > 100
            ? webinar.description.substring(0, 100) + '...'
            : webinar.description}
        </p>

        <div className="webinar-meta">
          <div className="webinar-meta-item">
            <span className="meta-icon">👤</span>
            <span>{webinar.instructor}</span>
          </div>
          <div className="webinar-meta-item">
            <span className="meta-icon">📅</span>
            <span>{formatDate(webinar.dateTime)}</span>
          </div>
          {webinar.durationMinutes && (
            <div className="webinar-meta-item">
              <span className="meta-icon">⏱️</span>
              <span>{webinar.durationMinutes} min</span>
            </div>
          )}
        </div>
      </div>

      <div className="webinar-card-footer">
        <div className="webinar-participants">
          {webinar.status === 'LIVE' ? (
            <>
              <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.85rem' }}>
                {webinar.registrationCount || 0} watching
              </span>
            </>
          ) : webinar.status === 'CANCELLED' ? (
            <>
              <span className="meta-icon">👥</span>
              <span>—</span>
            </>
          ) : (
            <>
              <span className="meta-icon">👥</span>
              <span>
                {webinar.registrationCount || 0}{' '}
                {webinar.status === 'COMPLETED' ? 'attended' : 'registered'}
              </span>
            </>
          )}
        </div>
        <span 
          className="webinar-cta" 
          style={webinar.status === 'LIVE' ? { color: '#ef4444', fontWeight: 700 } : {}}
        >
          {webinar.status === 'LIVE' ? 'Join Now →' : 'View Details →'}
        </span>
      </div>
    </Link>
  );
}
