import { useState, useEffect } from 'react';
import { 
  FileUp, 
  Trash2, 
  Plus, 
  Search, 
  ExternalLink, 
  FileText, 
  Layout, 
  Video, 
  AlertCircle 
} from 'lucide-react';

const AdminResources = () => {
  const [webinars, setWebinars] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedWebinarId, setSelectedWebinarId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    fileType: 'PDF',
    fileUrl: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWebinars();
  }, []);

  useEffect(() => {
    if (selectedWebinarId) {
      fetchResources(selectedWebinarId);
    } else {
      setResources([]);
    }
  }, [selectedWebinarId]);

  const fetchWebinars = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/webinars`);
      if (resp.ok) {
        const data = await resp.json();
        const completed = data.filter(w => w.status === 'COMPLETED');
        setWebinars(completed);
      }
    } catch (err) {
      console.error('Error fetching webinars:', err);
    }
  };

  const fetchResources = async (id) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resources/webinar/${id}`);
      if (resp.ok) {
        setResources(await resp.json());
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWebinarId) return;

    setLoading(true);
    try {
      const { user } = JSON.parse(localStorage.getItem('webinarhub_user') || '{}');
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/resources`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify({ ...formData, webinarId: selectedWebinarId })
      });

      if (resp.ok) {
        setFormData({ title: '', fileType: 'PDF', fileUrl: '', description: '' });
        fetchResources(selectedWebinarId);
      }
    } catch (err) {
      console.error('Error adding resource:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { user } = JSON.parse(localStorage.getItem('webinarhub_user') || '{}');
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/resources/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.id}` }
      });

      if (resp.ok) {
        fetchResources(selectedWebinarId);
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
    }
  };

  const getResourceTypeIcon = (type) => {
    switch(type) {
      case 'PDF': return <FileText size={20} />;
      case 'SLIDE': return <Layout size={20} />;
      case 'VIDEO': return <Video size={20} />;
      case 'LINK': return <ExternalLink size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <div className="admin-resources animate-fade-in">
      <div className="admin-title-section">
        <h1 className="admin-title">Resource Manager</h1>
        <p className="admin-subtitle">Attach learning materials to completed webinars</p>
      </div>

      <div className="row g-4">
        {/* Step 1: Select Webinar */}
        <div className="col-lg-4">
          <div className="admin-card">
            <h3 className="card-title-admin mb-3 d-flex align-items-center gap-2">
              <Search size={20} className="color-primary" />
              1. Select Webinar
            </h3>
            <select 
              className="admin-input mb-2" 
              value={selectedWebinarId}
              onChange={(e) => setSelectedWebinarId(e.target.value)}
            >
              <option value="">-- Choose Completed Webinar --</option>
              {webinars.map(w => (
                <option key={w.id} value={w.id}>{w.title}</option>
              ))}
            </select>
            <p className="small-text mt-2">
              <AlertCircle size={14} className="me-1" />
              Only completed webinars can have resources.
            </p>
          </div>

          {/* Add Resource Form */}
          {selectedWebinarId && (
            <div className="admin-card animate-slide-up mt-4">
              <h3 className="card-title-admin mb-3 d-flex align-items-center gap-2">
                <FileUp size={20} className="color-success" />
                2. Add Resource
              </h3>
              <form onSubmit={handleSubmit} className="modal-form-admin">
                <div className="mb-3">
                  <label className="admin-label">Resource Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Master Slides"
                    className="admin-input" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="admin-label">Type</label>
                  <select 
                    className="admin-input"
                    value={formData.fileType}
                    onChange={(e) => setFormData({...formData, fileType: e.target.value})}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="SLIDE">Slides Presentation</option>
                    <option value="VIDEO">Video Recording</option>
                    <option value="LINK">External Link</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="admin-label">Resource URL</label>
                  <input 
                    type="url" 
                    required 
                    placeholder="https://..."
                    className="admin-input" 
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="admin-label">Short Description</label>
                  <textarea 
                    rows="2" 
                    className="admin-input" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" disabled={loading} className="btn-admin-primary w-100 d-flex align-items-center justify-content-center gap-2">
                  <Plus size={18} />
                  {loading ? 'Adding...' : 'Attach Resource'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* List Resources */}
        <div className="col-lg-8">
          <div className="admin-card min-vh-50">
            <h3 className="card-title-admin mb-3 d-flex align-items-center gap-2">
              <FileText size={20} className="color-accent" />
              Attached Resources
            </h3>
            
            {!selectedWebinarId ? (
              <div className="text-center p-5">
                <div className="p-4 bg-slate-800 rounded-circle mb-3 d-inline-block">
                  <Layout size={48} className="text-slate-600" />
                </div>
                <p className="text-muted">Select a webinar to view and manage its resources.</p>
              </div>
            ) : resources.length > 0 ? (
              <div className="resource-list-admin">
                {resources.map(res => (
                  <div key={res.id} className="resource-item-admin d-flex justify-content-between align-items-center p-3 mb-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="d-flex align-items-center gap-3">
                      <div className={`resource-icon-box ${res.fileType.toLowerCase()}`}>
                        {getResourceTypeIcon(res.fileType)}
                      </div>
                      <div className="d-flex flex-column">
                        <span className="fw-bold fs-5">{res.title}</span>
                        <span className="small-text">{res.fileUrl}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <a href={res.fileUrl} target="_blank" rel="noreferrer" className="btn-icon-admin edit" title="Preview">
                        <ExternalLink size={16} />
                      </a>
                      <button onClick={() => handleDelete(res.id)} className="btn-icon-admin delete" title="Remove">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-5 text-muted">No resources attached to this webinar yet.</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .bg-slate-900 { background: #0f172a; }
        .bg-slate-800 { background: #1e293b; }
        .border-slate-800 { border-color: #1e293b; }
        .text-slate-600 { color: #475569; }
        .color-success { color: #10b981; }
        .color-accent { color: #a78bfa; }
        .resource-icon-box { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .resource-icon-box.pdf { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
        .resource-icon-box.slide { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .resource-icon-box.video { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
        .resource-icon-box.link { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .resource-item-admin { transition: all 0.2s; }
        .resource-item-admin:hover { border-color: #334155; transform: translateX(5px); }
        .min-vh-50 { min-height: 50vh; }
      `}</style>
    </div>
  );
};

export default AdminResources;
