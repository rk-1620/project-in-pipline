
import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { Account } from "../models/Accounts.js";

export const userLogin = async (req,res,next)=>{
    try {
        const { mobile, password } = req.body;
    
        const user = await User.findOne({ mobile });
        if (!user || !(await user.matchPassword(password))) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
    
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
    
        res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          user: {
            id: user._id,
            username: user.username,
            mobile: user.mobile,
            email: user.email,
          },
        });
      } catch (err) {
        next(err);
      }

}
export const userRegister = async(req, res, next)=>{
    try{
        const { username, mobile, email, accountNumber, password} = req.body;

        // Check if account exists
        const accountExists = await Account.findOne({accountNumber});
        if (!accountExists) {
        return res.status(400).json({ message: "Linked account not found" });
        }

        const user = await User.create({ username, mobile, email, accountNumber,password });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
        res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
        token
        });
    } catch (error) {
        next(error);
    }
}
export const getProfile = async (req, res, next)=>{

}


// Delete user
export const deleteUser = async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
      next(error);
    }
};
