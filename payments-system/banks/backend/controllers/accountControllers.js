import { ATMCard, Account } from "../models/Accounts.js";
import { generateAccountNumber } from "../utils/generateAccountNo.js";
import { generateCVV, generateCardNumber, generateExpiryDate, hashPin } from "../utils/generateAtm.js";

// Create Account Controller
export const createAccount = async (req, res, next) => {
  try {
    // Generate unique account number using serial
    const serial = await Account.countDocuments();
    const accNo = generateAccountNumber("1001", "0001", serial + 1);

    // Create the Account
    const account = await Account.create({
      ...req.body,
      accountNumber: accNo,
    });

    // Generate ATM card details
    const cardNumber = generateCardNumber();
    const cvv = generateCVV();
    const expiry = generateExpiryDate();
    const pin = await hashPin("1234"); // Default PIN, consider changing for production

    // Create ATM card linked to this account
    const atmCard = await ATMCard.create({
      accountId: account._id,
      cardNumber,
      cvv,
      expiryDate: expiry,
      pin,
    });

    res.status(201).json({
      success: true,
      message: "Account and ATM Card created successfully",
      accountId: account._id,
      accountNumber: accNo,
      cardNumber,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Account Controller
export const deleteAccount = async (req, res, next) => {
  try {
    const { accountNumber } = req.params;

    // Find the account
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Delete the linked ATM card(s)
    await ATMCard.deleteMany({ accountId: account._id });

    // Delete the account
    await Account.deleteOne({ _id: account._id });

    res.status(200).json({
      success: true,
      message: "Account and associated ATM Card(s) deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update Account Controller
export const updateAccount = async (req, res, next) => {
  try {
    const { accountNumber } = req.params;

    // Find the account
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Ensure you don't allow certain fields to be updated (e.g., accountNumber or balance)
    const updatedData = req.body;
    if (updatedData.accountNumber || updatedData.balance) {
      return res.status(400).json({ message: "Cannot update account number or balance" });
    }

    // Update the account with the provided data
    const updatedAccount = await Account.findOneAndUpdate(
      { accountNumber },
      { $set: updatedData }, // Update the account fields with new data
      { new: true } // Return the updated document
    );

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    next(error);
  }
};
