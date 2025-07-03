const User = require('../models/User');
const ApiError = require('../utils/ApiErrors');
const bcrypt = require('bcryptjs');

const userService = {
  /**
   * Register new user
   */
  registerUser: async (userData) => {
    const { email, password } = userData;
    
    // Check existing user
    const exists = await User.findOne({email});
    if (exists) throw new ApiError(400, 'User already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    return await User.create({
      ...userData,
      password: hashedPassword
    });
  },

  /**
   * Authenticate user
   */
  loginUser : async (email, password) => {
    // console.log({email});
    // yahan pr security reason ke wajah se response me kabhi bhi passwaord nai ayega 
    // isliye password ko nikalne ke liye select key word use kiye

    const user = await User.findOne({email} ).select('+password'); // Add this;
    if (!user) throw new ApiError(401, 'Invalid credentials');

    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');

    return user;
  },

  /**
   * Get user profile
   */
  getUserProfile: async (userId) => {
    
    const user = await User.findById(userId)
    // console.log("getuserprofile user service", user)
      .select('-password -__v')
      .populate('blogs', 'title createdAt');
    
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (userId, updateData) => {
    console.log("userId",userId);
    console.log("updata",updateData);
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!user) throw new ApiError(404, 'User not found');
    return user;
  },

  /**
   * Delete user account
   */
  deleteUserAccount: async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }
};

module.exports = userService;