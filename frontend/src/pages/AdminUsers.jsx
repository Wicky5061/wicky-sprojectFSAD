import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Mail, 
  Calendar, 
  Filter,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

const AdminUsers = () => {
  const [webinars, setWebinars] = useState([]);
  const [selectedWebinarId, setSelectedWebinarId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWebinars();
  }, []);

  useEffect(() => {
    if (selectedWebinarId) {
      fetchRegistrations(selectedWebinarId);
    } else {
      setRegistrations([]);
    }
  }, [selectedWebinarId]);

  const fetchWebinars = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/webinars`);
      if (resp.ok) {
        setWebinars(await resp.json());
      }
    } catch (err) {
      console.error('Error fetching webinars:', err);
    }
  };

  const fetchRegistrations = async (id) => {
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registrations/webinar/${id}`);
      if (resp.ok) {
        setRegistrations(await resp.json());
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) return;
    
    const selectedWebinar = webinars.find(w => w.id.toString() === selectedWebinarId.toString());
    const header = "Name,Email,Registered On,Status\n";
    const rows = registrations.map(reg => 
      `${reg.userName},${reg.userEmail},${new Date(reg.registrationDate).toLocaleDateString()},Confirmed`
    ).join("\n");
    
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Webinar_Registrants_${selectedWebinar?.title.replace(/ /g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-users animate-fade-in">
      <div className="admin-title-section d-flex justify-content-between align-items-center">
        <div>
          <h1 className="admin-title">Student Management</h1>
          <p className="admin-subtitle">Track registrants and audience engagement per webinar</p>
        </div>
        {selectedWebinarId && registrations.length > 0 && (
          <button onClick={exportCSV} className="btn-admin-primary d-flex align-items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
        )}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="search-wrapper">
            <Filter size={20} className="search-icon" />
            <select 
              className="admin-search-input" 
              value={selectedWebinarId}
              onChange={(e) => setSelectedWebinarId(e.target.value)}
            >
              <option value="">-- Select Webinar to View Attendees --</option>
              {webinars.map(w => (
                <option key={w.id} value={w.id}>{w.title} ({new Date(w.dateTime).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Filter by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
              disabled={!selectedWebinarId}
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="text-center p-5">Loading registrations...</div>
        ) : !selectedWebinarId ? (
          <div className="text-center p-5">
            <Users size={48} className="text-muted mb-3" />
            <p className="text-muted">Select a webinar from the dropdown above to manage registrations.</p>
          </div>
        ) : filteredRegistrations.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table table align-middle">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Contact Information</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="admin-avatar">
                          {reg.userName.charAt(0)}
                        </div>
                        <span className="fw-bold">{reg.userName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Mail size={16} />
                        <span>{reg.userEmail}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Calendar size={16} />
                        <span>{new Date(reg.registrationDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-admin success">CONFIRMED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-5 text-muted">
            {searchQuery ? "No matches found for your search." : "No students have registered for this webinar yet."}
          </div>
        )}
      </div>

      <style>{`
        .admin-avatar {
          width: 36px;
          height: 36px;
          background: #7c3aed;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .admin-search-input { width: 100%; appearance: none; -webkit-appearance: none; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 0.75rem 1rem 0.75rem 2.5rem; color: #f8fafc; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
        .admin-search-input:focus { border-color: #7c3aed; }
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #64748b; pointer-events: none; }
        .search-wrapper { position: relative; width: 100%; }
        .badge-admin.success { background: rgba(16, 185, 129, 0.15); color: #10b981; }
      `}</style>
    </div>
  );
};

export default AdminUsers;
