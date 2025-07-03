const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  registerSchema,
  loginSchema,
  updateSchema
} = require('../validators/userValidator');

// Public routes
router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);

// Protected routes
router.use(authMiddleware.userauth);

router.get('/me', getUserProfile);
router.put('/me', validateRequest(updateSchema), updateUserProfile);
router.delete('/me', deleteUserAccount);

module.exports = router;