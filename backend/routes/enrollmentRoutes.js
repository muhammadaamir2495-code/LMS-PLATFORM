const express = require('express');
const { enrollCourse, getMyCourses, updateProgress } = require('../controllers/enrollmentController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/enroll', protect, authorize('student'), enrollCourse);
router.get('/my-courses', protect, authorize('student'), getMyCourses);
router.put('/progress/:courseId', protect, authorize('student'), updateProgress);

module.exports = router;
