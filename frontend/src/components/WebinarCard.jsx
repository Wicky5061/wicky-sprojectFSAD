import { Link } from 'react-router-dom';
import './WebinarCard.css';

export default function WebinarCard({ webinar }) {
  const statusClass = webinar.status?.toLowerCase() || 'upcoming';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
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
          <div className="webinar-cover-placeholder">⚡</div>
        )}
        
        {webinar.category && (
          <span className="webinar-category-badge">{webinar.category}</span>
        )}
        
        <span className={`badge badge-${statusClass}`} style={{ position: 'absolute', top: '15px', right: '15px' }}>
          {webinar.status}
        </span>
      </div>

      <div className="webinar-card-body">
        <h3 className="webinar-title">{webinar.title}</h3>
        
        <div className="webinar-meta">
          <div className="webinar-meta-item">
            <span>📅</span>
            <span>{formatDate(webinar.dateTime)}</span>
          </div>
          <div className="webinar-meta-item">
            <span>⏱️</span>
            <span>{webinar.durationMinutes || '60'} mins</span>
          </div>
          <div className="webinar-meta-item">
            <span>👥</span>
            <span>{webinar.registrationCount || '0'} Registered</span>
          </div>
        </div>
      </div>

      <div className="webinar-card-footer">
        <span className="instructor-name">{webinar.instructor}</span>
        <span className="view-btn">Details &rarr;</span>
      </div>
    </Link>
  );
}
