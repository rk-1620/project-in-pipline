import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },  // e.g., "Grocery shopping"
  amount: { type: Number, required: true, min: 0 },     // renamed from "expense"
  note: { type: String, trim: true, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true });  // adds createdAt and updatedAt

export default mongoose.model('Expense', expenseSchema);
