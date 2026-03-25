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

// Auto-logout on token expiry (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// ─── Public Endpoints ────────────────────────────────────
export const getAbout = () => api.get('/about');
export const getExperiences = () => api.get('/experiences');
export const getProjects = () => api.get('/projects');
export const getFeaturedProjects = () => api.get('/projects?featured=true');
export const submitContact = (data) => api.post('/contact', data);
export const getSkills = () => api.get('/skills');
export const getSkillCategories = () => api.get('/skills/categories');
export const getCertifications = () => api.get('/certifications');

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

export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

export const createCertification = (data) => api.post('/certifications', data);
export const updateCertification = (id, data) => api.put(`/certifications/${id}`, data);
export const deleteCertification = (id) => api.delete(`/certifications/${id}`);

export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

export const uploadFile = (formData, folder = 'portfolio') => 
    api.post(`/upload?folder=${encodeURIComponent(folder)}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export default api;
