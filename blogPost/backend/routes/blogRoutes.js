const express = require("express");
const { getAllBlogs, createBlog, 
        getBlogById, updateBlog, 
        deleteBlog,reactToBlog,
        getUserReactions  } = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
    blogCreateSchema,
    blogUpdateSchema,
    objectIdSchema
  } = require("../validators/blogValidator");
const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", 
  validateRequest(objectIdSchema, 'params'), 
  getBlogById
);

// Protected routes
router.use(authMiddleware.userauth);

router.post("/",validateRequest(blogCreateSchema),createBlog);
router.patch("/:id",validateRequest(objectIdSchema, 'params'),validateRequest(blogUpdateSchema),updateBlog);
router.delete("/:id",validateRequest(objectIdSchema, 'params'),deleteBlog);
router.patch('/:id/like', reactToBlog);
router.patch('/:id/save', reactToBlog);
router.get('/:id/reactions', getUserReactions);
module.exports = router;