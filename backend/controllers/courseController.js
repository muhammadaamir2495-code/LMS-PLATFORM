const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const cloudinary = require('../config/cloudinary');

// Helper to extract Cloudinary public_id
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary')) return null;
  const parts = url.split('/');
  const filename = parts.pop().split('.')[0];
  const folder = parts.pop();
  return `${folder}/${filename}`;
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    let queryArgs = {};

    // Filter by instructor
    if (req.query.instructor) {
      queryArgs.instructor = req.query.instructor;
    }

    // Security Filter: Only show published courses to public/students
    // If filtering by instructor, only show drafts if the requester is that instructor or an admin
    const canSeeDrafts = req.user && (req.user.role === 'admin' || (req.query.instructor && req.user.id === req.query.instructor));
    
    if (!canSeeDrafts) {
      queryArgs.status = 'published';
    }

    // Filter by category
    if (req.query.category && req.query.category !== 'All') {
      queryArgs.category = req.query.category;
    }

    // Search by title
    if (req.query.search) {
      queryArgs.title = { $regex: req.query.search, $options: 'i' };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Course.countDocuments(queryArgs);

    let query = Course.find(queryArgs)
      .populate({ path: 'instructor', select: 'name email' })
      .skip(startIndex)
      .limit(limit);

    // Sorting
    if (req.query.sort) {
      if (req.query.sort === 'price-asc') query = query.sort({ price: 1 });
      if (req.query.sort === 'price-desc') query = query.sort({ price: -1 });
      if (req.query.sort === 'latest') query = query.sort({ createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const courses = await query;

    res.status(200).json({
      success: true,
      count: courses.length,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      },
      data: courses,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'instructor',
      select: 'name email',
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Security Check: Only instructors and admins can view unpublished courses
    if (course.status !== 'published') {
      const canView = req.user && (req.user.role === 'admin' || course.instructor._id.toString() === req.user.id);
      if (!canView) {
        return res.status(403).json({ success: false, message: 'This course is not published yet' });
      }
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
exports.createCourse = async (req, res) => {
  try {
    // Add user to req.body
    req.body.instructor = req.user.id;
    
    if (req.file) {
      req.body.thumbnail = req.file.path;
    }

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this course' });
    }

    if (req.file) {
      // User uploaded a new thumbnail, delete the old one from Cloudinary
      if (course.thumbnail && course.thumbnail.includes('cloudinary')) {
        const publicId = getPublicIdFromUrl(course.thumbnail);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudErr) {
            console.error('Failed to delete old Cloudinary image:', cloudErr);
          }
        }
      }
      req.body.thumbnail = req.file.path;
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Publish course
// @route   PUT /api/courses/:id/publish
// @access  Private (Instructor/Admin)
exports.publishCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to publish this course' });
    }

    course.status = 'published';
    await course.save();

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this course' });
    }

    // Delete associated image from Cloudinary
    if (course.thumbnail && course.thumbnail.includes('cloudinary')) {
      const publicId = getPublicIdFromUrl(course.thumbnail);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.error('Failed to delete Cloudinary image during course deletion:', cloudErr);
        }
      }
    }

    // Delete associated enrollments (Orphaned Enrollment Fix)
    await Enrollment.deleteMany({ course: req.params.id });

    await course.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};
