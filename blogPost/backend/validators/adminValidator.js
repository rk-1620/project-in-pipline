const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

module.exports = {
  adminLoginSchema: [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required'),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],

  adminRegisterSchema: [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 3 })
      .withMessage('Password must be at least 8 characters'),
    
    body('secretKey')
      .notEmpty()
      .withMessage('Secret key is required')
  ],

  objectIdSchema: [
    param('id')
      .custom(isObjectId)
      .withMessage('Invalid ID format')
  ]
};