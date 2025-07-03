// ===========================
// SERVER.JS - ENTRY POINT
// ===========================

// Load environment variables from .env file
// This allows us to keep sensitive configuration (like DB credentials) outside the code
require("dotenv").config();

// const { initJSErrorLogging } = require('../../../../data-collector/loggers/log-js-errors');
// initJSErrorLogging();

// Import required modules
const http = require("http"); // Built-in Node.js module for creating an HTTP server
const app = require("./app"); // Import the Express app instance from app.js
const connectDB = require("./config/db"); // Import the MongoDB connection function
const winston = require('winston');


// ======================
// Logger Configuration
// ======================
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/server.log' })
  ]
});


// ===========================
// DATABASE CONNECTION
// ===========================

// Connect to MongoDB using the function from db.js
// Ensures the database is connected before starting the server
connectDB().then(() => {
  logger.info('✅ MongoDB connected');
}).catch(err => {
  logger.error(`❌ DB connection failed: ${err.message}`);
  process.exit(1);
});


// ===========================
// SERVER CONFIGURATION
// ===========================

// Define the port for the server (use the value from .env file if available, otherwise default to 5000)
const PORT = process.env.PORT;

// Create an HTTP server and pass the Express app to handle requests
const server = http.createServer(app);


// ======================
// Graceful Shutdown
// ======================
const shutdown = () => {
  logger.info('🛑 Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('🔴 All connections closed');
      process.exit(0);
    });
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);



// ===========================
// START THE SERVER
// ===========================

// Start listening for incoming connections on the defined port
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
  logger.error(`💥 Server error: ${err.message}`);
  process.exit(1);
});
