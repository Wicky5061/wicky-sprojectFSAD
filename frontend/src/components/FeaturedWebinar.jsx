import { Link } from 'react-router-dom';
import './FeaturedWebinar.css';

export default function FeaturedWebinar({ webinar }) {
  if (!webinar) return null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="featured-webinar-banner glass graduate-border animate-fade-in">
      <div className="featured-badge">🔥 Featured Webinar Today</div>
      <div className="featured-content">
        <div className="featured-info text-left">
          <span className="featured-category">{webinar.category || 'Tech Workshop'}</span>
          <h2 className="featured-title">{webinar.title}</h2>
          <p className="featured-description">
            Join {webinar.instructor} for an exclusive session on {webinar.title}. 
            Don't miss out on this opportunity to learn from the best!
          </p>
          <div className="featured-meta">
            <div className="meta-item">
              <span>📅</span> {formatDate(webinar.dateTime)}
            </div>
            <div className="meta-item">
              <span>⏱️</span> {webinar.durationMinutes || '60'} Minutes
            </div>
          </div>
          <div className="featured-actions">
            <Link to={`/webinars/${webinar.id}`} className="btn btn-primary btn-lg shine">
              Register Now &rarr;
            </Link>
          </div>
        </div>
        <div className="featured-image-container">
          <img 
            src={webinar.coverImageUrl || `https://source.unsplash.com/featured/?technology,coding&${webinar.id}`} 
            alt={webinar.title} 
            className="featured-image"
          />
        </div>
      </div>
    </div>
  );
}
