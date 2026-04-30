const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAdminStats, getUsers, deleteUser } = require('../controllers/userController');
const Course = require('../models/Course');

// All routes here require admin access
router.use(protect);
router.use(authorize('admin'));

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
router.get('/stats', getAdminStats);

// @desc    Get All Users
// @route   GET /api/admin/users
router.get('/users', getUsers);

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

// @desc    Get All Courses
// @route   GET /api/admin/courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Error fetching admin courses:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch module catalog' });
  }
});

module.exports = router;
