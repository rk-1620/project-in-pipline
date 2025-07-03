const express = require('express');
const router = express.Router();
const {
  authAdmin,
  adminRegister,
  getAllUsers,
  getAllBlogs,
  deleteUser,
  deleteBlog
} = require('../controllers/adminController');
const validateRequest = require('../middleware/validateRequest');
const {
  adminLoginSchema,
  adminRegisterSchema,
  objectIdSchema
} = require('../validators/adminValidator');
const protectAdmin = require('../middleware/adminMidleware');

// Public routes
router.post('/login', 
  validateRequest(adminLoginSchema),
  authAdmin
);

router.post('/register',
  validateRequest(adminRegisterSchema),
  adminRegister
);

// Protected admin routes
router.use(protectAdmin);

router.get('/getUsers', getAllUsers);
router.get('/getBlogs', getAllBlogs);
router.delete('/delete/user/:id',
  validateRequest(objectIdSchema, 'params'),
  deleteUser
);
router.delete('/delete/blog/:id',
  validateRequest(objectIdSchema, 'params'),
  deleteBlog
);

module.exports = router;