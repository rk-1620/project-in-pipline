// import dependencies

import express from 'express';
import dotenv from 'dotenv';

import cors from 'cors';

// dotenv is a Node.js module that reads variables from a .env file
// and makes them available in the process.env object. This allows 
// you to store configuration variables (like database URIs, API keys, etc.) 
// outside of your source code, making your application more secure and flexible.
dotenv.config();

//structure of code matters empty app express should always on top
const app = express();

// The app.use() method in Express.js is used to mount middleware in 
// your application. Middleware are functions that have access to the 
// request (req), response (res), and the next function in the application’s
//  request-response cycle.
// In simple terms, middleware can be thought of as a layer of code that
//  processes the incoming requests before they reach your route handlers
//  (or after). It can be used for a variety of purposes


// CORS (Cross-Origin Resource Sharing) is a type of middleware in Express.js.
// It is used to enable or restrict resources on a web server based on the
// origin of the request (i.e., which domain or URL is making the request).
//
// In web development, CORS is important when you want to allow your server
// to respond to requests made from different origins (domains, protocols,
// or ports). By default, web browsers restrict web pages from making
// requests to a domain other than the one that served the web page. 
// This is a security feature called the Same-Origin Policy. However, 
// CORS allows you to relax this restriction and specify which domains 
// can access the resources on your server.
app.use(cors());

app.use(express.json());

import connectDB from './config/db.js';

// import the all routes that is needed
import adminRoutes from'./routes/adminRoutes.js';
import accountsRoutes from './routes/accountsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import bankRoutes from './routes/bankRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

app.use('/api/v1/admin',adminRoutes);
app.use('/api/v1/employee',employeeRoutes);
app.use('/api/v1/accounts', accountsRoutes);
app.use('/api/v1/banks', bankRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/transaction',transactionRoutes);


// Global error handing module
app.use((error,req,res,next)=>{
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
    res.status(status).json({success:false, message});
});

// connect to the database
connectDB();

export default app;







