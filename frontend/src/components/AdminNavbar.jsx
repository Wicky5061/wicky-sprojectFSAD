import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Video, 
  FileText, 
  Users, 
  LogOut, 
  ShieldCheck,
  Award
} from 'lucide-react';
import './Navbar.css';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <nav className="navbar admin-navbar sticky-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="navbar-brand-section d-flex align-items-center">
          <NavLink to="/admin" className="brand-link d-flex align-items-center">
            <ShieldCheck size={32} className="admin-brand-icon" />
            <div className="brand-text-stack ms-2">
              <span className="brand-text admin-brand">WebinarHub</span>
              <span className="brand-badge-admin">ADMIN PORTAL</span>
            </div>
          </NavLink>
        </div>

        <div className="navbar-nav-admin d-flex gap-4">
          <NavLink to="/admin" end className={({isActive}) => isActive ? 'nav-item-admin active' : 'nav-item-admin'}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/webinars" className={({isActive}) => isActive ? 'nav-item-admin active' : 'nav-item-admin'}>
            <Video size={18} />
            <span>Webinars</span>
          </NavLink>
          <NavLink to="/admin/resources" className={({isActive}) => isActive ? 'nav-item-admin active' : 'nav-item-admin'}>
            <FileText size={18} />
            <span>Resources</span>
          </NavLink>
          <NavLink to="/admin/users" className={({isActive}) => isActive ? 'nav-item-admin active' : 'nav-item-admin'}>
            <Users size={18} />
            <span>Users</span>
          </NavLink>
        </div>

        <div className="navbar-user-section d-flex align-items-center gap-3">
          <div className="nav-user-info d-none d-md-flex flex-column align-items-end">
            <span className="nav-user-name">{user?.name}</span>
            <span className="nav-user-role-badge">ADMINISTRATOR</span>
          </div>
          <button onClick={handleLogout} className="btn-logout-admin">
            <LogOut size={18} />
            <span className="ms-1">Sign Out</span>
          </button>
        </div>
      </div>

      <style>{`
        .admin-navbar {
          background: #0f172a !important;
          border-bottom: 2px solid #7c3aed !important;
          padding: 0.75rem 2rem;
        }
        .admin-brand {
          color: white !important;
          font-size: 1.25rem !important;
        }
        .brand-badge-admin {
          background: #7c3aed;
          color: white;
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .admin-brand-icon {
          color: #7c3aed;
        }
        .nav-item-admin {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .nav-item-admin:hover, .nav-item-admin.active {
          color: #a78bfa;
        }
        .nav-item-admin.active {
          position: relative;
        }
        .nav-item-admin.active::after {
          content: '';
          position: absolute;
          bottom: -22px;
          left: 0;
          width: 100%;
          height: 3px;
          background: #7c3aed;
          border-radius: 3px;
        }
        .nav-user-name { color: #f8fafc; font-weight: 700; font-size: 0.9rem; }
        .nav-user-role-badge { color: #10b981; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; }
        .btn-logout-admin {
          background: transparent;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .btn-logout-admin:hover {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </nav>
  );
};

export default AdminNavbar;
