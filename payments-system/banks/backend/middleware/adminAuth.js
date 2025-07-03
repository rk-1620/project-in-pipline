import jwt from 'jsonwebtoken';
import Admin from '../models/Admins.js';

const adminAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(!decoded){return res.status(411).json({message:"Unauthorised access"});} 
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!admin) {
        res.status(401);
        throw new Error('Admin not found');
      }

      req.user = admin;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

export default adminAuth;
