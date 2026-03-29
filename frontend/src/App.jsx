import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Webinars from './pages/Webinars';
import WebinarDetail from './pages/WebinarDetail';
import Dashboard from './pages/Dashboard';
import MyWebinars from './pages/MyWebinars';
import AdminDashboard from './pages/AdminDashboard';
import CreateWebinar from './pages/CreateWebinar';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#fff' } }} />
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/webinars" element={<Webinars />} />
              <Route path="/webinars/:id" element={<WebinarDetail />} />

              {/* Protected Routes — Requires Login */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/my-webinars" element={
                <ProtectedRoute>
                  <MyWebinars />
                </ProtectedRoute>
              } />

              {/* Admin Routes — Requires ADMIN role */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/create-webinar" element={
                <ProtectedRoute requireAdmin>
                  <CreateWebinar />
                </ProtectedRoute>
              } />
              <Route path="/admin/webinars/create" element={
                <ProtectedRoute requireAdmin>
                  <CreateWebinar />
                </ProtectedRoute>
              } />
              <Route path="/admin/webinars/edit/:id" element={
                <ProtectedRoute requireAdmin>
                  <CreateWebinar />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          <footer className="footer shadow-lg">
            <div className="container">
              <div className="footer-grid">
                <div className="footer-info">
                  <h3 className="gradient-text">WebinarHub</h3>
                  <p>Elevate your skills with expert-led webinars and interactive workshops.</p>
                </div>
                <div className="footer-links">
                  <h4>Platform</h4>
                  <ul>
                    <li><a href="/webinars">Browse Webinars</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/register">Sign Up</a></li>
                  </ul>
                </div>
                <div className="footer-social">
                  <h4>Connect</h4>
                  <div className="social-icons">
                    <span>Twitter</span>
                    <span>LinkedIn</span>
                    <span>GitHub</span>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2026 WebinarHub. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
