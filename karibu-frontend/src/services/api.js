import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kgl-ogni.onrender.com/api',
});

// Automatically add the token to the header if it exists in local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;