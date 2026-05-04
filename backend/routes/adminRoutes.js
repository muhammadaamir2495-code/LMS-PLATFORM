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

const Activity = require('../models/Activity');

// ...

// @desc    Get Recent Activity (Real)
// @route   GET /api/admin/activity
router.get('/activity', async (req, res) => {
  try {
    const activity = await Activity.find()
      .populate('user', 'name role')
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedActivity = activity.map(act => ({
      id: act._id,
      type: act.type,
      message: act.message,
      time: new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    res.json({
      success: true,
      data: formattedActivity
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch activity logs' });
  }
});

module.exports = router;
