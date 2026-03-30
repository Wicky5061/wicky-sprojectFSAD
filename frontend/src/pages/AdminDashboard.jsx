import { useState, useEffect } from 'react';
import { 
  Users, 
  Video, 
  BarChart3, 
  Radio, 
  Activity, 
  ArrowRight,
  PlusCircle,
  FileUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    webinars: 0,
    students: 0,
    registrations: 0,
    liveNow: 0
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentRegistrations();
  }, []);

  const fetchStats = async () => {
    try {
      // Mock stats for dashboard (replace with real API later)
      setStats({
        webinars: 12,
        students: 450,
        registrations: 890,
        liveNow: 1
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const fetchRecentRegistrations = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registrations`);
      if (resp.ok) {
        const data = await resp.json();
        setRecentRegistrations(data.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching recent registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="admin-title-section d-flex justify-content-between align-items-center">
        <div>
          <h1 className="admin-title">System Overview</h1>
          <p className="admin-subtitle">WebinarHub Platform Management Dashboard</p>
        </div>
        <div className="admin-quick-actions d-flex gap-3">
          <Link to="/admin/webinars" className="btn-admin-primary d-flex align-items-center gap-2">
            <PlusCircle size={18} />
            Add Webinar
          </Link>
          <Link to="/admin/resources" className="btn-admin-outline d-flex align-items-center gap-2">
            <FileUp size={18} />
            Upload Resource
          </Link>
        </div>
      </div>

      <div className="admin-stats-grid row g-4 mb-4">
        <div className="col-md-3">
          <div className="admin-stat-card card">
            <div className="stat-card-icon-admin webinars">
              <Video size={24} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">Total Webinars</span>
              <h3 className="stat-card-value">{stats.webinars}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="admin-stat-card card">
            <div className="stat-card-icon-admin students">
              <Users size={24} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">Total Students</span>
              <h3 className="stat-card-value">{stats.students}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="admin-stat-card card">
            <div className="stat-card-icon-admin registrations">
              <BarChart3 size={24} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">Registrations</span>
              <h3 className="stat-card-value">{stats.registrations}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="admin-stat-card card">
            <div className="stat-card-icon-admin live">
              <Radio size={24} className="pulse-icon" />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">Live Now</span>
              <h3 className="stat-card-value">{stats.liveNow}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="admin-card">
            <div className="card-header-admin d-flex justify-content-between align-items-center mb-3">
              <h3 className="card-title-admin d-flex align-items-center gap-2">
                <Activity size={20} className="color-primary" />
                Recent Registrations
              </h3>
              <Link to="/admin/users" className="view-all-link">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="table-responsive">
              <table className="admin-table table table-hover">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Webinar</th>
                    <th>Registered On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.length > 0 ? recentRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="fw-bold">{reg.userName}</span>
                          <span className="small-text">{reg.userEmail}</span>
                        </div>
                      </td>
                      <td>{reg.webinarTitle}</td>
                      <td>{new Date(reg.registrationDate).toLocaleDateString()}</td>
                      <td>
                        <span className="badge-admin success">Confirmed</span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center p-4">No recent registrations found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="admin-card">
            <h3 className="card-title-admin mb-3">System Health</h3>
            <div className="system-health-list">
              <div className="health-item d-flex justify-content-between mb-3">
                <span>API Status</span>
                <span className="badge-admin success">OPERATIONAL</span>
              </div>
              <div className="health-item d-flex justify-content-between mb-3">
                <span>Database</span>
                <span className="badge-admin success">CONNECTED</span>
              </div>
              <div className="health-item d-flex justify-content-between mb-3">
                <span>Email Server</span>
                <span className="badge-admin warning">QUEUED</span>
              </div>
              <div className="health-item d-flex justify-content-between">
                <span>Memory usage</span>
                <div className="progress-mini">
                  <div className="progress-bar-mini" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-stat-card {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1rem;
        }
        .stat-card-icon-admin {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-card-icon-admin.webinars { background: rgba(124, 58, 237, 0.15); color: #8b5cf6; }
        .stat-card-icon-admin.students { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .stat-card-icon-admin.registrations { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .stat-card-icon-admin.live { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
        .stat-card-label { color: #94a3b8; font-size: 0.85rem; font-weight: 600; }
        .stat-card-value { margin: 0; font-weight: 800; color: #f8fafc; }
        .view-all-link { color: #7c3aed; text-decoration: none; font-size: 0.9rem; font-weight: 600; }
        .admin-table { background: transparent; color: #f8fafc; }
        .admin-table thead th { background: transparent; color: #64748b; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.05em; border-bottom: 2px solid #1e293b; }
        .admin-table tbody tr { border-bottom: 1px solid #1e293b; }
        .admin-table tbody td { padding: 1rem 0.5rem; border-top: none; }
        .small-text { font-size: 0.75rem; color: #64748b; }
        .badge-admin { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; }
        .badge-admin.success { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .badge-admin.warning { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .btn-admin-outline { background: transparent; border: 1px solid #1e293b; color: #f8fafc; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
        .btn-admin-outline:hover { background: #1e293b; border-color: #334155; }
        .progress-mini { width: 100px; height: 6px; background: #1e293b; border-radius: 3px; overflow: hidden; margin-top: 8px; }
        .progress-bar-mini { height: 100%; background: #7c3aed; border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
