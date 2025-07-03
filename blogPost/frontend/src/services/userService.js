// import axios from 'axios';
// import jwtDecode from 'jwt-decode';

// const API_BASE_URL = 'http://localhost:3000/api';

// // Create axios instance with base config
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Request interceptor to inject token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// const userServices = {
//   // Authentication Methods
//   register: async (userData) => {
//     try {
//       const response = await api.post('/auth/register', userData);
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//       }
//       return response.data;
//     } catch (error) {
//       console.error('Registration failed:', error);
//       throw error;
//     }
//   },

//   login: async (credentials) => {
//     try {
//       const response = await api.post('/auth/login', credentials);
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//       }
//       return response.data;
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     delete api.defaults.headers.common['Authorization'];
//   },

//   getCurrentUser: async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return null;
      
//       // Option 1: Get user from token if you store basic info in JWT
//       const decoded = jwtDecode(token);
      
//       // Option 2: Fetch fresh user data from server
//       const response = await api.get('/users/me');
//       return response.data || decoded;
//     } catch (error) {
//       console.error('Error getting current user:', error);
//       throw error;
//     }
//   },

//   // Password Management
//   forgotPassword: async (email) => {
//     try {
//       const response = await api.post('/auth/forgot-password', { email });
//       return response.data;
//     } catch (error) {
//       console.error('Password reset request failed:', error);
//       throw error;
//     }
//   },

//   resetPassword: async (token, newPassword) => {
//     try {
//       const response = await api.post('/auth/reset-password', { token, newPassword });
//       return response.data;
//     } catch (error) {
//       console.error('Password reset failed:', error);
//       throw error;
//     }
//   },

//   verifyResetToken: async (token) => {
//     try {
//       const response = await api.get(`/auth/verify-reset-token/${token}`);
//       return response.data;
//     } catch (error) {
//       console.error('Token verification failed:', error);
//       throw error;
//     }
//   },

//   // User Management Methods
//   getUsersByIds: async (userIds) => {
//     try {
//       const response = await api.post('/users/by-ids', { userIds });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching users by IDs:', error);
//       throw error;
//     }
//   },

//   getUserById: async (userId) => {
//     try {
//       const response = await api.get(`/users/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching user by ID:', error);
//       throw error;
//     }
//   },

//   getProfile: async () => {
//     try {
//       const response = await api.get('/users/me');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       throw error;
//     }
//   },

//   updateUser: async (userId, updateData) => {
//     try {
//       const response = await api.patch(`/users/${userId}`, updateData);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating user:', error);
//       throw error;
//     }
//   },

//   searchUsers: async (query) => {
//     try {
//       const response = await api.get('/users/search', {
//         params: { q: query }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error searching users:', error);
//       throw error;
//     }
//   }
// };

// export default userServices;





import API from '../api';

export const UserService = {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Created user data
   */
  register: async (userData) => {
    return API.post('/auth/register', userData);
  },

  /**
   * Authenticate user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise} User data with token
   */
  login: async (email, password) => {
    return API.post('/auth/login', { email, password });
  },

  /**
   * Get user profile
   * @param {string} userId 
   * @returns {Promise} User profile with blogs
   */
  getProfile: async (userId) => {
    return API.get(`/users/${userId}`);
  },

  /**
   * Update user profile
   * @param {string} userId 
   * @param {Object} updateData - Fields to update
   * @returns {Promise} Updated user data
   */
  updateProfile: async (userId, updateData) => {
    return API.patch(`/users/${userId}`, updateData);
  },

  /**
   * Delete user account
   * @param {string} userId 
   * @returns {Promise} Deleted user data
   */
  deleteAccount: async (userId) => {
    return API.delete(`/users/${userId}`);
  },

  /**
   * Get current user profile
   * @returns {Promise} Current user data
   */
  getCurrentUser: async () => {
    return API.get('/users/me');
  }
};