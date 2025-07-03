// // import mongoose from 'mongoose';
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
// // import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken')

// const adminSchema = new mongoose.Schema({
//     username:{type:String, required : true, unique:true},
//     password:{type: String, required: true},
//     createdAt: { type: Date, default: Date.now}

// }, {timestamps:true});

// // hasing the password
// adminSchema.pre('save', async function (next) {
    
//     if(!this.isModified('password')) return next();

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);

//     next();
// });

// adminSchema.methods.matchPassword = async function (enteredpassword) {
//     return bcrypt.compare(enteredpassword, this.password);    
// }

// const Admin = mongoose.model('Admin', adminSchema);

// // export default Admin;
// module.exports = Admin;


const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [10, 'Admin password must be at least 10 characters'],
        select: false
    },
    lastLogin: {
        type: Date
    },
    permissions: {
        type: [String],
        enum: ['users', 'content', 'settings'],
        default: ['users', 'content']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

// Add the token generation method
adminSchema.methods.generateAuthToken = function() {
    return jwt.sign(
      { id: this._id },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
  };

// Security indexes
adminSchema.index({ username: 1 }, { unique: true });
adminSchema.index({ isActive: 1 });

module.exports = mongoose.model('Admin', adminSchema);