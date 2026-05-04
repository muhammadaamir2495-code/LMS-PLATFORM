const Activity = require('../models/Activity');

/**
 * PRODUCTION-GRADE LOGGER MIDDLEWARE
 * Tracks all incoming requests and logs them to console & optional DB.
 */
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user ? req.user.id : 'anonymous',
      ip: req.ip,
      timestamp: new Date().toISOString()
    };

    // Structured Logging via Winston
    logger.info(`[${log.timestamp}] ${log.method} ${log.url} ${log.status} - ${log.duration}`);

    // Critical Action Logging to MongoDB
    if (req.method !== 'GET' && res.statusCode < 400) {
      // Background logging to prevent blocking response
      Activity.create({
        user: req.user ? req.user.id : null,
        type: 'system',
        message: `${log.method} ${log.url} - Status: ${log.status}`
      }).catch(err => console.error('Logger DB Error:', err.message));
    }
  });

  next();
};

module.exports = loggerMiddleware;
