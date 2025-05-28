// axiosSetup.js
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to auto-refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        const adminRefreshToken = localStorage.getItem('adminRefreshToken');
        const userRefreshToken = localStorage.getItem('userRefreshToken');
        const refreshToken = adminRefreshToken || userRefreshToken;

        if (refreshToken) {
          originalRequest._retry = true;

          if (isRefreshing) {
            return new Promise(function (resolve, reject) {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return api(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          isRefreshing = true;

          try {
            const res = await axios.post('https://ef1108a0-0562-4b6b-8a98-ad9642064979-00-ey6rfojnikxd.pike.replit.dev:8000/api/token/refresh/', {
              refresh: refreshToken,
            });

            const newAccess = res.data.access;

            // Store token based on which type it was
            if (adminRefreshToken) {
              localStorage.setItem('adminToken', newAccess);
            } else {
              localStorage.setItem('userToken', newAccess);
            }

            api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccess;
            processQueue(null, newAccess);
            return api(originalRequest);
          } catch (err) {
            processQueue(err, null);

            // Clear tokens based on type
            if (adminRefreshToken) {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminRefreshToken');
              localStorage.removeItem('adminUser');
              window.location.href = '/admin';
            } else {
              localStorage.removeItem('userToken');
              localStorage.removeItem('userRefreshToken');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }
      }

    return Promise.reject(error);
  }
);

export default api;