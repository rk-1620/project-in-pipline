const express = require('express');
const router = express.Router();

// Import all route files
const dbCheckRoute = require('./dbCheck');
const blogRoutes = require('./blogRoutes');
// const authRoutes = require('./authRoutes');
const commentRoutes = require('./commentRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const healthCheckRoute = require('./healthRoutes');

// Mount routes
router.use('/db-check', dbCheckRoute);
router.use('/blogs', blogRoutes);
// router.use('/auth', authRoutes);
router.use('/comments', commentRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/health', healthCheckRoute);

module.exports = router;