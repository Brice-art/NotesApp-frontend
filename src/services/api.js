import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authAPI = {
  signup: (name, email, password) => 
    api.post('/auth/signup', { name, email, password }),
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  checkSession: () => 
    api.get('/auth/session'),
};

export const notesAPI = {
  getAll: (params = {}) => 
    api.get('/notes', { params }),
  
  getOne: (noteId) => 
    api.get(`/notes/${noteId}`),
  
  create: (data) => 
    api.post('/notes', data),
  
  update: (noteId, data) => 
    api.put(`/notes/${noteId}`, data),
  
  delete: (noteId) => 
    api.delete(`/notes/${noteId}`),
  
  pin: (noteId) => 
    api.patch(`/notes/${noteId}/pin`),
  
  archive: (noteId, archive = true) => 
    api.patch(`/notes/${noteId}/archive`, { archive }),
  
  getCategories: () => 
    api.get('/categories'),
};

export default api;