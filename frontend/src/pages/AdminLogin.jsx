import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
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
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const attemptLogin = async () => {
      try {
        const response = await authAPI.login({ email, password });
        const data = response.data;

        if (data.user.role === 'ADMIN') {
          login(data.user);
          navigate('/admin');
        } else {
          setError('Access Denied: Registered account is not an administrator.');
          setLoading(false);
        }
      } catch (err) {
        if (err.code === 'ERR_NETWORK') {
          setError('Server is waking up, please wait...');
          setTimeout(attemptLogin, 5000);
        } else {
          setError(err.response?.data?.message || 'Invalid admin credentials');
          setLoading(false);
        }
      }
    };

    attemptLogin();
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
                placeholder="Enter admin email"
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

          <button 
            type="submit" 
            className="btn-admin-access"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Access Admin Portal'}
          </button>
          <div className="hint">Demo: vardhan@gmail.com / vivek123</div>
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
        .hint {
          text-align: center;
          margin-top: 1.5rem;
          color: #94a3b8;
          font-size: 0.85rem;
          font-family: 'JetBrains Mono', monospace;
          background: rgba(124, 58, 237, 0.05);
          padding: 0.5rem;
          border-radius: 6px;
          border: 1px dashed rgba(124, 58, 237, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
