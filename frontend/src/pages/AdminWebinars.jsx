import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users, 
  FileUp, 
  CheckCircle, 
  Clock, 
  Play,
  X,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminWebinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentWebinar, setCurrentWebinar] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    dateTime: '',
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
        const data = await resp.json();
        setWebinars(data);
      }
    } catch (err) {
      console.error('Error fetching webinars:', err);
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
      dateTime: '',
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
    // Format date for datetime-local input
    const date = new Date(webinar.dateTime);
    const formattedDate = date.toISOString().slice(0, 16);
    
    setFormData({
      title: webinar.title,
      description: webinar.description,
      instructor: webinar.instructor,
      dateTime: formattedDate,
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
    const url = currentWebinar 
      ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/webinars/${currentWebinar.id}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/admin/webinars`;
    
    const method = currentWebinar ? 'PUT' : 'POST';
    const { user } = JSON.parse(localStorage.getItem('webinarhub_user') || '{}');

    try {
      const resp = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify(formData)
      });

      if (resp.ok) {
        setShowModal(false);
        fetchWebinars();
      }
    } catch (err) {
      console.error('Error saving webinar:', err);
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
        setShowDeleteConfirm(false);
        fetchWebinars();
      }
    } catch (err) {
      console.error('Error deleting webinar:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'LIVE': return <span className="badge-admin live">LIVE</span>;
      case 'UPCOMING': return <span className="badge-admin upcoming">UPCOMING</span>;
      case 'COMPLETED': return <span className="badge-admin completed">COMPLETED</span>;
      default: return <span className="badge-admin cancelled">CANCELLED</span>;
    }
  };

  const filteredWebinars = webinars.filter(w => 
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-webinars-page animate-fade-in">
      <div className="admin-title-section d-flex justify-content-between align-items-center">
        <div>
          <h1 className="admin-title">Manage Webinars</h1>
          <p className="admin-subtitle">Create, monitor and maintain all webinar sessions</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn-admin-primary d-flex align-items-center gap-2">
          <Plus size={20} />
          Create New Webinar
        </button>
      </div>

      <div className="admin-filters-bar d-flex gap-3 mb-4">
        <div className="search-wrapper flex-grow-1">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by title or instructor..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>
      </div>

      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table table align-middle">
            <thead>
              <tr>
                <th>Webinar Title</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWebinars.length > 0 ? filteredWebinars.map((webinar) => (
                <tr key={webinar.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      {webinar.coverImageUrl && (
                        <img src={webinar.coverImageUrl} alt="" className="admin-thumb" />
                      )}
                      <span className="fw-bold">{webinar.title}</span>
                    </div>
                  </td>
                  <td>{webinar.instructor}</td>
                  <td>
                    <div className="d-flex flex-column">
                      <span>{new Date(webinar.dateTime).toLocaleDateString()}</span>
                      <span className="small-detail">{new Date(webinar.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(webinar.status)}</td>
                  <td className="text-center">{webinar.registeredCount || 0}</td>
                  <td>
                    <div className="admin-actions d-flex gap-2">
                      <button onClick={() => handleOpenEditModal(webinar)} className="btn-icon-admin edit" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => { setCurrentWebinar(webinar); setShowDeleteConfirm(true); }} className="btn-icon-admin delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center p-5">No webinars found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Create/Edit */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal animate-slide-up">
            <div className="modal-header-admin">
              <h2>{currentWebinar ? 'Edit Webinar' : 'Create New Webinar'}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn-admin"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form-admin">
              <div className="row g-3">
                <div className="col-12">
                  <label className="admin-label">Webinar Title</label>
                  <input 
                    type="text" 
                    required 
                    className="admin-input" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Instructor Name</label>
                  <input 
                    type="text" 
                    required 
                    className="admin-input" 
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Category</label>
                  <select 
                    className="admin-input"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Development</option>
                    <option>Design</option>
                    <option>AI</option>
                    <option>Cloud</option>
                    <option>Security</option>
                    <option>Data</option>
                    <option>Web3</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required 
                    className="admin-input" 
                    value={formData.dateTime}
                    onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Duration (minutes)</label>
                  <input 
                    type="number" 
                    required 
                    className="admin-input" 
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Max Participants</label>
                  <input 
                    type="number" 
                    required 
                    className="admin-input" 
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Status</label>
                  <select 
                    className="admin-input"
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
                  <label className="admin-label">Thumbnail URL</label>
                  <input 
                    type="url" 
                    className="admin-input" 
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData({...formData, coverImageUrl: e.target.value})}
                  />
                </div>
                <div className="col-12">
                  <label className="admin-label">Meeting URL</label>
                  <input 
                    type="url" 
                    className="admin-input" 
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({...formData, streamUrl: e.target.value})}
                  />
                </div>
                <div className="col-12">
                  <label className="admin-label">Description</label>
                  <textarea 
                    rows="3" 
                    required 
                    className="admin-input" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer-admin mt-4 d-flex justify-content-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-admin-secondary">Cancel</button>
                <button type="submit" className="btn-admin-primary">Save Webinar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal confirm-modal animate-slide-up">
            <div className="confirm-icon-admin"><AlertTriangle size={36} /></div>
            <h2>Delete Webinar?</h2>
            <p className="text-center mb-4">Are you sure you want to delete <strong>{currentWebinar?.title}</strong>? This action cannot be undone and will remove all registrations.</p>
            <div className="d-flex justify-content-center gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-admin-secondary">Cancel</button>
              <button onClick={handleDelete} className="btn-admin-danger">Permanently Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-thumb { width: 48px; height: 32px; border-radius: 4px; object-fit: cover; background: #1e293b; }
        .small-detail { font-size: 0.75rem; color: #64748b; }
        .admin-actions .btn-icon-admin { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #1e293b; color: #94a3b8; display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: transparent; }
        .btn-icon-admin.edit:hover { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border-color: #3b82f6; }
        .btn-icon-admin.delete:hover { background: rgba(239, 68, 68, 0.15); color: #ef4444; border-color: #ef4444; }
        /* Modal Styles */
        .admin-modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 2rem; }
        .admin-modal { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; width: 100%; max-width: 650px; padding: 2rem; max-height: 90vh; overflow-y: auto; }
        .admin-modal.confirm-modal { max-width: 400px; text-align: center; }
        .modal-header-admin { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .modal-header-admin h2 { margin: 0; font-size: 1.5rem; color: #f8fafc; font-weight: 800; }
        .close-btn-admin { background: transparent; border: none; color: #94a3b8; cursor: pointer; transition: color 0.2s; }
        .close-btn-admin:hover { color: #f8fafc; }
        .admin-label { display: block; font-size: 0.85rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.5rem; }
        .admin-input { width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 0.75rem 1rem; color: #f8fafc; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
        .admin-input:focus { border-color: #7c3aed; }
        .btn-admin-secondary { background: transparent; border: 1px solid #334155; color: #f8fafc; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .btn-admin-danger { background: #ef4444; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .confirm-icon-admin { color: #f59e0b; margin-bottom: 1.5rem; }
        .badge-admin.upcoming { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .badge-admin.live { background: rgba(239, 68, 68, 0.15); color: #ef4444; font-weight: 800; }
        .badge-admin.completed { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .badge-admin.cancelled { background: rgba(100, 116, 139, 0.15); color: #64748b; }
      `}</style>
    </div>
  );
};

export default AdminWebinars;
