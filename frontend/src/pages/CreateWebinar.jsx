import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { webinarAPI } from '../services/api';
import './CreateWebinar.css';

/**
 * Create/Edit Webinar Page — Admin form for webinar management.
 * Demonstrates: @RequestBody, form handling, conditional create/update.
 */
export default function CreateWebinar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    instructor: '',
    dateTime: '',
    durationMinutes: 60,
    streamUrl: '',
    coverImageUrl: '',
    maxParticipants: 100,
    category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadWebinar();
    }
  }, [id]);

  const loadWebinar = async () => {
    try {
      const res = await webinarAPI.getById(id);
      const w = res.data;
      setForm({
        title: w.title || '',
        description: w.description || '',
        instructor: w.instructor || '',
        dateTime: w.dateTime ? w.dateTime.substring(0, 16) : '',
        durationMinutes: w.durationMinutes || 60,
        streamUrl: w.streamUrl || '',
        coverImageUrl: w.coverImageUrl || '',
        maxParticipants: w.maxParticipants || 100,
        category: w.category || '',
      });
    } catch (err) {
      setError('Failed to load webinar data.');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? parseInt(value) || '' : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.instructor || !form.dateTime) {
      setError('Title, description, instructor, and date are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };
      if (isEdit) {
        await webinarAPI.update(id, payload);
      } else {
        await webinarAPI.create(payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} webinar.`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading webinar data...</p>
      </div>
    );
  }

  return (
    <div className="page container" id="create-webinar-page">
      <div className="create-form-wrapper animate-fade-in">
        <div className="page-header">
          <h1>{isEdit ? 'Edit Webinar' : 'Create Webinar'}</h1>
          <p>{isEdit ? 'Update webinar details' : 'Fill in the details to create a new webinar'}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="create-form glass" id="webinar-form">
          <div className="form-group">
            <label className="form-label" htmlFor="wf-title">Title *</label>
            <input
              type="text"
              id="wf-title"
              name="title"
              className="form-input"
              placeholder="e.g. Introduction to React Hooks"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="wf-description">Description *</label>
            <textarea
              id="wf-description"
              name="description"
              className="form-textarea"
              placeholder="Describe what attendees will learn..."
              rows={5}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="wf-instructor">Instructor *</label>
              <input
                type="text"
                id="wf-instructor"
                name="instructor"
                className="form-input"
                placeholder="Instructor name"
                value={form.instructor}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wf-category">Category</label>
              <input
                type="text"
                id="wf-category"
                name="category"
                className="form-input"
                placeholder="e.g. Web Development"
                value={form.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="wf-datetime">Date & Time *</label>
              <input
                type="datetime-local"
                id="wf-datetime"
                name="dateTime"
                className="form-input"
                value={form.dateTime}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wf-duration">Duration (minutes)</label>
              <input
                type="number"
                id="wf-duration"
                name="durationMinutes"
                className="form-input"
                min="15"
                max="480"
                value={form.durationMinutes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="wf-max">Max Participants</label>
              <input
                type="number"
                id="wf-max"
                name="maxParticipants"
                className="form-input"
                min="1"
                value={form.maxParticipants}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="wf-stream">Stream / Meeting URL</label>
              <input
                type="url"
                id="wf-stream"
                name="streamUrl"
                className="form-input"
                placeholder="https://zoom.us/..."
                value={form.streamUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="wf-cover">Cover Image URL</label>
            <input
              type="url"
              id="wf-cover"
              name="coverImageUrl"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={form.coverImageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              id="submit-webinar"
              disabled={loading}
            >
              {loading
                ? (isEdit ? 'Updating...' : 'Creating...')
                : (isEdit ? 'Update Webinar' : 'Create Webinar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
