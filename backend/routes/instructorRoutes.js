const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// All instructor routes require authentication and instructor role
router.use(protect);
router.use(authorize('instructor', 'admin'));

// @desc    Get instructor's courses with analytics
// @route   GET /api/instructor/courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    
    // Add enrollment counts to each course
    const coursesWithStats = await Promise.all(courses.map(async (course) => {
      const enrollmentsCount = await Enrollment.countDocuments({ course: course._id });
      return { ...course._doc, enrollmentsCount };
    }));

    res.json({ success: true, data: coursesWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get students enrolled in a specific course
// @route   GET /api/instructor/courses/:courseId/students
router.get('/courses/:courseId/students', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email')
      .select('progress createdAt');
    
    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
