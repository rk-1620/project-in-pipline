// utils/generateAccountNumber.js
export function generateAccountNumber(bankCode = "1001", branchCode = "0001", serial) {
    return `${bankCode}${branchCode}${serial.toString().padStart(4, '0')}`;
  }
  