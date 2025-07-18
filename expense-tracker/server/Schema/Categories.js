import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  budget: { type: Number, required: true, min: 0 },
}, { timestamps: true });

// Prevent duplicate category names for the same user
categorySchema.index({ name: 1, userId: 1 }, { unique: true }); 

export default mongoose.model('Category', categorySchema);
