import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Your backend API base URL
  timeout: 10000, // Request timeout
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

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle token expiration
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  export default api;