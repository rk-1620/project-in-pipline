const mongoose = require('mongoose');
const { blogCreateSchema } = require('../validators/blogValidator');

// const BlogSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     name:{ type:String, required:true},
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User', // Reference to the User model
//         required: true,
//       },
//       createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Blog', BlogSchema);


const BlogSchema = new mongoose.Schema({
  title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [50, 'Content must be at least 50 characters']
  },
  excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot exceed 200 characters']
  },
  slug: {
      type: String,
      unique: true,
      lowercase: true
  },
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      validate: {
          validator: async (v) => {
              const user = await mongoose.model('User').findById(v);
              return !!user;
          },
          message: 'Author does not exist'
      }
  },
  tags: [{
      type: String,
      maxlength: [20, 'Tags cannot exceed 20 characters']
  }],
  status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
  },
  featuredImage: {
      url: String,
      altText: String
  },
  reactions: {
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Text search index
BlogSchema.index({ title: 'text', content: 'text' });

// In your Blog schema (add this alongside your existing virtual)
BlogSchema.virtual('comments', {
    ref: 'Comment',          // The model to use
    localField: '_id',       // Field in Blog model (blog ID)
    foreignField: 'post',    // Field in Comment model that references the blog
    options: { 
      sort: { createdAt: -1 } // Optional: sort comments by newest first
    }
  });
  
// Virtual for comment count
BlogSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

module.exports =  mongoose.model('Blog', BlogSchema);