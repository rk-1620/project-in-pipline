const mongoose = require('mongoose');

// const CommentSchema = new mongoose.Schema({
//     post: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'Blog',  // Reference to Blog model
//         required: true 
//     },
//     user: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User',  // Reference to User model
//         required: true 
//     },
//     text: { 
//         type: String, 
//         required: true,
//         trim: true,
//         maxlength: [500, 'Comment cannot exceed 500 characters']
//     },
//     createdAt: { 
//         type: Date, 
//         default: Date.now 
//     }
// });

// module.exports = mongoose.model('Comment', CommentSchema);



const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
        validate: {
            validator: async (v) => {
                const blog = await mongoose.model('Blog').findById(v);
                return !!blog;
            },
            message: 'Blog post does not exist'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async (v) => {
                const user = await mongoose.model('User').findById(v);
                return !!user;
            },
            message: 'User does not exist'
        }
    },
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        trim: true,
        minlength: [1, 'Comment cannot be empty'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    reactions: {
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 }
    }
}, {
    timestamps: true,   
    toJSON: { virtuals: true }
});

// Index for faster querying
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ user: 1 });

module.exports = mongoose.model('Comment', CommentSchema)