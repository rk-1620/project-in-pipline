const userService = require('../services/userService');
const ApiError = require('../utils/ApiErrors');

// @desc    Register user
// @route   POST /api/users/register
exports.registerUser = async (req, res, next) => {
  try {
    console.log("registerUser controllers");
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/users/login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await userService.loginUser(email, password);
    
    // Generate token
    const token = user.generateAuthToken();

    
    res.json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user profile
// @route   GET /api/users/me
exports.getUserProfile = async (req, res, next) => {
  try {
    console.log("usercontoller get profile",req.user.id);
    const user = await userService.getUserProfile(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update profile
// @route   PUT /api/users/me
exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUserProfile(req.user.id, req.body);
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete account
// @route   DELETE /api/users/me
exports.deleteUserAccount = async (req, res, next) => {
  try {
    await userService.deleteUserAccount(req.user.id);
    res.json({
      success: true,
      data: null,
      message: 'User account deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change password
// @route   PATCH /api/users/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(
      req.user.id, 
      currentPassword, 
      newPassword
    );
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's blogs
// @route   GET /api/users/me/blogs
exports.getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await userService.getUserBlogs(req.user.id);
    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/me/avatar
// exports.uploadAvatar = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       throw new ApiError(400, 'Please upload an image file');
//     }
    
//     const user = await userService.updateUserProfile(req.user.id, {
//       avatar: req.file.path
//     });
    
//     res.json({
//       success: true,
//       data: {
//         avatar: user.avatar
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };