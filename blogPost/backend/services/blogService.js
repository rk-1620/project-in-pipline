const Blog = require('../models/blog');
const ApiError = require('../utils/ApiErrors');

const blogService = {
  /**
   * Create a new blog
   */
  createBlog: async (blogData) => {
    try {
      console.log("blog data from blogservices", blogData);
      return await Blog.create(blogData);
    } catch (err) {
      throw new ApiError(400, err.message);
    }
  },

  /**
   * Get blog by ID with populated author and comments
   */
  getBlogById: async (id) => {
    const blog = await Blog.findById(id)
    .populate('author', 'name email')
      .populate({
        path: 'comments',
        select: 'text createdAt',
        populate: {
          path: 'user',
          select: 'name'
        }
      }).lean({ virtuals: true }); // Important for virtuals to show up;
      // yahan pr error tha kyuki mera blog schema me actual comments field nai tha 
      // isliye virtual comment field banaya gaye isliye ye line of code add krna parega virtaul comments
      // dekhne ke liye
    if (!blog) throw new ApiError(404, 'Blog not found');
    return blog;
  },

  /**
   * Get all blogs with filters/pagination
   */
  getAllBlogs: async (filters = {}, options = {}) => {
    const { page = 1, limit = 10 } = options;
    return await Blog.find(filters)
      .sort('-createdAt')
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('author', 'name');
  },

  /**
   * Update blog by ID
   */
  updateBlog: async (id, updateData) => {
    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!blog) throw new ApiError(404, 'Blog not found');
    return blog;
  },

  /**
   * Delete blog by ID
   */
  deleteBlog: async (id) => {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) throw new ApiError(404, 'Blog not found');
    return blog;
  },

  /**
   * Verify blog ownership
   */
  verifyOwnership: async (blogId, userId) => {
    const blog = await Blog.findById(blogId);
    if (!blog) throw new ApiError(404, 'Blog not found');
    if (blog.author.toString() !== userId) {
      throw new ApiError(403, 'Not authorized to modify this blog');
    }
    return true;
  },
  /**
   * Toggle reaction on a blog
   * @param {string} blogId 
   * @param {string} userId 
   * @param {'like'|'save'} reactionType 
   * @returns {Promise<Object>} Updated blog
   */
  toggleReaction: async (blogId, userId, reactionType) => {
    const blog = await Blog.findById(blogId);
    if (!blog) throw new ApiError(404, 'Blog not found');
    console.log("reactionType",reactionType);
    const reactionArray = blog.reactions[`${reactionType}s`];
    const index = reactionArray.indexOf(userId);

    index === -1 
      ? reactionArray.push(userId)
      : reactionArray.splice(index, 1);

    await blog.save();
    return blog;
  },

  /**
   * Get user's reaction status for a blog
   * @param {string} blogId 
   * @param {string} userId 
   * @returns {Object} Reaction status
   */
  getUserReactions: async (blogId, userId) => {
    const blog = await Blog.findById(blogId);
    if (!blog) throw new ApiError(404, 'Blog not found');

    return {
      hasLiked: blog.reactions.likes.includes(userId),
      hasSaved: blog.reactions.saves.includes(userId)
    };
  }

};

module.exports = blogService;



// .populate('author', 'name email')

// {
//   "success": true,
//   "data": {
//       "_id": "681355df16ff3633f7dc9c12",
//       "title": "this ablog is about the PATCH request",
//       "content": "blogs of the blog created after changes in backend",
//       "author": {
//           "_id": "67ed81227b59c9d8e7f88d61",
//           "name": "rakesh",
//           "email": "rakesh@gmail.com"
//       },
//       "tags": [],
//       "status": "draft",
//       "createdAt": "2025-05-01T11:07:11.512Z",
//       "updatedAt": "2025-05-01T11:07:11.512Z",
//       "__v": 0,
//       "comments": []
//   }
// }


// {
//   "success": true,
//   "data": {
//       "_id": "681355df16ff3633f7dc9c12",
//       "title": "this ablog is about the PATCH request",
//       "content": "blogs of the blog created after changes in backend",
//       "author": "67ed81227b59c9d8e7f88d61",
//       "tags": [],
//       "status": "draft",
//       "createdAt": "2025-05-01T11:07:11.512Z",
//       "updatedAt": "2025-05-01T11:07:11.512Z",
//       "__v": 0,
//       "comments": []
//   }
// }