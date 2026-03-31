import { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Users, FileUp, CheckCircle, 
  Clock, Play, X, AlertTriangle, Calendar, Filter, MoreVertical,
  ChevronRight, ExternalLink, Download, ArrowUpDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Admin.css';

const AdminWebinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentWebinar, setCurrentWebinar] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State with split date and time
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    date: '',
    time: '',
    durationMinutes: 60,
    category: 'Development',
    maxParticipants: 100,
    status: 'UPCOMING',
    coverImageUrl: '',
    streamUrl: ''
  });

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/webinars`);
      if (resp.ok) {
        setWebinars(await resp.json());
      }
    } catch (err) {
      toast.error('Failed to load webinars');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setCurrentWebinar(null);
    setFormData({
      title: '',
      description: '',
      instructor: '',
      date: '',
      time: '',
      durationMinutes: 60,
      category: 'Development',
      maxParticipants: 100,
      status: 'UPCOMING',
      coverImageUrl: '',
      streamUrl: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (webinar) => {
    setCurrentWebinar(webinar);
    const dt = new Date(webinar.dateTime);
    // Properly format for inputs
    const dateStr = dt.toISOString().split('T')[0];
    const timeStr = dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    setFormData({
      title: webinar.title,
      description: webinar.description,
      instructor: webinar.instructor,
      date: dateStr,
      time: timeStr,
      durationMinutes: webinar.durationMinutes,
      category: webinar.category || 'Development',
      maxParticipants: webinar.maxParticipants,
      status: webinar.status,
      coverImageUrl: webinar.coverImageUrl || '',
      streamUrl: webinar.streamUrl || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const url = currentWebinar 
      ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/webinars/${currentWebinar.id}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/admin/webinars`;
    
    const method = currentWebinar ? 'PUT' : 'POST';
    const { user } = JSON.parse(localStorage.getItem('webinarhub_user') || '{}');

    // Combine date and time
    const combinedDateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString();

    const payload = {
      ...formData,
      dateTime: combinedDateTime
    };

    try {
      const resp = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        toast.success(currentWebinar ? 'Webinar updated successfully!' : 'Webinar created successfully!');
        setShowModal(false);
        fetchWebinars();
      } else {
        toast.error('Failed to save webinar. Check credentials.');
      }
    } catch (err) {
      toast.error('Network error. Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { user } = JSON.parse(localStorage.getItem('webinarhub_user') || '{}');
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/webinars/${currentWebinar.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.id}` }
      });

      if (resp.ok) {
        toast.success('Webinar deleted permanently');
        setShowDeleteConfirm(false);
        fetchWebinars();
      }
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'LIVE': return <span className="badge-premium badge-red animate-pulse">LIVE</span>;
      case 'UPCOMING': return <span className="badge-premium badge-blue">UPCOMING</span>;
      case 'COMPLETED': return <span className="badge-premium badge-purple">COMPLETED</span>;
      default: return <span className="badge-premium badge-purple opacity-50">CANCELLED</span>;
    }
  };

  const filteredWebinars = webinars.filter(w => 
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-page-header animate-fade-in">
        <div className="skeleton-title skeleton mb-4"></div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="premium-card h-24 mb-3 flex items-center gap-4">
              <div className="skeleton-avatar skeleton"></div>
              <div className="flex-1">
                <div className="skeleton-text skeleton w-1/2"></div>
                <div className="skeleton-text skeleton w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-webinars-page animate-fade-in">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="breadcrumbs">
          <span className="breadcrumb-item">Admin</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item text-white">Webinars</span>
        </div>
        <div className="admin-page-title-row">
          <div>
            <h1 className="admin-page-title">Manage Webinars</h1>
            <p className="admin-page-subtitle">Create, monitor and maintain all webinar sessions</p>
          </div>
          <button onClick={handleOpenAddModal} className="btn-admin-primary d-flex align-items-center gap-2">
            <Plus size={20} />
            <span>Create Webinar</span>
          </button>
        </div>
      </div>

      {/* Filters Table Card */}
      <div className="admin-page-content">
        <div className="premium-table-container">
          <div className="table-header-actions">
            <div className="search-wrapper position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
              <Search size={18} className="search-icon-table" />
              <input 
                type="text" 
                placeholder="Search by title, instructor..." 
                className="premium-input ps-5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2">
              <button className="nav-icon-btn border"><Filter size={18} /></button>
              <button className="nav-icon-btn border"><Download size={18} /></button>
              <button className="btn-admin-primary px-3"><ArrowUpDown size={18} /></button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Webinar Details</th>
                  <th>Instructor</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th>Audience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWebinars.length > 0 ? filteredWebinars.map((webinar) => (
                  <tr key={webinar.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="webinar-thumb-wrapper overflow-hidden rounded-lg bg-slate-800" style={{ width: '64px', height: '40px' }}>
                          <img src={webinar.coverImageUrl || 'https://via.placeholder.com/64x40'} alt="" className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fw-bold text-white fs-6">{webinar.title}</span>
                          <span className="small opacity-50">{webinar.category}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-slate-200">{webinar.instructor}</span>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-medium text-slate-200">{new Date(webinar.dateTime).toLocaleDateString()}</span>
                        <span className="small opacity-50">{new Date(webinar.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(webinar.status)}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Users size={14} className="text-violet-400" />
                        <span className="fw-bold">{webinar.registeredCount || 0}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={() => handleOpenEditModal(webinar)} className="nav-icon-btn border hover:bg-violet-500">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => { setCurrentWebinar(webinar); setShowDeleteConfirm(true); }} className="nav-icon-btn border hover:bg-rose-500 text-rose-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center p-5">
                      <div className="opacity-30 mb-3"><Video size={48} className="mx-auto" /></div>
                      <p className="text-slate-400">No webinars found matching your search criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modern Modal Overlay */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="premium-card w-full max-w-3xl animate-fade-in p-0 overflow-visible" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header-admin p-4 border-b border-slate-800 d-flex justify-content-between align-items-center bg-slate-900 rounded-t-[20px]">
              <h2 className="text-xl font-bold mb-0">{currentWebinar ? 'Edit Webinar Details' : 'Initialize New Webinar'}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn-admin opacity-60 hover:opacity-100"><X size={24} /></button>
            </div>
            
            <div className="modal-body-scrollable p-4 overflow-y-auto">
              <form onSubmit={handleSubmit} className="premium-form">
                <div className="row g-4">
                  <div className="col-12">
                    <label className="premium-label">Webinar Title</label>
                    <input 
                      type="text" 
                      required 
                      className="premium-input" 
                      placeholder="e.g., Advanced Microservices with Spring Boot"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="premium-label">Lead Instructor</label>
                    <input 
                      type="text" 
                      required 
                      className="premium-input" 
                      value={formData.instructor}
                      onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="premium-label">Category</label>
                    <select 
                      className="premium-input d-block w-100"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {['Development', 'Design', 'AI', 'Cloud', 'Security', 'Data', 'Web3'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  
                  {/* Split Date & Time Inputs */}
                  <div className="col-md-6">
                    <label className="premium-label">Scheduled Date</label>
                    <input 
                      type="date" 
                      required 
                      className="premium-input" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="premium-label">Start Time</label>
                    <input 
                      type="time" 
                      required 
                      className="premium-input" 
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="premium-label">Duration (minutes)</label>
                    <input 
                      type="number" 
                      required 
                      className="premium-input" 
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="premium-label">Status</label>
                    <select 
                      className="premium-input"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="LIVE">LIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="premium-label">Cover Image URL</label>
                    <input 
                      type="url" 
                      className="premium-input" 
                      placeholder="https://images.unsplash.com/..."
                      value={formData.coverImageUrl}
                      onChange={(e) => setFormData({...formData, coverImageUrl: e.target.value})}
                    />
                  </div>
                  <div className="col-12">
                    <label className="premium-label">Broadcast/Meeting URL</label>
                    <input 
                      type="url" 
                      className="premium-input" 
                      placeholder="https://zoom.us/j/..."
                      value={formData.streamUrl}
                      onChange={(e) => setFormData({...formData, streamUrl: e.target.value})}
                    />
                  </div>
                  <div className="col-12">
                    <label className="premium-label">Description & Syllabus</label>
                    <textarea 
                      rows="4" 
                      required 
                      className="premium-input" 
                      placeholder="Outline what students will learn..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                
                <div className="modal-footer-admin p-4 border-t border-slate-800 d-flex justify-content-end gap-3 bg-slate-900 rounded-b-[20px] mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-admin-secondary px-5 bg-transparent border-slate-700">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-admin-primary px-5 d-flex align-items-center gap-2">
                    {saving ? <div className="spinner-border spinner-border-sm" role="status"></div> : (currentWebinar ? 'Update Session' : 'Create Webinar')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="admin-modal-overlay">
          <div className="premium-card max-w-md animate-fade-in text-center p-5">
            <div className="confirm-icon mb-4"><AlertTriangle size={64} className="text-rose-500 mx-auto" /></div>
            <h2 className="text-2xl font-bold mb-3">Delete Webinar?</h2>
            <p className="text-slate-400 mb-5">This will permanently remove <strong>{currentWebinar?.title}</strong> and all associated registrations. This action is IRREVERSIBLE.</p>
            <div className="d-flex justify-content-center gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-admin-secondary flex-1 border-slate-700 bg-transparent py-3">No, Cancel</button>
              <button 
                onClick={handleDelete} 
                className="btn-admin-danger flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3 border-0"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .search-icon-table { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: #64748b; }
        .modal-body-scrollable { scrollbar-width: thin; scrollbar-color: #334155 #0f172a; }
        .btn-admin-primary { background: #7c3aed; color: white; border: none; border-radius: 12px; font-weight: 700; transition: all 0.2s; padding: 0.75rem 1.5rem; }
        .btn-admin-primary:hover { background: #6d28d9; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4); }
        .btn-admin-secondary { border-radius: 12px; font-weight: 600; padding: 0.75rem; border: 1px solid #1e293b; color: white; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
      `}</style>
    </div>
  );
};

export default AdminWebinars;
