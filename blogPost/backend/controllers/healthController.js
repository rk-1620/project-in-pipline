// controllers/healthController.js
const healthService = require('../services/healthService');

exports.getHealthStatus = async (req, res) => {
  try {
    const [dbStatus, memory] = await Promise.all([
      healthService.checkDatabase(),
      healthService.checkMemoryUsage()
    ]);

    res.json({
      status: 'API operational',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      system: memory,
      dependencies: {
        // Add other dependency checks if needed
      }
    });
  } catch (err) {
    res.status(503).json({
      status: 'API degraded',
      error: err.message
    });
  }
};