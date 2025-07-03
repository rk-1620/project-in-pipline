const { body } = require('express-validator');

console.log("userValidator");
module.exports = {
  registerSchema: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 3 })
      .withMessage('Password must be at least 3 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
  ],

  loginSchema: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail(),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],

  updateSchema: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 }),
    
    body('email')
      .optional()
      .trim()
      .isEmail()
      .normalizeEmail(),
    
    body('password')
      .optional()
      .trim()
      .isLength({ min: 3 })
  ]
};