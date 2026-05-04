const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  
  // 📧 SaaS VERIFICATION FLOW
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpires: Date,
  
  // 🔑 PASSWORD RESET
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Generate Email Verification Token
 */
userSchema.methods.generateEmailVerificationToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return token;
};

module.exports = mongoose.model('User', userSchema);
