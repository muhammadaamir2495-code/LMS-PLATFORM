const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/enroll
// @access  Private (Student)
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      data: enrollment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Get enrolled courses
// @route   GET /api/my-courses
// @access  Private (Student)
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id }).populate({
      path: 'course',
      populate: {
        path: 'instructor',
        select: 'name',
      },
    });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Update course progress
// @route   PUT /api/progress/:courseId
// @access  Private (Student)
exports.updateProgress = async (req, res) => {
  try {
    let { progress } = req.body;
    const { courseId } = req.params;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({ success: false, message: 'Please provide a valid progress value between 0 and 100' });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    enrollment.progress = progress;
    await enrollment.save();

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};
