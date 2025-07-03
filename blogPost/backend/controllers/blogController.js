const blogService = require('../services/blogService');

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getAllBlogs({}, req.query);
    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single blog
 * @route   GET /api/blogs/:id
 * @access  Public
 */
exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    res.json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new blog
 * @route   POST /api/blogs
 * @access  Private
 */
exports.createBlog = async (req, res, next) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user.id // From auth middleware
    };

    console.log("blogDAta from controllers",blogData);

    const blog = await blogService.createBlog(blogData);
    console.log(blog);
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update blog
 * @route   PATCH /api/blogs/:id
 * @access  Private
 */
exports.updateBlog = async (req, res, next) => {
  try {
    await blogService.verifyOwnership(req.params.id, req.user.id);
    const blog = await blogService.updateBlog(req.params.id, req.body);
    res.json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:id
 * @access  Private
 */
exports.deleteBlog = async (req, res, next) => {
  try {
    await blogService.verifyOwnership(req.params.id, req.user.id);
    await blogService.deleteBlog(req.params.id);
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

exports.reactToBlog = async (req, res, next) => {
  try {
    console.log("baseUrl", req.baseUrl)
    const blog = await blogService.toggleReaction(
      req.params.id,
      req.user._id,
      // req.baseUrl.includes('like') ? 'like' : 'save' // Determines reaction type from route
      req.originalUrl.includes('like') ? 'like' : 'save'  
      // req.path.includes('like') ? 'like' : 'save'  
      // both of the url except the first one is working 
      // for more information check the blog - Difference between req.baseUrl, req.path and req.originalUrl
    );
    
    res.json({
      success: true,
      data: await blogService.getBlogById(blog._id) // Return populated blog
    });
  } catch (err) {
    next(err);
  }
};

// Add new method to check user's reaction status
exports.getUserReactions = async (req, res, next) => {
  try {
    const reactions = await blogService.getUserReactions(
      req.params.id,
      req.user._id
    );
    
    res.json({
      success: true,
      data: reactions
    });
  } catch (err) {
    next(err);
  }
};