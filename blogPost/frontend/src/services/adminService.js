import API from '../api';

export const AdminService = {
  /**
   * Authenticate admin
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise} Admin data with token
   */
  login: async (username, password) => {
    return API.post('/admin/auth/login', { username, password });
  },

  /**
   * Register new admin (protected by secret key)
   * @param {string} username 
   * @param {string} password 
   * @param {string} secretKey 
   * @returns {Promise} New admin data
   */
  register: async (username, password, secretKey) => {
    return API.post('/admin/auth/register', { username, password, secretKey });
  },

  /**
   * Get all users with optional filters
   * @param {Object} filters - Optional filters
   * @returns {Promise} Array of users
   */
  getAllUsers: async (filters = {}) => {
    return API.get('/admin/users', { params: filters });
  },

  /**
   * Get all blogs with optional filters
   * @param {Object} filters - Optional filters
   * @returns {Promise} Array of blogs with author details
   */
  getAllBlogs: async (filters = {}) => {
    return API.get('/admin/blogs', { params: filters });
  },

  /**
   * Delete user and their blogs
   * @param {string} userId 
   * @returns {Promise} Deleted user data
   */
  deleteUser: async (userId) => {
    return API.delete(`/admin/users/${userId}`);
  },

  /**
   * Delete blog
   * @param {string} blogId 
   * @returns {Promise} Deleted blog data
   */
  deleteBlog: async (blogId) => {
    return API.delete(`/admin/blogs/${blogId}`);
  }
};