import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import './Auth.css'; // Reuse some base styles but override with specific ones

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role === 'ADMIN') {
          login(data.user);
          navigate('/admin');
        } else {
          setError('Access Denied: Registered account is not an administrator.');
        }
      } else {
        setError(data.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Connection failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container admin-portal">
      <div className="auth-card animate-slide-up">
        <div className="auth-header admin-header">
          <div className="admin-icon-wrapper">
            <Shield size={48} className="admin-shield" />
            <Lock size={20} className="admin-lock" />
          </div>
          <h1>Admin Portal</h1>
          <p>Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Administrator Email</label>
            <div className="input-with-icon">
              <Mail size={20} />
              <input
                id="email"
                type="email"
                placeholder="vardhan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Security Password</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-hint">
            <p><strong>System Hint:</strong></p>
            <code>Email: vardhan@gmail.com</code>
            <code>Pass: vivek123</code>
          </div>

          <button 
            type="submit" 
            className="btn-admin-access"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Access Admin Portal'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
      
      <style>{`
        .admin-portal {
          background: radial-gradient(circle at center, #1a1033 0%, #0f0a1e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .admin-header h1 {
          color: #a78bfa;
          margin-bottom: 0.5rem;
        }
        .admin-icon-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 1.5rem;
          color: #7c3aed;
        }
        .admin-lock {
          position: absolute;
          bottom: 2px;
          right: -2px;
          background: #0f0a1e;
          border-radius: 50%;
          padding: 2px;
          color: #10b981;
        }
        .admin-hint {
          background: rgba(124, 58, 237, 0.1);
          border: 1px dashed rgba(124, 58, 237, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
        }
        .admin-hint p { margin-bottom: 0.5rem; color: #a78bfa; }
        .admin-hint code { display: block; color: #8b5cf6; font-family: monospace; }
        .btn-admin-access {
          width: 100%;
          padding: 1rem;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-admin-access:hover {
          background: #6d28d9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
        }
        .btn-admin-access:disabled {
          background: #4c1d95;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
