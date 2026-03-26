import axios from 'axios';

/**
 * Axios instance configured to communicate with Spring Boot backend.
 * Base URL points to the backend server running on port 8080.
 * CORS is configured on the backend to allow requests from this origin.
 */
const API = axios.create({
  baseURL: 'https://wicky-sprojectfsad-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem('webinarhub_user');
  if (stored) {
    const user = JSON.parse(stored);
    if (user && user.id) {
      config.headers.Authorization = `Bearer ${user.id}`;
    }
  }
  return config;
});

// ==================== AUTH API ====================
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
};

// ==================== WEBINAR API ====================
export const webinarAPI = {
  getAll: () => API.get('/webinars'),
  getById: (id) => API.get(`/webinars/${id}`),
  create: (data) => API.post('/webinars', data),
  update: (id, data) => API.put(`/webinars/${id}`, data),
  delete: (id) => API.delete(`/webinars/${id}`),
  search: (title) => API.get(`/webinars/search?title=${title}`),
  getUpcoming: () => API.get('/webinars/upcoming'),
  getByCategory: (category) => API.get(`/webinars/category/${category}`),
  getCount: () => API.get('/webinars/count'),
  updateStatus: (id, status) => API.put(`/webinars/${id}/status?status=${status}`),
};

// ==================== REGISTRATION API ====================
export const registrationAPI = {
  register: (webinarId) => API.post(`/registrations?webinarId=${webinarId}`),
  getUserRegistrations: () => API.get(`/registrations/user/me`),
  getWebinarRegistrations: (webinarId) => API.get(`/registrations/webinar/${webinarId}`),
  cancel: (id) => API.delete(`/registrations/${id}`),
  markAttendance: (id) => API.put(`/registrations/${id}/attend`),
  checkRegistration: (webinarId) => API.get(`/registrations/check?webinarId=${webinarId}`),
  getCount: (webinarId) => API.get(`/registrations/count/${webinarId}`),
};

// ==================== RESOURCE API ====================
export const resourceAPI = {
  add: (data) => API.post('/resources', data),
  getByWebinar: (webinarId) => API.get(`/resources/webinar/${webinarId}`),
  getById: (id) => API.get(`/resources/${id}`),
  delete: (id) => API.delete(`/resources/${id}`),
};

// ==================== USER API ====================
export const userAPI = {
  getAll: () => API.get('/users'),
  getById: (id) => API.get(`/users/${id}`),
  search: (name) => API.get(`/users/search?name=${name}`),
};

export default API;
