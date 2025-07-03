const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiErrors');

const userauth = (req, res, next) => {
  // 1. Check for token existence
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authorization token required'));
  }

  // 2. Extract token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Standardize user object
    req.user = {
      id: decoded.id,
      _id: decoded.id, // For Mongoose compatibility
      role: decoded.role // Optional: Add role if your JWT includes it
    };

    next();
  } catch (err) {
    // 5. Handle specific JWT errors
    const errorMap = {
      'TokenExpiredError': 'Token expired',
      'JsonWebTokenError': 'Invalid token',
      'NotBeforeError': 'Token not active'
    };
    
    const message = errorMap[err.name] || 'Authentication failed';
    next(new ApiError(401, message));
  }
};

module.exports = {userauth} ;