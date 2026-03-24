import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Public Endpoints ────────────────────────────────────
export const getAbout = () => api.get('/about');
export const getExperiences = () => api.get('/experiences');
export const getProjects = () => api.get('/projects');
export const getFeaturedProjects = () => api.get('/projects?featured=true');
export const submitContact = (data) => api.post('/contact', data);

// ─── Auth ────────────────────────────────────────────────
export const login = (credentials) => api.post('/auth/login', credentials);

// ─── Admin Endpoints ────────────────────────────────────
export const updateAbout = (data) => api.put('/about', data);

export const createExperience = (data) => api.post('/experiences', data);
export const updateExperience = (id, data) => api.put(`/experiences/${id}`, data);
export const deleteExperience = (id) => api.delete(`/experiences/${id}`);

export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getMessages = () => api.get('/contact/messages');
export const deleteMessage = (id) => api.delete(`/contact/messages/${id}`);

export default api;
