import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Dashboard.css'; // Reuse dashboard styles for consistency

/**
 * My Webinars page - specialized view for user's registrations.
 * Demonstrates robust API handling and clear empty/loading states.
 */
export default function MyWebinars() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
       loadRegistrations();
    } else if (user === null) {
       // Not logged in
       setLoading(false);
    }
  }, [user]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      // Using the specific endpoint requested: /api/registrations/user/{id}
      // Our api service was updated to handle the ID
      const response = await registrationAPI.getUserRegistrations(user?.id);
      
      if (response && response.data) {
        setRegistrations(Array.isArray(response.data) ? response.data : []);
      } else {
        setRegistrations([]);
      }
    } catch (err) {
      console.error('Failed to load user registrations:', err);
      setError('We encountered an error fetching your webinars. Please check your connection and try again.');
      toast.error('Could not load registrations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page" id="my-webinars-loading">
        <div className="spinner"></div>
        <p>Fetching your webinars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page container" id="my-webinars-error">
        <div className="error-container card glass animate-fade-in text-center p-12">
          <span className="error-icon" style={{ fontSize: '3rem' }}>❌</span>
          <h2 className="mt-4">Load Error</h2>
          <p className="mb-6">{error}</p>
          <button className="btn btn-primary" onClick={loadRegistrations}>Retry</button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page container" id="my-webinars-auth-check">
        <div className="error-container card glass text-center p-12">
          <h2>Authentication Required</h2>
          <p className="mb-6">You need to be logged in to view your registered webinars.</p>
          <Link to="/login" className="btn btn-primary">Sign In Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container animate-fade-in" id="my-webinars-content">
      <div className="page-header mb-8">
        <h1 className="gradient-text">My Webinars</h1>
        <p>A complete list of workshops and sessions you've registered for.</p>
      </div>

      {registrations.length > 0 ? (
        <div className="registrations-list grid grid-1 gap-6">
          {registrations.map((reg) => (
            <div key={reg.id} className="registration-item-full card glass shadow-sm hover-up">
              <div className="reg-info">
                <h3 className="reg-title text-xl font-bold">{reg.webinarTitle || 'Untitled Webinar'}</h3>
                <div className="reg-meta-grid mt-2">
                   <span className="reg-meta">📅 {reg.dateTime ? new Date(reg.dateTime).toLocaleDateString() : 'Date TBD'}</span>
                   <span className="reg-meta ml-4">⏰ {reg.dateTime ? new Date(reg.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time TBD'}</span>
                </div>
              </div>
              <div className="reg-actions-flex flex items-center gap-4">
                 {reg.attended && <span className="badge badge-success px-3 py-1 rounded-full text-xs font-semibold">ATTENDED</span>}
                 <Link to={`/webinars/${reg.webinarId}`} className="btn btn-sm btn-outline">
                    View Details
                 </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-dashboard-state glass text-center p-16 animate-fade-in">
          <div className="empty-icon" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎫</div>
          <h3>No Registrations Found</h3>
          <p className="mb-8">It looks like you haven't registered for any webinars yet. Ready to start learning?</p>
          <Link to="/webinars" className="btn btn-primary">Discover Webinars</Link>
        </div>
      )}
    </div>
  );
}
