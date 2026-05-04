const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('./logger');

/**
 * PRODUCTION-GRADE EMAIL SERVICE
 * Handles verification, password resets, and alerts.
 */
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });

    const message = {
      from: config.email.from,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    logger.info(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`❌ Email Failure: ${error.message}`);
    // Do not throw here to prevent breaking auth flow, just log it
    return null;
  }
};

module.exports = sendEmail;
