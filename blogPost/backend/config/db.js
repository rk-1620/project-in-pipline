// ===========================
// DATABASE CONNECTION FILE
// ===========================

// Import Mongoose for MongoDB object modeling
const mongoose = require('mongoose');

// Load environment variables from .env file
require('dotenv').config();

// Async function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the connection string from .env file
        await mongoose.connect(process.env.mongoUri, {
            useNewUrlParser: true,       // Ensures use of new URL parser
            useUnifiedTopology: true,    // Enables new server discovery & monitoring engine
        });

        console.log('✅ MongoDB Connected'); // Log success message if connection is successful

    } catch (error) {
        console.error('MongoDB Connection Error:', error); // Log error details

        process.exit(1); // Exit process with failure if the connection fails
    }
};

// Export the connectDB function so it can be used in server.js
module.exports = connectDB;
