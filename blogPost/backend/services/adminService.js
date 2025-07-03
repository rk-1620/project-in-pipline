const Admin = require('../models/Admin');
const User = require('../models/User');
const Blog = require('../models/blog');
const ApiError = require('../utils/ApiErrors');
const bcrypt = require('bcryptjs');

const adminService = {
  /**
   * Authenticate admin
   */
  authAdmin: async (username, password) => {
    const admin = await Admin.findOne({ username }).select('+password');
    console.log("admin response at adminservices auth admin");
    console.log(admin);
    if (!admin) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    return admin;
  },

  /**
   * Register new admin (protected by secret key)
   */
  registerAdmin: async (username, password, secretKey) => {
    if (secretKey !== process.env.ADMIN_REGISTER_KEY) {
      throw new ApiError(403, 'Invalid admin registration key');
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      throw new ApiError(400, 'Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await Admin.create({ username, password: hashedPassword });
  },

  /**
   * Get all users with optional filters
   */
  getAllUsers: async (filters = {}) => {
    return await User.find(filters)
      .select('-password')
      .sort('-createdAt');
  },

  /**
   * Get all blogs with optional filters
   */
  getAllBlogs: async (filters = {}) => {
    return await Blog.find(filters)
      .populate('author', 'name email')
      .sort('-createdAt');
  },

  /**
   * Delete user (and their blogs)
   */
  deleteUser: async (userId) => {
    const session = await User.startSession();
    session.startTransaction();

    try {
      // Delete user's blogs first
      await Blog.deleteMany({ author: userId }).session(session);

      // Then delete user
      const user = await User.findByIdAndDelete(userId).session(session);

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      await session.commitTransaction();
      return user;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  /**
   * Delete blog
   */
  deleteBlog: async (blogId) => {
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }
    return blog;
  }
};

module.exports = adminService;