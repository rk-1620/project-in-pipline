import { Transaction } from "../models/Transaction.js";
import { Account } from "../models/Accounts.js";

// Utility to generate unique transaction ID
const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
};

// @desc Create a new transaction
// @route POST /api/transactions
export const createTransaction = async (req, res, next) => {
    try {
      const { senderAccountNumber, receiverAccountNumber, amount, type, mode, purpose, remarks } = req.body;
  
      // Validation for required fields
      if (!senderAccountNumber || !receiverAccountNumber || !amount || !type) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      if (senderAccountNumber === receiverAccountNumber) {
        return res.status(400).json({ success: false, message: "Sender and receiver cannot be the same account" });
      }
  
      // Fetch the sender and receiver accounts
      const senderAccount = await Account.findOne({ accountNumber: senderAccountNumber });
      const receiverAccount = await Account.findOne({ accountNumber: receiverAccountNumber });
  
      if (!senderAccount || !receiverAccount) {
        return res.status(404).json({ success: false, message: "One or both accounts not found" });
      }
  
      // Check sender's balance for debit transactions
      if (type === "Debit" && senderAccount.balance < amount) {
        return res.status(400).json({ success: false, message: "Insufficient funds" });
      }
  
      // Perform the transaction: update balances
      if (type === "Debit") {
        senderAccount.balance -= amount;
        receiverAccount.balance += amount;
      } else if (type === "Credit") {
        receiverAccount.balance += amount;
      }
  
      await senderAccount.save();
      await receiverAccount.save();
  
      // Create the transaction record
      const transaction = await Transaction.create({
        transactionId: generateTransactionId(),
        senderAccountNumber,
        receiverAccountNumber,
        amount,
        type,
        mode: mode || "UPI",  // Default mode to "UPI"
        status: "Success",  // Set to "Success" once completed
        purpose: purpose || "Personal",  // Default purpose
        remarks,
        completedAt: new Date(), 
      });
  
      res.status(201).json({
        success: true,
        message: "Transaction completed successfully",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  };

// @desc Get all transactions
export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

// @desc Get transaction by ID
export const getTransactionById = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc Get all transactions of an account
export const getTransactionsByAccount = async (req, res, next) => {
  try {
    const { accountNumber } = req.params;

    const transactions = await Transaction.find({
      $or: [{ fromAccountNumber: accountNumber }, { toAccountNumber: accountNumber }]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};
