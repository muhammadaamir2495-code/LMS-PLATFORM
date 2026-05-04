const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  refreshTokenHash: {
    type: String,
    required: true,
    unique: true
  },
  deviceName: {
    type: String,
    default: 'Unknown Device'
  },
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Auto-delete expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
