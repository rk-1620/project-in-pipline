const adminService = require('../services/adminService');

/**
 * @desc    Authenticate admin
 * @route   POST /api/admin/login
 * @access  Public
 */
exports.authAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = await adminService.authAdmin(username, password);
    
    // Generate token or session here
    const token = admin.generateAuthToken();
    res.json({
      success: true,
      token,
      data: { id: admin._id, username: admin.username }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Register new admin
 * @route   POST /api/admin/register
 * @access  Private (protected by secret key)
 */
exports.adminRegister = async (req, res, next) => {
  try {
    const { username, password, secretKey } = req.body;
    const admin = await adminService.registerAdmin(username, password, secretKey);
    
    res.status(201).json({
      success: true,
      data: { id: admin._id, username: admin.username }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/getUsers
 * @access  Private (Admin only)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all blogs
 * @route   GET /api/admin/getBlogs
 * @access  Private (Admin only)
 */
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await adminService.getAllBlogs();
    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/delete/user/:id
 * @access  Private (Admin only)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete blog
 * @route   DELETE /api/admin/delete/blog/:id
 * @access  Private (Admin only)
 */
exports.deleteBlog = async (req, res, next) => {
  try {
    await adminService.deleteBlog(req.params.id);
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};