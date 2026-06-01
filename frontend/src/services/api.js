import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const interviewAPI = {
  getQuestions: (role, category) => API.get(`/interview/questions?role=${role}&category=${category}`),
  save: (data) => API.post('/interview/save', data),
  getHistory: () => API.get('/interview/history'),
  getById: (id) => API.get(`/interview/${id}`),
  getStats: () => API.get('/interview/stats'),
};

export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const feedbackAPI = {
  generate: (data) => API.post('/feedback/generate', data),
};

export const adminAPI = {
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getInterviews: () => API.get('/admin/interviews'),
  getStats: () => API.get('/admin/stats'),
  getQuestions: () => API.get('/admin/questions'),
  addQuestion: (data) => API.post('/admin/questions', data),
  deleteQuestion: (id) => API.delete(`/admin/questions/${id}`),
};

export default API;
