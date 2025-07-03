import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    accountNumber: { type: Number, unique: true, required: true }, // Keep accountNumber as a String or Number, but only one definition
    accountHolder: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    bankName: { type: String, required: true },
    bankHeadoffice: { type: String, required: true },
    bankBranch: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: Number, required: true },
    ifscCode: { type: String, required: true },
    balance: { type: Number, default: 0 },
    accountType: {
        type: String,
        enum: ["Savings", "Current"],
        default: "Savings",
    },
    status: {
        type: String,
        enum: ["Active", "Blocked", "Closed"],
        default: "Active",
    },
}, {
    timestamps: true,
});

// ATM Card Schema (Separate but in same file)
const atmCardSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    cardNumber: { type: String, unique: true },
    expiryDate: { type: String }, // e.g., "06/30"
    cvv: { type: String },
    pin: { type: String }, // hashed or plain (hash in production)
    status: {
        type: String,
        enum: ["Active", "Blocked", "Expired"],
        default: "Active"
    },
    issuedDate: { type: Date, default: Date.now }
});

export const Account = mongoose.model("Account", accountSchema);
export const ATMCard = mongoose.model("ATMCard", atmCardSchema);
