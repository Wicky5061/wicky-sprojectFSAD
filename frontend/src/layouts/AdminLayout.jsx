import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="loading-screen">Verifying Administrator Permissions...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-content container-fluid p-4">
        <Outlet />
      </main>
      
      <style>{`
        .admin-layout {
          min-height: 100vh;
          background: #020617;
          color: #f8fafc;
        }
        .admin-content {
          max-width: 1400px;
          margin: 0 auto;
        }
        .admin-card {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .admin-title-section {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #1e293b;
        }
        .admin-title {
          color: #f8fafc;
          font-weight: 800;
          font-size: 1.75rem;
        }
        .admin-subtitle {
          color: #94a3b8;
          font-size: 1rem;
        }
        .btn-admin-primary {
          background: #7c3aed;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-admin-primary:hover {
          background: #6d28d9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
