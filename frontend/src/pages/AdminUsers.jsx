import { useState, useEffect } from 'react';
import { 
  Users, Search, Download, Mail, Calendar, Filter, 
  CheckCircle, Clock, ArrowRight, UserCheck, Shield, ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Admin.css';

const AdminUsers = () => {
  const [webinars, setWebinars] = useState([]);
  const [selectedWebinarId, setSelectedWebinarId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWebinars, setLoadingWebinars] = useState(true);
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
      toast.error('Failed to load webinar index');
    } finally {
      setLoadingWebinars(false);
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
      toast.error('Could not retrieve attendees');
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
    a.download = `Attendees_${selectedWebinar?.title.replace(/ /g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Attendee report exported');
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-users animate-fade-in">
       {/* Page Header */}
       <div className="admin-page-header">
        <div className="breadcrumbs">
          <span className="breadcrumb-item">Admin</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item text-white">Student Hub</span>
        </div>
        <div className="admin-page-title-row">
          <div>
            <h1 className="admin-page-title">Growth Analytics</h1>
            <p className="admin-page-subtitle">Track registrants, engagement metrics, and audience demographics.</p>
          </div>
          {selectedWebinarId && registrations.length > 0 && (
            <button onClick={exportCSV} className="btn-admin-primary d-flex align-items-center gap-2">
              <Download size={18} />
              <span>Export CSV Report</span>
            </button>
          )}
        </div>
      </div>

      <div className="admin-page-content">
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="premium-card p-3 h-100 flex items-center bg-slate-900 border-slate-800">
               <div className="search-wrapper flex-grow-1 position-relative">
                  <Filter size={20} className="search-icon-table" />
                  <select 
                    className="premium-input ps-5 appearance-none bg-transparent" 
                    value={selectedWebinarId}
                    onChange={(e) => setSelectedWebinarId(e.target.value)}
                  >
                    <option value="">-- Targeted Webinar --</option>
                    {webinars.map(w => (
                      <option key={w.id} value={w.id}>{w.title} ({new Date(w.dateTime).toLocaleDateString()})</option>
                    ))}
                  </select>
                  <ChevronDown className="position-absolute end-4 top-50 translate-middle-y opacity-30" size={18} />
               </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="premium-card p-3 h-100 flex items-center bg-slate-900 border-slate-800">
              <div className="search-wrapper flex-grow-1 position-relative">
                <Search size={20} className="search-icon-table" />
                <input 
                  type="text" 
                  placeholder="Instant student lookup..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="premium-input ps-5 w-full"
                  disabled={!selectedWebinarId}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="premium-table-container min-vh-50">
          {loading ? (
            <div className="p-5">
               {[1,2,3,4].map(i => <div key={i} className="skeleton h-16 w-full mb-3 rounded-xl"></div>)}
               <p className="text-center text-slate-500 mt-4">Synthesizing audience data...</p>
            </div>
          ) : !selectedWebinarId ? (
            <div className="text-center p-5 opacity-40 d-flex flex-column align-items-center justify-center py-24">
              <div className="p-5 bg-violet-900/10 rounded-full mb-4 ring-1 ring-violet-500/20">
                <UserCheck size={64} className="text-violet-500" />
              </div>
              <h3 className="fs-3 fw-bold text-slate-300">Audience Selection</h3>
              <p className="text-slate-500 max-w-sm">Please select a session from the dropdown above to analyze student participation and registration metrics.</p>
            </div>
          ) : filteredRegistrations.length > 0 ? (
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Student Profile</th>
                    <th>Email Address</th>
                    <th>Registration Date</th>
                    <th>Engagement Status</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="admin-avatar-lg">
                            {reg.userName.charAt(0)}
                          </div>
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-white fs-6">{reg.userName}</span>
                            <span className="small opacity-50">ID: {reg.id.toString().slice(-4)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2 text-slate-300">
                          <Mail size={16} className="text-violet-400 opacity-60" />
                          <span>{reg.userEmail}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2 text-slate-300">
                          <Calendar size={16} className="text-emerald-400 opacity-60" />
                          <span>{new Date(reg.registrationDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-premium badge-green">VERIFIED</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1 text-slate-400 small">
                           <Shield size={14} /> Student
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-5 opacity-40 py-24">
               <Users size={48} className="mx-auto mb-3" />
               <p className="fs-4 fw-bold">{searchQuery ? "Student Not Found" : "No Registrations Recorded"}</p>
               <p className="small">We couldn't find any results matching your current filters.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-avatar-lg {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #7c3aed, #4c1d95);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .min-vh-50 { min-height: 50vh; }
      `}</style>
    </div>
  );
};

export default AdminUsers;
