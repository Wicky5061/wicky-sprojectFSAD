import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { webinarAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
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
    const confirmed = await new Promise(resolve => {
      toast((t) => (
        <span>
          Delete this webinar permanently?
          <button onClick={() => { toast.dismiss(t.id); resolve(true); }} className="btn btn-sm btn-error ml-4">Delete</button>
          <button onClick={() => { toast.dismiss(t.id); resolve(false); }} className="btn btn-sm btn-outline ml-2">Cancel</button>
        </span>
      ), { duration: 6000 });
    });

    if (!confirmed) return;

    try {
      await webinarAPI.delete(id);
      setWebinars(webinars.filter((w) => w.id !== id));
      toast.success('Webinar deleted successfully.');
    } catch {
      toast.error('Failed to delete webinar.');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await webinarAPI.updateStatus(id, status);
      setWebinars(webinars.map((w) => (w.id === id ? { ...w, status } : w)));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString([], {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="page container" id="admin-dashboard">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="gradient-text">Admin Command Center</h1>
          <p>Welcome, {user?.name}. Monitor and manage your platform assets.</p>
        </div>
        <Link to="/admin/webinars/create" className="btn btn-primary shadow-lg">+ New Webinar</Link>
      </div>

      <div className="dash-stats-grid animate-fade-in">
        <div className="dash-stat-card card">
          <span className="stat-icon">📽️</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalWebinars}</span>
            <span className="stat-label">Total Webinars</span>
          </div>
        </div>
        <div className="dash-stat-card card">
          <span className="stat-icon">👥</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Registered Users</span>
          </div>
        </div>
        <div className="dash-stat-card card">
          <span className="stat-icon">⚡</span>
          <div className="stat-content">
            <span className="stat-value">{webinars.filter(w => w.status === 'LIVE').length}</span>
            <span className="stat-label">Active Sessions</span>
          </div>
        </div>
      </div>

      <div className="admin-analytics-grid grid grid-2 mb-12">
        <div className="chart-wrapper card glass p-6">
          <h3 className="mb-4">📈 Registration Trends</h3>
          <div style={{ height: '300px' }}>
            <Bar 
              data={{
                labels: webinars.slice(0, 8).map(w => w.title.substring(0, 15) + '...'),
                datasets: [{
                  label: 'Learners',
                  data: webinars.slice(0, 8).map(w => w.registrationCount || 0),
                  backgroundColor: 'rgba(99, 102, 241, 0.6)',
                  borderRadius: 6,
                }]
              }}
              options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
            />
          </div>
        </div>
        <div className="chart-wrapper card glass p-6">
          <h3 className="mb-4">🎭 User Ecosystem</h3>
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Pie 
              data={{
                labels: ['Admins', 'Learners'],
                datasets: [{
                  data: [users.filter(u => u.role === 'ADMIN').length, users.filter(u => u.role === 'USER').length],
                  backgroundColor: ['#6366f1', '#10b981'],
                }]
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      <div className="admin-tabs-nav mb-8">
        <button className={`nav-tab ${tab === 'webinars' ? 'active' : ''}`} onClick={() => setTab('webinars')}>📡 Manage Webinars</button>
        <button className={`nav-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>👥 Platform Users</button>
      </div>

      {tab === 'webinars' && (
        <div className="admin-table-area card glass overflow-hidden animate-fade-in">
          <table>
            <thead>
              <tr>
                <th>Webinar Details</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Impact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {webinars.map((w) => (
                <tr key={w.id}>
                  <td>
                    <div className="row-title-desc">
                      <Link to={`/webinars/${w.id}`} className="font-bold text-primary">{w.title}</Link>
                      <span className="text-xs text-muted block">{w.category || 'General'}</span>
                    </div>
                  </td>
                  <td>{w.instructor}</td>
                  <td>{formatDate(w.dateTime)}</td>
                  <td>
                    <select className="status-select" value={w.status} onChange={(e) => handleStatusChange(w.id, e.target.value)}>
                      <option value="UPCOMING">Upcoming</option>
                      <option value="LIVE">Live</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="text-center font-bold">{w.registrationCount || 0}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/admin/webinars/edit/${w.id}`} className="btn btn-xs btn-outline">Edit</Link>
                      <button onClick={() => handleDeleteWebinar(w.id)} className="btn btn-xs btn-outline btn-error">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'users' && (
        <div className="admin-table-area card glass overflow-hidden animate-fade-in">
          <table>
            <thead>
              <tr>
                <th>Platform User</th>
                <th>Email Address</th>
                <th>Privileges</th>
                <th>Organization</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-row">
                      <span className="user-icon">👤</span>
                      <span className="font-bold">{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-upcoming' : 'badge-completed'}`}>{u.role}</span>
                  </td>
                  <td>{u.organization || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
