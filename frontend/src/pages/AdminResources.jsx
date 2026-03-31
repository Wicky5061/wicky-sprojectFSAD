import { useState, useEffect } from 'react';
import { 
  FileUp, Trash2, Plus, Search, ExternalLink, FileText, 
  Layout, Video, AlertCircle, RefreshCw, Layers, Calendar, ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Admin.css';

const AdminResources = () => {
  const [webinars, setWebinars] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedWebinarId, setSelectedWebinarId] = useState('');
  const [loadingWebinars, setLoadingWebinars] = useState(true);
  const [loadingResources, setLoadingResources] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    fileType: 'PDF',
    fileUrl: '',
    description: ''
  });

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
    setLoadingWebinars(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/webinars`);
      if (resp.ok) {
        const data = await resp.json();
        const completed = data.filter(w => w.status === 'COMPLETED');
        setWebinars(completed);
      } else {
        toast.error('Could not load completed webinars');
      }
    } catch (err) {
      toast.error('Network error while fetching webinars');
    } finally {
      setLoadingWebinars(false);
    }
  };

  const fetchResources = async (id) => {
    setLoadingResources(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resources/webinar/${id}`);
      if (resp.ok) {
        setResources(await resp.json());
      }
    } catch (err) {
      toast.error('Failed to load resources for this webinar');
    } finally {
      setLoadingResources(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWebinarId) return;

    setSaving(true);
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
        toast.success('Resource attached successfully!');
        setFormData({ title: '', fileType: 'PDF', fileUrl: '', description: '' });
        fetchResources(selectedWebinarId);
      } else {
        toast.error('Failed to attach resource');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setSaving(false);
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
        toast.success('Resource removed');
        fetchResources(selectedWebinarId);
      }
    } catch (err) {
      toast.error('Deletion failed');
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
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="breadcrumbs">
          <span className="breadcrumb-item">Admin</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item text-white">Resource Center</span>
        </div>
        <div className="admin-page-title-row">
          <div>
            <h1 className="admin-page-title text-violet-100">Learning Materials</h1>
            <p className="admin-page-subtitle">Upload and link educational assets to completed webinar sessions</p>
          </div>
          <button onClick={fetchWebinars} className="nav-icon-btn border border-slate-700 bg-slate-800 text-white p-3 hover:bg-slate-700">
            <RefreshCw size={20} className={loadingWebinars ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="admin-page-content">
        <div className="row g-5">
          {/* LEFT: Selection & Form */}
          <div className="col-lg-5">
            <div className="premium-card mb-4 bg-gradient-to-br from-slate-900 to-slate-950">
              <h3 className="card-title-admin mb-4 d-flex align-items-center gap-3 fs-5">
                <div className="p-2 bg-violet-600 rounded-lg"><Search size={22} className="text-white" /></div>
                Target Webinar
              </h3>
              
              <div className="premium-form-group">
                <label className="premium-label">Select Completed Webinar</label>
                <div className="relative">
                  {loadingWebinars ? (
                     <div className="skeleton h-12 w-full"></div>
                  ) : (
                    <select 
                      className="premium-input d-block w-full appearance-none bg-slate-800" 
                      value={selectedWebinarId}
                      onChange={(e) => setSelectedWebinarId(e.target.value)}
                    >
                      <option value="">-- Choose Webinar --</option>
                      {webinars.map(w => (
                        <option key={w.id} value={w.id}>{w.title} ({new Date(w.dateTime).toLocaleDateString()})</option>
                      ))}
                    </select>
                  )}
                </div>
                {!loadingWebinars && webinars.length === 0 && (
                   <p className="small text-warning mt-2 d-flex align-items-center gap-2">
                     <AlertCircle size={14} /> No completed webinars found to attach resources.
                   </p>
                )}
              </div>
            </div>

            {selectedWebinarId && (
              <div className="premium-card animate-fade-in bg-gradient-to-br from-violet-900/20 to-transparent border-violet-500/30">
                <h3 className="card-title-admin mb-4 d-flex align-items-center gap-3 fs-5">
                  <div className="p-2 bg-emerald-600 rounded-lg"><FileUp size={22} className="text-white" /></div>
                  Attach Material
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="premium-form-group">
                    <label className="premium-label">Resource Title</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Master Class Deep-dive Slides"
                      className="premium-input bg-slate-800 border-slate-700" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="premium-label">Type</label>
                      <select 
                        className="premium-input bg-slate-800 border-slate-700"
                        value={formData.fileType}
                        onChange={(e) => setFormData({...formData, fileType: e.target.value})}
                      >
                        <option value="PDF">PDF Document</option>
                        <option value="SLIDE">Slides Presentation</option>
                        <option value="VIDEO">Video Recording</option>
                        <option value="LINK">External Link</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="premium-label">Material URL</label>
                      <input 
                        type="url" 
                        required 
                        placeholder="https://..."
                        className="premium-input bg-slate-800 border-slate-700" 
                        value={formData.fileUrl}
                        onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="premium-form-group mt-2">
                    <label className="premium-label">Detailed Notes (Optional)</label>
                    <textarea 
                      rows="3" 
                      className="premium-input bg-slate-800 border-slate-700" 
                      placeholder="Key takeaways from this resource..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" disabled={saving} className="btn-admin-primary w-100 py-3 mt-2 d-flex align-items-center justify-content-center gap-2">
                    {saving ? <div className="spinner-border spinner-border-sm"></div> : <><Plus size={20} /> Attach Resource</>}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT: List Content */}
          <div className="col-lg-7">
            <div className="premium-card min-vh-75 h-100 border-dashed border-slate-800 bg-transparent flex flex-col">
              <h3 className="card-title-admin mb-4 d-flex align-items-center gap-3 fs-5">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Layers size={22} /></div>
                Vault Repository
              </h3>
              
              {!selectedWebinarId ? (
                <div className="flex-1 d-flex flex-column items-center justify-center text-center p-5 opacity-40">
                  <div className="p-5 bg-slate-900 rounded-full mb-4 border border-slate-800 shadow-2xl">
                    <Layout size={64} className="text-slate-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-300">Vault Empty</h4>
                  <p className="text-slate-400 max-w-sm">Select a finalized webinar on the left to browse and manage high-quality student materials.</p>
                </div>
              ) : loadingResources ? (
                <div className="p-4">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-24 w-full mb-3 rounded-2xl"></div>)}
                </div>
              ) : resources.length > 0 ? (
                <div className="resource-list-premium d-flex flex-column gap-3 overflow-y-auto pr-2 custom-scrollbar">
                  {resources.map(res => (
                    <div key={res.id} className="resource-tile-admin d-flex justify-content-between align-items-center p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-all">
                      <div className="d-flex align-items-center gap-4">
                        <div className={`resource-glyph-box ${res.fileType.toLowerCase()}`}>
                          {getResourceTypeIcon(res.fileType)}
                        </div>
                        <div className="d-flex flex-column">
                          <span className="fw-bold text-white fs-5">{res.title}</span>
                          <span className="small text-slate-500 hover:text-violet-400 cursor-pointer d-flex gap-1 items-center mt-1">
                            <Calendar size={12} /> {new Date().toLocaleDateString()} • {res.fileType}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <a href={res.fileUrl} target="_blank" rel="noreferrer" className="nav-icon-btn border hover:bg-emerald-600/20 hover:text-emerald-400" title="Open Link">
                          <ExternalLink size={18} />
                        </a>
                        <button onClick={() => handleDelete(res.id)} className="nav-icon-btn border border-rose-500/30 text-rose-500 hover:bg-rose-600 hover:text-white" title="Trash Material">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 d-flex flex-column items-center justify-center text-center p-5 opacity-40">
                   <AlertCircle size={40} className="mb-3" />
                   <p className="fs-5 font-bold">No assets found</p>
                   <p className="small">Begin uploading materials to support your students' growth.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .min-vh-75 { min-height: 75vh; }
        .resource-glyph-box { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1px solid rgba(255,255,255,0.05); }
        .resource-glyph-box.pdf { background: rgba(244, 63, 94, 0.15); color: #fb7185; }
        .resource-glyph-box.slide { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .resource-glyph-box.video { background: rgba(139, 92, 246, 0.15); color: #a78bfa; }
        .resource-glyph-box.link { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .resource-tile-admin { transform-origin: left center; }
        .resource-tile-admin:hover { transform: scale(1.02); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminResources;
