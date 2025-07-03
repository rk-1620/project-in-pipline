const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

module.exports = {
  createCommentSchema: [
    body('text')
      .trim()
      .notEmpty()
      .withMessage('Comment text is required')
      .isLength({ max: 500 })
      .withMessage('Comment cannot exceed 500 characters'),
    
    body('blogId')
      .custom(isObjectId)
      .withMessage('Invalid blog ID format')
  ],

  updateCommentSchema: [
    body('text')
      .trim()
      .notEmpty()
      .withMessage('Comment text is required')
      .isLength({ max: 500 }),
    
    param('id')
      .custom(isObjectId)
      .withMessage('Invalid comment ID')
  ],

  commentIdSchema: [
    param('id')
      .custom(isObjectId)
      .withMessage('Invalid comment ID')
  ],

  blogIdSchema: [
    param('blogId')
      .custom(isObjectId)
      .withMessage('Invalid blog ID')
  ]
};