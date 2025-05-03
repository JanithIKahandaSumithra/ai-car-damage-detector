import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data)
};

export const garage = {
  getAll: () => api.get('/garage'),
  getById: (id) => api.get(`/garage/${id}`),
  register: (data) => api.post('/garage/register', data),
  update: (id, data) => api.put(`/garage/${id}`, data),
  getRecommended: (damageTypes) => api.post('/garage/recommend', { damageTypes })
};

export const damage = {
  predict: (formData) => api.post('/damage/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getHistory: () => api.get('/damage/history'),
  getHistoryById: (id) => api.get(`/damage/history/${id}`)
};

export const booking = {
  create: (data) => 
    api.post('/booking', data),
  
  getCustomerBookings: () => 
    api.get('/booking/customer'),
  
  getGarageBookings: () => 
    api.get('/booking/garage'),
  
  updateStatus: (bookingId, status) => 
    api.put(`/booking/${bookingId}/status`, { status })
};


export default api;