const express = require('express');
const { register, login, refresh, logout, getSessions, revokeSession, verifyEmail } = require('../controllers/authController');

const validate = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../utils/validators');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/verify-email/:token', verifyEmail);
// @route   POST /api/v1/auth/logout
router.post('/logout', logout);

// 🛡️ SESSION MANAGEMENT (Task 1)
router.get('/sessions', protect, getSessions);
router.delete('/sessions/:id', protect, revokeSession);

module.exports = router;
