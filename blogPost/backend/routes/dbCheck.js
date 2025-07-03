// ===========================
// DATABASE HEALTH CHECK ROUTE
// ===========================

// Import Express and Mongoose
const express = require("express");
const mongoose = require("mongoose");

// Create a new router object
const router = express.Router();

// /**
//   @route   GET /api/check-db
//  * @desc    Checks if MongoDB is connected
//  * @access  Public
//   */
router.get("/check-db", (req, res) => {
  // Check the current state of the MongoDB connection
  const isConnected = mongoose.connection.readyState === 1;

  if (isConnected) {
    // Send a success response if MongoDB is connected
    res.status(200).json({ message: "✅ Database is connected successfully!" });
  } else {
    // Send an error response if MongoDB is not connected
    res.status(500).json({ message: "❌ Database connection failed!" });
  }
});

// Export the router so it can be used in app.js
module.exports = router;
