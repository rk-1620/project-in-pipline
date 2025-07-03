const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  createCommentSchema,
  updateCommentSchema,
  commentIdSchema,
  blogIdSchema
} = require('../validators/commentValidator');

// Public routes
router.get('/blog/:blogId', 
  validateRequest(blogIdSchema, 'params'),
  getCommentsByBlog
);

// Protected routes
router.use(authMiddleware.userauth);

router.post('/',
  validateRequest(createCommentSchema),
  createComment
);

router.patch('/:id',
  validateRequest(commentIdSchema, 'params'),
  validateRequest(updateCommentSchema),
  updateComment
);

router.delete('/:id',
  validateRequest(commentIdSchema, 'params'),
  deleteComment
);

module.exports = router;