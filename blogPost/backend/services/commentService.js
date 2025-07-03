const Comment = require('../models/Comment');
const Blog = require('../models/blog');
const ApiError = require('../utils/ApiErrors');

const commentService = {
  /**
   * Create a new comment
   */
  createComment: async (userId, blogId, text) => {
    const blog = await Blog.findById(blogId);
    if (!blog) throw new ApiError(404, 'Blog post not found');

    return await Comment.create({
      text,
      user: userId,
      post: blogId
    });
  },

  /**
   * Get comments for a blog
   */
  getCommentsByBlog: async (blogId) => {
    try {
      // if (!mongoose.Types.ObjectId.isValid(blogId)) {
      //   throw new Error('Invalid blog ID format');
      // }

      const comments = await Comment.find({ post: blogId })
        .populate({
          path: 'user',
          select: 'name avatar'  // Only return these fields
        })
        .sort({ createdAt: -1 }) // Newest first
        .lean();

      return comments;
    } catch (err) {
      console.error('Error in getCommentsByBlog:', err);
      throw err; // Re-throw for controller
    }
  },

  /**
   * Update comment
   */
  updateComment: async (commentId, userId, text) => {
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: userId },
      { text },
      { new: true, runValidators: true }
    );

    if (!comment) {
      throw new ApiError(404, 'Comment not found or not authorized');
    }
    return comment;
  },

  /**
   * Delete comment
   */
  deleteComment: async (commentId, userId, isAdmin = false) => {
    const filter = isAdmin 
      ? { _id: commentId } 
      : { _id: commentId, user: userId };

    const comment = await Comment.findOneAndDelete(filter);

    if (!comment) {
      throw new ApiError(404, 'Comment not found or not authorized');
    }
    return comment;
  }
};

module.exports = commentService;