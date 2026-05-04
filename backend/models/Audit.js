const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN_SUCCESS', 
      'LOGIN_FAILURE', 
      'LOGOUT', 
      'COURSE_CREATED', 
      'COURSE_UPDATED', 
      'COURSE_DELETED', 
      'USER_REGISTERED',
      'SESSION_REVOKED',
      'PASSWORD_CHANGED',
      'EMAIL_VERIFIED'
    ]
  },
  entity: {
    type: String,
    required: true // 'user', 'course', 'enrollment'
  },
  entityId: {
    type: mongoose.Schema.ObjectId
  },
  metadata: {
    type: Object
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Audit', auditSchema);
