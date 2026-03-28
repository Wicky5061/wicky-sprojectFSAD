import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { webinarAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * Admin Dashboard — Manage webinars, view users, registrations.
 * Demonstrates: Admin-only features, CRUD operations, tab-based UI.
 */
export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('webinars');
  const [webinars, setWebinars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalWebinars: 0, totalUsers: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [webRes, userRes, countRes] = await Promise.all([
        webinarAPI.getAll().catch(() => ({ data: [] })),
        userAPI.getAll().catch(() => ({ data: [] })),
        webinarAPI.getCount().catch(() => ({ data: { total: 0 } })),
      ]);
      setWebinars(webRes.data || []);
      setUsers(userRes.data || []);
      setStats({
        totalWebinars: countRes.data?.total || 0,
        totalUsers: (userRes.data || []).length,
      });
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebinar = async (id) => {
    if (!window.confirm('Are you sure you want to delete this webinar?')) return;
    try {
      await webinarAPI.delete(id);
      setWebinars(webinars.filter((w) => w.id !== id));
    } catch {
      alert('Failed to delete webinar.');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await webinarAPI.updateStatus(id, status);
      setWebinars(webinars.map((w) => (w.id === id ? { ...w, status } : w)));
    } catch {
      alert('Failed to update status.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page container" id="admin-dashboard">
      <div className="page-header animate-fade-in">
        <h1>Admin Dashboard</h1>
        <p>Manage your platform, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="dash-stats glass animate-fade-in">
        <div className="dash-stat-item">
          <span className="dash-stat-value">{stats.totalWebinars}</span>
          <span className="dash-stat-label">Total Webinars</span>
        </div>
        <div className="dash-stat-item">
          <span className="dash-stat-value">{stats.totalUsers}</span>
          <span className="dash-stat-label">Total Users</span>
        </div>
        <div className="dash-stat-item">
          <span className="dash-stat-value">
            {webinars.filter((w) => w.status === 'UPCOMING').length}
          </span>
          <span className="dash-stat-label">Upcoming</span>
        </div>
        <div className="dash-stat-item">
          <span className="dash-stat-value">
            {webinars.filter((w) => w.status === 'LIVE').length}
          </span>
          <span className="dash-stat-label">Live Now</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="admin-analytics animate-fade-in">
        <div className="chart-container glass">
          <h3>📊 Registrations Per Webinar</h3>
          <Bar 
            data={{
              labels: webinars.slice(0, 10).map(w => w.title.substring(0, 20) + (w.title.length > 20 ? '...' : '')),
              datasets: [{
                label: 'Registrations',
                data: webinars.slice(0, 10).map(w => w.registrationCount || 0),
                backgroundColor: 'rgba(124, 58, 237, 0.6)',
                borderColor: 'rgb(124, 58, 237)',
                borderWidth: 1,
                borderRadius: 4,
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'var(--text-muted)' } }, x: { grid: { display: false }, ticks: { color: 'var(--text-muted)' } } }
            }}
          />
        </div>
        <div className="chart-container glass small-chart">
          <h3>👥 User Distribution</h3>
          <Pie 
            data={{
              labels: ['Admin', 'User'],
              datasets: [{
                data: [
                  users.filter(u => u.role === 'ADMIN').length,
                  users.filter(u => u.role === 'USER').length
                ],
                backgroundColor: ['rgba(6, 182, 212, 0.6)', 'rgba(236, 72, 153, 0.6)'],
                borderColor: ['rgb(6, 182, 212)', 'rgb(236, 72, 153)'],
                borderWidth: 1,
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: 'bottom', labels: { color: 'var(--text-muted)' } } }
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="admin-actions animate-fade-in">
        <Link to="/admin/webinars/create" className="btn btn-primary" id="create-webinar-btn">
          + Create Webinar
        </Link>
      </div>

      {/* Tabs */}
      <div className="admin-tabs animate-fade-in">
        <button
          className={`admin-tab ${tab === 'webinars' ? 'active' : ''}`}
          onClick={() => setTab('webinars')}
          id="tab-webinars"
        >
          📡 Webinars
        </button>
        <button
          className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
          onClick={() => setTab('users')}
          id="tab-users"
        >
          👥 Users
        </button>
      </div>

      {/* Webinars Tab */}
      {tab === 'webinars' && (
        <div className="table-wrapper animate-fade-in">
          <table id="admin-webinars-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Instructor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Registrations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {webinars.map((w) => (
                <tr key={w.id}>
                  <td>
                    <Link to={`/webinars/${w.id}`} className="reg-webinar-link">
                      {w.title}
                    </Link>
                  </td>
                  <td>{w.instructor}</td>
                  <td>{formatDate(w.dateTime)}</td>
                  <td>
                    <select
                      className="form-select"
                      value={w.status}
                      onChange={(e) => handleStatusChange(w.id, e.target.value)}
                      style={{ padding: '6px 30px 6px 10px', fontSize: '0.8rem' }}
                    >
                      <option value="UPCOMING">Upcoming</option>
                      <option value="LIVE">Live</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td>{w.registrationCount || 0}</td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/admin/webinars/edit/${w.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteWebinar(w.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {webinars.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No webinars yet. Create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="table-wrapper animate-fade-in">
          <table id="admin-users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Organization</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-upcoming' : 'badge-completed'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.organization || '—'}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
