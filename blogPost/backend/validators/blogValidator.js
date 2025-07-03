const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const maxTags = (value) => !value || value.length <= 5;

module.exports = {
  objectIdSchema: [
    param('id')
      .custom(isObjectId)
      .withMessage('Invalid blog ID format')
  ],

  blogCreateSchema: [
    body('title')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be 5-100 characters')
      .escape(),
    
    body('content')
      .trim()
      .isLength({ min: 50 })
      .withMessage('Content must be at least 50 characters'),
    
    body('excerpt')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Excerpt must be ≤200 characters'),
    
    body('tags')
      .optional()
      .isArray()
      .custom(maxTags)
      .withMessage('Maximum 5 tags allowed'),
      body('tags.*')
        .isString()
        .isLength({ max: 20 })
        .withMessage('Each tag must be ≤20 characters')
  ],

  blogUpdateSchema: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be 5-100 characters')
      .escape(),
    
    body('content')
      .optional()
      .trim()
      .isLength({ min: 50 })
      .withMessage('Content must be at least 50 characters'),
    
    body('tags')
      .optional()
      .isArray()
      .custom(maxTags)
      .withMessage('Maximum 5 tags allowed'),
      body('tags.*')
        .optional()
        .isString()
        .isLength({ max: 20 })
        .withMessage('Each tag must be ≤20 characters')
  ]
};