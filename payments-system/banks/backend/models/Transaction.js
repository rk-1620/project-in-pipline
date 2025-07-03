import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  transactionId: {type: String,required: true,unique: true,},
  senderAccountNumber: {type: String,required: true,},
  receiverAccountNumber: {type: String,required: true,},
  amount: {type: Number,required: true,min: 1,},
  type: {type: String,enum: ["Debit", "Credit"],required: true,},
  mode: {type: String,enum: ["UPI", "IMPS", "NEFT", "RTGS"],default: "UPI",},
  status: {type: String,enum: ["Pending", "Success", "Failed"],default: "Pending",},
  purpose: {type: String,default: "Personal",},
  remarks: {type: String,},
  initiatedAt: {type: Date,default: Date.now,},
  completedAt: {type: Date,},
}, { timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);
