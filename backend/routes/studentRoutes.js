const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getMyCourses, enrollInCourse, updateProgress } = require('../controllers/enrollmentController');

// All student routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

// @desc    Get student's enrolled courses
// @route   GET /api/student/my-courses
router.get('/my-courses', getMyCourses);

// @desc    Enroll in a new course
// @route   POST /api/student/enroll/:courseId
router.post('/enroll/:courseId', enrollInCourse);

// @desc    Update progress in a course
// @route   PUT /api/student/progress/:courseId
router.put('/progress/:courseId', updateProgress);

module.exports = router;
