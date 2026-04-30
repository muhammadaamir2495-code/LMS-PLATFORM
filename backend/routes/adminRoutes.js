const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalStudents, totalInstructors] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        totalStudents,
        totalInstructors
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch platform telemetry' });
  }
});

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching admin users:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch user registry' });
  }
});

// @desc    Get All Courses
// @route   GET /api/admin/courses
// @access  Private/Admin
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
