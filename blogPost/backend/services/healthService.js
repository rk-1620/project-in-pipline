// services/healthService.js
const mongoose = require('mongoose');

module.exports = {
  checkDatabase: async () => {
    try {
      await mongoose.connection.db.admin().ping();
      return { status: 'healthy' };
    } catch (err) {
      return { status: 'unhealthy', error: err.message };
    }
  },

  checkMemoryUsage: () => {
    return {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };
  }
};