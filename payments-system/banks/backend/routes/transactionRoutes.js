import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByAccount
} from "../controllers/transactionControllers.js";

const router = express.Router();

// @route   POST /api/transactions
router.post("/", createTransaction);

// @route   GET /api/transactions
router.get("/", getAllTransactions);

// @route   GET /api/transactions/:transactionId
router.get("/:transactionId", getTransactionById);

// @route   GET /api/transactions/account/:accountNumber
router.get("/account/:accountNumber", getTransactionsByAccount);

export default router;
