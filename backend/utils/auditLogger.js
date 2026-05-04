const Audit = require('../models/Audit');
const logger = require('./logger');

/**
 * PRODUCTION-GRADE AUDIT LOGGER
 * @param {Object} data - Audit context
 */
const logAudit = async ({ req, user, action, entity, entityId, metadata }) => {
  try {
    await Audit.create({
      user: user?._id || user?.id || req?.user?.id,
      action,
      entity,
      entityId,
      metadata,
      ipAddress: req?.ip,
      userAgent: req?.headers['user-agent']
    });
    logger.info(`🔍 [AUDIT] ${action} by ${user?.id || req?.user?.id}`);
  } catch (error) {
    logger.error(`❌ Audit Log Failure: ${error.message}`);
  }
};

module.exports = logAudit;
