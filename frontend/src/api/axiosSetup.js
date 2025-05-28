import axios from 'axios';

// Set the base URL for the backend
axios.defaults.baseURL = `${window.location.protocol}//${window.location.hostname}:8000`;

// Add request interceptor to include JWT token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;