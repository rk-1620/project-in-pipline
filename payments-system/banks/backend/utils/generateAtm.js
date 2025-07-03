// utils/generateAtmDetails.js
import bcrypt from "bcrypt";

export function generateCardNumber() {
  return "5521" + Math.floor(100000000000 + Math.random() * 900000000000);
}

export function generateCVV() {
  return Math.floor(100 + Math.random() * 900).toString();
}

export function generateExpiryDate() {
  const now = new Date();
  const expiry = new Date(now.setFullYear(now.getFullYear() + 5));
  return `${expiry.getMonth().toString().padStart(2, '0')}/${expiry.getFullYear().toString().slice(2)}`;
}

export async function hashPin(pin) {
  return await bcrypt.hash(pin.toString(), 10);
}
