import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, },   // e.g., '2025-07'

  totalAllotted: { type: Number},  // 💰 Fixed total monthly allowance
  totalCap: { type: Number},       // 🎯 Intended spending limit

  // ✅ Make categoryBudgets optional by removing required fields inside the array
  categoryBudgets: [
    {
      categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      categoryName: { type: String },
      budget: { type: Number, min: 0 }
    }
  ],

  note: { type: String, default: "" }

}, { timestamps: true });

budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

export default mongoose.model("Budget", budgetSchema);
