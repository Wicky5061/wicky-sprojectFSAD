import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

/**
 * Register Page — User registration form.
 * Demonstrates: controlled form inputs, Axios POST, state management.
 */
export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    organization: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...data } = form;
      const res = await authAPI.register(data);
      // Auto-login after registration
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-card glass animate-fade-in">
        <div className="auth-header">
          <span className="auth-icon">🚀</span>
          <h1>Join WebinarHub</h1>
          <p>Create your free account today</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name *</label>
              <input
                type="text"
                id="reg-name"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email *</label>
              <input
                type="email"
                id="reg-email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password *</label>
              <input
                type="password"
                id="reg-password"
                name="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm-password">Confirm Password *</label>
              <input
                type="password"
                id="reg-confirm-password"
                name="confirmPassword"
                className="form-input"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone</label>
              <input
                type="tel"
                id="reg-phone"
                name="phone"
                className="form-input"
                placeholder="+91 12345 67890"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-org">Organization</label>
              <input
                type="text"
                id="reg-org"
                name="organization"
                className="form-input"
                placeholder="Your company or school"
                value={form.organization}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            id="register-submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="link-to-login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
