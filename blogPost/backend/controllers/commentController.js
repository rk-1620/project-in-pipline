const commentService = require('../services/commentService');

// @desc    Create comment
// @route   POST /api/comments
exports.createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(
      req.user.id,
      req.body.blogId,
      req.body.text
    );
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get blog comments
// @route   GET /api/comments/blog/:blogId
exports.getCommentsByBlog = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByBlog(req.params.blogId);
    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update comment
// @route   PATCH /api/comments/:id
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(
      req.params.id,
      req.user.id,
      req.body.text
    );
    res.json({
      success: true,
      data: comment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(
      req.params.id,
      req.user.id,
      req.user.role === 'admin' // Pass admin status
    );
    res.json({
      success: true,
      data: null
    });
  } catch (err) {
    next(err);
  }
};