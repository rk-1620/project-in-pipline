const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//      // Add this array to store blog references
//     blogs: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Blog', // Reference to the Blog model
//     }],
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('User', UserSchema);



const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Never returned in queries
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        validate: {
            validator: async (v) => {
                const count = await mongoose.model('Blog').countDocuments({ _id: { $in: v } });
                return count === v.length;
            },
            message: 'One or more blogs do not exist'
        }
    }],
    lastActiveAt: {
        type: Date
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add the token generation method
UserSchema.methods.generateAuthToken = function() {
    return jwt.sign(
      { id: this._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
  };
// Index for frequently queried fields
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 'text' }); // For text search

module.exports = mongoose.model('User', UserSchema);