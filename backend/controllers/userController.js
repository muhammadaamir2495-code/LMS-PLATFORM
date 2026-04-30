const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');

// Helper to extract Cloudinary public_id
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary')) return null;
  const parts = url.split('/');
  const filename = parts.pop().split('.')[0];
  const folder = parts.pop();
  return `${folder}/${filename}`;
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await User.countDocuments();

    const users = await User.find()
      .select('-password')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      },
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Cascade Delete Logic
    if (user.role === 'instructor') {
      // Find all courses by this instructor
      const courses = await Course.find({ instructor: user._id });
      for (const course of courses) {
        // Delete course images
        if (course.thumbnail && course.thumbnail.includes('cloudinary')) {
          const publicId = getPublicIdFromUrl(course.thumbnail);
          if (publicId) {
            try {
              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.error('Failed to delete course image on user delete:', err);
            }
          }
        }
        // Delete enrollments for this course
        await Enrollment.deleteMany({ course: course._id });
        await course.deleteOne();
      }
    } else if (user.role === 'student') {
      // Delete all enrollments for this student
      await Enrollment.deleteMany({ student: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
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
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if updating email and it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
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
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Get admin statistics
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const instructorCount = await User.countDocuments({ role: 'instructor' });
    const courseCount = await Course.countDocuments();
    const enrollmentCount = await Enrollment.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalStudents: studentCount,
        totalInstructors: instructorCount,
        totalCourses: courseCount,
        totalEnrollments: enrollmentCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};
