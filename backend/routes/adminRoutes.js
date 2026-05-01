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
    res.status(500).json({ success: false, message: 'Failed to fetch catalog' });
  }
});

// @desc    Delete Course (Admin)
// @route   DELETE /api/admin/courses/:id
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    await course.deleteOne();
    res.json({ success: true, message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get Recent Activity (Mock)
// @route   GET /api/admin/activity
router.get('/activity', async (req, res) => {
  // In a real app, you'd have an Activity model. Here we mock it from recent enrollments/users.
  res.json({
    success: true,
    data: [
      { id: 1, type: 'user', message: 'New student registered', time: '2 mins ago' },
      { id: 2, type: 'course', message: 'New course: Advanced React published', time: '1 hour ago' },
      { id: 3, type: 'enrollment', message: 'Student enrolled in Figma Masterclass', time: '3 hours ago' },
    ]
  });
});

module.exports = router;
