const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');
const crypto = require('crypto');
const config = require('../config');
const logger = require('../utils/logger');
const logAudit = require('../utils/auditLogger');

/**
 * Generate Access Token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpire }
  );
};

/**
 * CREATE SECURE SESSION (Task 1 & 2)
 * Binds token to IP, UserAgent, and Device
 */
const createSession = async (user, req, res) => {
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 🛡️ Create Persistent Session in DB
  const session = await Session.create({
    user: user._id,
    refreshTokenHash: crypto.createHash('sha256').update(refreshToken).digest('hex'),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    expiresAt
  });

  // 🍪 Set httpOnly Cookie
  res.cookie('refreshToken', refreshToken, {
    ...config.cookie,
    expires: expiresAt
  });

  return session;
};

/**
 * @desc    Register user
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'student',
  });

  // 📧 Generate Verification Token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  // 🔍 LOG AUDIT
  await logAudit({ req, user, action: 'USER_REGISTERED', entity: 'user', entityId: user._id });

  const accessToken = generateAccessToken(user);
  await createSession(user, req, res);

  res.status(201).json({
    success: true,
    token: accessToken,
    verificationToken, // Return for demo/testing, usually sent via email
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

/**
 * @desc    Login user
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    await logAudit({ req, user: { email }, action: 'LOGIN_FAILURE', entity: 'user' });
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // 🔍 LOG AUDIT
  await logAudit({ req, user, action: 'LOGIN_SUCCESS', entity: 'user', entityId: user._id });

  const accessToken = generateAccessToken(user);
  await createSession(user, req, res);

  res.status(200).json({
    success: true,
    token: accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

/**
 * @desc    Verify Email
 * @route   GET /api/v1/auth/verify-email/:token
 */
exports.verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
  await user.save();

  await logAudit({ req, user, action: 'EMAIL_VERIFIED', entity: 'user', entityId: user._id });

  res.status(200).json({ success: true, message: 'Email verified successfully' });
});

/**
 * @desc    Refresh Token (Task 2: Hardened Validation)
 */
exports.refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error('Session required');
  }

  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const session = await Session.findOne({ refreshTokenHash: hash });

  // 🛡️ SECURITY CHECK: UserAgent binding
  if (!session || !session.isActive) {
    res.status(401);
    throw new Error('Invalid session');
  }

  // IP Address check - More lenient for mobile (log warning instead of logout)
  if (session.ipAddress !== req.ip) {
    logger.warn(`ℹ️ Session IP Change: User ${session.user} from ${session.ipAddress} to ${req.ip}`);
    // Note: We still keep the session valid because mobile IPs rotate frequently
  }

  if (session.userAgent !== req.headers['user-agent']) {
    logger.warn(`🛑 Session Hijack Attempt (UA Mismatch): User ${session.user}`);
    await Session.deleteMany({ user: session.user }); // Force logout all devices on UA hijack attempt
    res.clearCookie('refreshToken');
    res.status(401);
    throw new Error('Security Breach: Session Invalidated');
  }

  const user = await User.findById(session.user);
  const accessToken = generateAccessToken(user);

  // 🔄 ROTATION
  await session.deleteOne();
  await createSession(user, req, res);

  res.status(200).json({ success: true, token: accessToken });
});

/**
 * @desc    Logout User
 */
exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    await Session.findOneAndDelete({ refreshTokenHash: hash });
  }
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out' });
});

/**
 * @desc    Get Active Sessions (Task 1)
 */
exports.getSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user.id });
  res.status(200).json({ success: true, data: sessions });
});

/**
 * @desc    Revoke Session (Task 1)
 */
exports.revokeSession = asyncHandler(async (req, res) => {
  await Session.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.status(200).json({ success: true, message: 'Session revoked' });
});
