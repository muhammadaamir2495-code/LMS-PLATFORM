const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const cloudinary = require('../config/cloudinary');
const asyncHandler = require('../middleware/asyncHandler');
const { getPublicIdFromUrl } = require('../utils/cloudinaryHelper');

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
exports.getCourses = asyncHandler(async (req, res) => {
  let queryArgs = {};

  // Security Filter: Only show published courses to public/students
  const canSeeDrafts = req.user && (req.user.role === 'admin' || (req.query.instructor && req.user.id === req.query.instructor));
  
  if (!canSeeDrafts) {
    queryArgs.status = 'published';
  }

  // Filter by instructor
  if (req.query.instructor) {
    queryArgs.instructor = req.query.instructor;
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
  const skip = (page - 1) * limit;
  const total = await Course.countDocuments(queryArgs);

  let query = Course.find(queryArgs)
    .populate({ path: 'instructor', select: 'name email' })
    .populate('enrollmentsCount')
    .skip(skip)
    .limit(limit);

  // Sorting
  if (req.query.sort) {
    const sortMapping = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'latest': { createdAt: -1 }
    };
    query = query.sort(sortMapping[req.query.sort] || { createdAt: -1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    message: 'Courses fetched successfully',
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    },
    data: courses,
  });
});

/**
 * @desc    Get single course
 * @route   GET /api/courses/:id
 * @access  Public
 */
exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'instructor',
    select: 'name email',
  });

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Security Check: Only instructors and admins can view unpublished courses
  if (course.status !== 'published') {
    const canView = req.user && (req.user.role === 'admin' || course.instructor._id.toString() === req.user.id);
    if (!canView) {
      res.status(403);
      throw new Error('This course is not published yet');
    }
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Private (Instructor/Admin)
 */
exports.createCourse = asyncHandler(async (req, res) => {
  req.body.instructor = req.user.id;
  
  if (req.file) {
    req.body.thumbnail = req.file.path;
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course,
  });
});

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private (Instructor/Admin)
 */
exports.updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Owner/Admin check
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this course');
  }

  if (req.file) {
    // Delete old thumbnail
    if (course.thumbnail && course.thumbnail.includes('cloudinary')) {
      const publicId = getPublicIdFromUrl(course.thumbnail);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(err => console.error('Cloudinary cleanup error:', err));
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
    message: 'Course updated successfully',
    data: course,
  });
});

/**
 * @desc    Publish course
 * @route   PUT /api/courses/:id/publish
 * @access  Private (Instructor/Admin)
 */
exports.publishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to publish this course');
  }

  course.status = 'published';
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course published successfully',
    data: course,
  });
});

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Private (Instructor/Admin)
 */
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this course');
  }

  // Cloudinary cleanup
  if (course.thumbnail && course.thumbnail.includes('cloudinary')) {
    const publicId = getPublicIdFromUrl(course.thumbnail);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch(err => console.error('Cloudinary deletion error:', err));
    }
  }

  // Cleanup enrollments
  await Enrollment.deleteMany({ course: req.params.id });
  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
    data: {},
  });
});
