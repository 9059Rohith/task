import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      // we might also redirect to /login here or handle it in components
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (credentials) => api.post('/auth/register', credentials),
  getMe: () => api.get('/auth/me'),
};

export const messagesAPI = {
  getMessages: (room = 'general', page = 1, limit = 30) => 
    api.get(`/messages?room=${room}&page=${page}&limit=${limit}`),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};

export default api;
