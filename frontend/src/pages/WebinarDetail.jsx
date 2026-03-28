import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { webinarAPI, registrationAPI, resourceAPI, ratingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './WebinarDetail.css';

export default function WebinarDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [webinar, setWebinar] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [userRating, setUserRating] = useState({ stars: 5, comment: '' });
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    loadWebinar();
  }, [id]);

  const loadWebinar = async () => {
    try {
      const [webRes, resRes, ratingRes] = await Promise.all([
        webinarAPI.getById(id),
        resourceAPI.getByWebinar(id).catch(() => ({ data: [] })),
        ratingAPI.getByWebinar(id).catch(() => ({ data: [] })),
      ]);
      setWebinar(webRes.data);
      setResources(resRes.data || []);
      setRatings(ratingRes.data || []);
      
      if (ratingRes.data?.length > 0) {
        const avg = ratingRes.data.reduce((acc, r) => acc + r.stars, 0) / ratingRes.data.length;
        setAvgRating(avg.toFixed(1));
      }

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
      toast.error('Failed to load webinar details.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    
    setSubmittingRating(true);
    try {
      const res = await ratingAPI.submit({
        userId: user.id,
        webinarId: id,
        stars: userRating.stars,
        comment: userRating.comment
      });
      setRatings([res.data, ...ratings]);
      setUserRating({ stars: 5, comment: '' });
      const newAvg = ([res.data, ...ratings]).reduce((acc, r) => acc + r.stars, 0) / (ratings.length + 1);
      setAvgRating(newAvg.toFixed(1));
      toast.success('Thank you for your feedback!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setSubmittingRating(false);
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
      toast.success('Successfully registered! Check your email for details.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register.');
    } finally {
      setRegLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

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
      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-cover shadow-xl">
            {webinar.coverImageUrl ? (
              <img src={webinar.coverImageUrl} alt={webinar.title} />
            ) : (
              <div className="detail-cover-placeholder">⚡</div>
            )}
            <span className={`badge badge-${statusClass} detail-status-badge`}>{webinar.status}</span>
          </div>

          <div className="detail-content-area">
            <div className="detail-header-info">
              {webinar.category && <span className="detail-category-tag">{webinar.category}</span>}
              <h1 className="detail-title">{webinar.title}</h1>
              
              <div className="detail-instructor-strip">
                <div className="instructor-info">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(webinar.instructor)}&background=random&color=fff&size=64`} 
                    alt={webinar.instructor} 
                    className="instructor-avatar-lg"
                  />
                  <div>
                    <span className="inst-label">Presented By</span>
                    <span className="inst-name">{webinar.instructor}</span>
                  </div>
                </div>
                {avgRating > 0 && <div className="detail-avg-rating">⭐ {avgRating}<span>({ratings.length} Reviews)</span></div>}
              </div>
            </div>

            <div className="detail-section">
              <h3>About this Session</h3>
              <p className="description-text">{webinar.description}</p>
            </div>

            <div className="detail-grid-sections">
              <div className="detail-section">
                <h3>🎯 What You Will Learn</h3>
                <ul className="learning-list">
                  <li>Master the core concepts of {webinar.category || 'this topic'}</li>
                  <li>Industry best practices and advanced techniques</li>
                  <li>Real-world case studies and practical applications</li>
                  <li>How to optimize your workflow for 2026 standards</li>
                  <li>Q&A session with {webinar.instructor}</li>
                </ul>
              </div>
              <div className="detail-section">
                <h3>📋 Prerequisites</h3>
                <p>Basic understanding of {webinar.category || 'the subject matter'}. No advanced setup required.</p>
              </div>
            </div>

            <div className="detail-section">
              <h3>🎤 Speaker Bio</h3>
              <div className="speaker-bio-card card glass">
                <p><strong>{webinar.instructor}</strong> is a world-class expert in {webinar.category || 'technology'} with over 12 years of experience. Having led teams at top Fortune 500 companies, they bring a wealth of practical knowledge and a passion for teaching the next generation of professionals.</p>
              </div>
            </div>

            <div className="detail-section">
              <h3>📅 Session Agenda</h3>
              <div className="agenda-timeline">
                <div className="agenda-item">
                  <span className="time">0:00</span>
                  <span className="event">Introduction & Housekeeping</span>
                </div>
                <div className="agenda-item">
                  <span className="time">0:15</span>
                  <span className="event">Main Topic: Deep Dive into {webinar.title}</span>
                </div>
                <div className="agenda-item">
                  <span className="time">0:45</span>
                  <span className="event">Interactive Workshop & Live Demo</span>
                </div>
                <div className="agenda-item">
                  <span className="time">1:15</span>
                  <span className="event">Q&A Session & Closing Remarks</span>
                </div>
              </div>
            </div>

            {resources.length > 0 && (
              <div className="detail-section">
                <h3>📚 Learning Materials</h3>
                <div className="resources-grid">
                  {resources.map((r) => (
                    <a key={r.id} href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="resource-link card">
                      <span className="res-icon">{r.fileType === 'PDF' ? '📄' : '🎥'}</span>
                      <div className="res-info">
                        <span className="res-title">{r.title}</span>
                        <span className="res-type">{r.fileType}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {webinar.streamUrl && (webinar.status === 'LIVE' || webinar.status === 'COMPLETED') && (
              <div className="detail-section stream-section glass">
                <h3>{webinar.status === 'LIVE' ? '📡 Watch Live Session' : '🎬 Watch Replay'}</h3>
                <p>Access the {webinar.status === 'LIVE' ? 'live stream' : 'recording'} for this webinar below.</p>
                <a href={webinar.streamUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg w-full">
                  {webinar.status === 'LIVE' ? 'Enter Live Stream' : 'Watch Recording'}
                </a>
              </div>
            )}

            <div className="detail-section ratings-section">
              <div className="section-title-flex">
                <h3>Reviews & Feedback</h3>
                {avgRating > 0 && <span className="count-badge">{ratings.length} Reviews</span>}
              </div>

              {(webinar.status === 'COMPLETED' || webinar.status === 'LIVE') && isRegistered && (
                <div className="rating-form-card card">
                  <h4>Leave a Review</h4>
                  <form onSubmit={handleRatingSubmit}>
                    <div className="star-rating-input">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button" className={`star-btn ${userRating.stars >= s ? 'active' : ''}`} onClick={() => setUserRating({ ...userRating, stars: s })}>★</button>
                      ))}
                    </div>
                    <textarea placeholder="Tell others what you learned..." className="form-input" value={userRating.comment} onChange={(e) => setUserRating({ ...userRating, comment: e.target.value })} rows="3"></textarea>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={submittingRating}>{submittingRating ? 'Posting...' : 'Post Review'}</button>
                  </form>
                </div>
              )}

              <div className="reviews-list">
                {ratings.map((r) => (
                  <div key={r.id} className="review-card card">
                    <div className="review-header">
                      <span className="review-user">{r.userName || 'Learning Enthusiast'}</span>
                      <span className="review-stars">{'★'.repeat(r.stars)}</span>
                    </div>
                    {r.comment && <p className="review-text">{r.comment}</p>}
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {ratings.length === 0 && <p className="empty-reviews">No reviews yet. Join the session to be the first!</p>}
              </div>
            </div>
          </div>
        </div>

        <aside className="detail-sidebar">
          <div className="sticky-sidebar-card glass shadow-lg">
            <h3>Event Information</h3>
            <div className="sidebar-meta-list">
              <div className="side-meta-item">
                <span className="side-icon">📅</span>
                <div className="side-info">
                  <span className="side-label">Scheduled For</span>
                  <span className="side-value">{formatDate(webinar.dateTime)}</span>
                </div>
              </div>
              <div className="side-meta-item">
                <span className="side-icon">⏱️</span>
                <div className="side-info">
                  <span className="side-label">Duration</span>
                  <span className="side-value">{webinar.durationMinutes || '60'} Minutes</span>
                </div>
              </div>
              <div className="side-meta-item">
                <span className="side-icon">👥</span>
                <div className="side-info">
                  <span className="side-label">Participants</span>
                  <span className="side-value">{webinar.registrationCount || '0'} Registered</span>
                </div>
              </div>
            </div>

            <div className="sidebar-actions">
              {regLoading ? (
                <button className="btn btn-primary btn-lg w-full" disabled>Processing...</button>
              ) : (
                <>
                  {webinar.status === 'UPCOMING' && !isAdmin() && !isRegistered && (
                    <button className="btn btn-primary btn-lg w-full" onClick={handleRegister} disabled={webinar.registrationCount >= (webinar.maxParticipants || 100)}>
                      Register Now →
                    </button>
                  )}
                  {webinar.status === 'LIVE' && !isAdmin() && (
                    isRegistered ? (
                      <a href={webinar.streamUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg w-full">
                        Join Live Now 🔴
                      </a>
                    ) : (
                      <button className="btn btn-primary btn-lg w-full" onClick={handleRegister}>
                        Register to Join Live Now 🔴
                      </button>
                    )
                  )}
                  {webinar.status === 'COMPLETED' && !isAdmin() && (
                    <a href={webinar.streamUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg w-full">
                      View Recording
                    </a>
                  )}
                  {webinar.status === 'CANCELLED' && !isAdmin() && (
                    <button className="btn btn-outline btn-lg w-full" disabled>Event Cancelled</button>
                  )}
                  {isRegistered && webinar.status === 'UPCOMING' && (
                    <div className="reg-status-pill">✅ You are Registered</div>
                  )}
                </>
              )}
              {isAdmin() && <Link to={`/admin/webinars/edit/${webinar.id}`} className="btn btn-outline w-full">Edit Webinar Details</Link>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
