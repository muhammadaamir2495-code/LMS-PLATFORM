const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const asyncHandler = require('../middleware/asyncHandler');
const { getPublicIdFromUrl } = require('../utils/cloudinaryHelper');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const total = await User.countDocuments();

  const users = await User.find()
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    },
    data: users,
  });
});

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Delete user (with cascade)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent self-deletion
  if (user._id.toString() === req.user.id) {
    res.status(400);
    throw new Error('You cannot delete your own admin account');
  }

  // Cascade Delete Logic
  if (user.role === 'instructor') {
    const courses = await Course.find({ instructor: user._id });
    for (const course of courses) {
      if (course.thumbnail && course.thumbnail.includes('cloudinary')) {
        const publicId = getPublicIdFromUrl(course.thumbnail);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId).catch(err => console.error('Cloudinary cleanup error:', err));
        }
      }
      await Enrollment.deleteMany({ course: course._id });
      await course.deleteOne();
    }
  } else if (user.role === 'student') {
    await Enrollment.deleteMany({ student: user._id });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User and associated data deleted successfully',
    data: {},
  });
});

/**
 * @desc    Create user
 * @route   POST /api/users
 * @access  Private/Admin
 */
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  let user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already exists');
    }
  }

  const updateData = { name, email, role };

  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }

  // Remove undefined fields
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

/**
 * @desc    Get admin statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getAdminStats = asyncHandler(async (req, res) => {
  const [studentCount, instructorCount, courseCount, enrollmentCount] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' }),
    Course.countDocuments(),
    Enrollment.countDocuments()
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalStudents: studentCount,
      totalInstructors: instructorCount,
      totalCourses: courseCount,
      totalEnrollments: enrollmentCount
    }
  });
});

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already taken');
    }
    user.email = email;
  }

  if (name) user.name = name;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});
