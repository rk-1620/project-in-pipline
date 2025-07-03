// import Admin from "../models/Admin.js";
const Admin = require("../models/Admin")

// import jwt from 'jsonwebtoken'
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiErrors');


const protectAdmin = async (req, res , next)=>
{
        // // ?. (optional chaining operator) - Safely checks if authorization exists before proceeding
        // // Prevents errors if the header is missing
        // const token = req.headers.authorization?.split(' ')[1];
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // //.select('-password')
        // // Modifies the query to EXCLUDE the password field
        // // Security best practice - never return passwords to the client
        // // The - means "exclude this field"
        // req.admin = await Admin.findById(decoded.id).select('-password')

        // 1. Token Extraction
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new ApiError(401, 'Authorization token required'));
        }

        const token = authHeader.split(' ')[1];

        try {
            // 2. Token Verification
            const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET);
            
            // 3. Admin Lookup
            const admin = await Admin.findById(decoded.id)
              .select('-password -__v')
              .lean();
        
            if (!admin) {
              throw new ApiError(401, 'Admin account not found');
            }
        
            // 4. Attach Admin to Request
            req.admin = {
              id: admin._id,
              username: admin.username,
              role: 'admin' // Explicit role assignment
            };
        
            next();
          } catch (err) {
            // 5. Error Handling
            const errorMap = {
              'TokenExpiredError': 'Admin token expired',
              'JsonWebTokenError': 'Invalid admin token',
              'NotBeforeError': 'Admin token not active'
            };
        
            const message = errorMap[err.name] || 'Admin authorization failed';
            next(new ApiError(401, message));
          }
};
        
module.exports = protectAdmin;