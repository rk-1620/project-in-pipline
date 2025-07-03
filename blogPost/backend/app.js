// app.js

// Importing required modules
require('dotenv').config();
const express = require("express"); // Express framework for handling HTTP requests
const cors = require("cors"); // Allows cross-origin requests (useful for frontend-backend communication)
const helmet = require("helmet"); // Enhances security by setting HTTP headers
const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
// const morgan = require("morgan"); // Logs HTTP requests to the console (useful for debugging)
const winston = require('winston');
const expressWinston = require('express-winston');
const bodyParser = require("body-parser");

// Creating an Express app instance
const app = express();
// const mongoSanitize = require('express-mongo-sanitize');
// app.use(
//   mongoSanitize({
//     replaceWith: '_',
//     onSanitize: ({ req, key }) => {
//       console.log(`Sanitized ${key}`);
//     }
//   })
// );

// ===========================================
// BODY PARSING
// ===========================================

// Enable parsing of JSON data in request bodies
// This is required to handle JSON payloads in API requests
app.use(express.json({ limit: '10kb' }));
// Enable parsing of URL-encoded data (useful for form submissions)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(bodyParser.urlencoded({ extended: true }));



// ===========================================
// SECURITY MIDDLEWARES
// ===========================================
app.use(helmet());

  // app.use(cors({
  //   origin: process.env.FRONTEND_URL || 'http://localhost:5173/',
  //   credentials: true
  // }));
  app.use(cors());
// Rate limiting for API routes (100 requests per 15 mins)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later'
  });



// const dbCheckRoute = require("./routes/dbCheck"); // Importing the route for checking DB connection
// const errorMiddleware = require("./middleware/errorMiddleware");
// const blogRoutes = require("./routes/blogRoutes");
// const authRoutes = require("./routes/authRoutes");
// const commentRoutes = require("./routes/commentRoutes");
// const userRoutes = require("./routes/userRoutes");
// const adminRoutes = require("./routes/adminRoutes");


// =========================
// MIDDLEWARE CONFIGURATION
// =========================

// Enable Cross-Origin Resource Sharing (CORS)
// This allows frontend applications from different origins to communicate with our backend
// app.use(cors());

// Use Helmet to secure the app by setting various HTTP headers
// Helps prevent common security vulnerabilities like XSS, clickjacking, etc.
// app.use(helmet());

// Use Morgan to log HTTP requests in the console
// The "dev" format provides concise output with method, status, response time, etc.
// app.use(morgan("dev"));

// =========================
// ROUTE DEFINITIONS
// =========================

// Define API routes
// All routes inside "dbCheckRoute" will be prefixed with "/api"
// app.use('/api/', apiLimiter); // Apply to all API routes
// app.use("/api", dbCheckRoute);


// Data sanitization
// Against NoSQL injection
// app.use(mongoSanitize({
//     replaceWith: '_',
//     dryRun: true // Only log without modifying
//   }));
  
// app.use(xss()); // Against XSS attacks
// Prevent parameter pollution (whitelist allowed params)
app.use(hpp({
    whitelist: ['title'] // Blog-specific allowed dupes
  }));


// ===========================================
// LOGGING (Production-grade)
// ===========================================
app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/requests.log' })
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    meta: true,
    // msg: "HTTP {{req.method}} {{req.url}}",
    ignoreRoute: (req) => req.path === '/api/health' // Skip health checks
  }));




// ===========================================
// ROUTES
// ===========================================
const apiRoutes = require('./routes'); // Centralized routes
app.use('/api', apiLimiter, apiRoutes);


//   const { registerUser } = require("./controllers/authController");
// app.use("/api/blogs", blogRoutes);  // Blog routes
// app.use("/api/auth", authRoutes);    // Authentication routes
// app.use("/api/comments", commentRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/admin",adminRoutes);

// // Global Error Handling Middleware
// app.use(errorMiddleware);

// ===========================================
// ERROR HANDLING
// ===========================================
const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);



// =========================
// EXPORT APP INSTANCE
// =========================

// Export the app instance to be used in server.js
// This allows a clean separation between the Express application and the server setup
module.exports = app;
