const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
} = require('../controllers/courseController');

const { protect, authorize, loadUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router
  .route('/')
  .get(loadUser, getCourses)
  .post(protect, authorize('instructor', 'admin'), upload.single('thumbnail'), createCourse);

router
  .route('/:id')
  .get(loadUser, getCourse)
  .put(protect, authorize('instructor', 'admin'), upload.single('thumbnail'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router
  .route('/:id/publish')
  .put(protect, authorize('instructor', 'admin'), publishCourse);

module.exports = router;
