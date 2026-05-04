const Redis = require('ioredis');
const logger = require('../utils/logger');
const config = require('./index');

let redis;

try {
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL);
    logger.info('🚀 Redis Connected Successfully');
  } else {
    logger.warn('⚠️ REDIS_URL not found. Caching will be disabled.');
    // Mock redis for development without Redis server
    redis = {
      get: async () => null,
      set: async () => null,
      del: async () => null,
    };
  }
} catch (error) {
  logger.error('❌ Redis Connection Failed:', error.message);
}

module.exports = redis;
