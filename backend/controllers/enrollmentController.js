const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Enroll in a course
 * @route   POST /api/enroll
 * @access  Private (Student)
 */
exports.enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    res.status(400);
    throw new Error('Please provide a course ID');
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if already enrolled
  const alreadyEnrolled = await Enrollment.findOne({
    student: req.user.id,
    course: courseId,
  });

  if (alreadyEnrolled) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  const enrollment = await Enrollment.create({
    student: req.user.id,
    course: courseId,
  });

  res.status(201).json({
    success: true,
    message: 'Enrolled successfully',
    data: enrollment,
  });
});

/**
 * @desc    Get enrolled courses for current student
 * @route   GET /api/my-courses
 * @access  Private (Student)
 */
exports.getMyCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user.id }).populate({
    path: 'course',
    populate: {
      path: 'instructor',
      select: 'name email',
    },
  });

  res.status(200).json({
    success: true,
    message: 'Enrolled courses fetched successfully',
    count: enrollments.length,
    data: enrollments,
  });
});

/**
 * @desc    Update course progress
 * @route   PUT /api/progress/:courseId
 * @access  Private (Student)
 */
exports.updateProgress = asyncHandler(async (req, res) => {
  const { progress } = req.body;
  const { courseId } = req.params;

  if (progress === undefined || progress < 0 || progress > 100) {
    res.status(400);
    throw new Error('Please provide a valid progress value between 0 and 100');
  }

  const enrollment = await Enrollment.findOne({
    student: req.user.id,
    course: courseId,
  });

  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found for this user and course');
  }

  enrollment.progress = progress;
  await enrollment.save();

  res.status(200).json({
    success: true,
    message: 'Progress updated successfully',
    data: enrollment,
  });
});
