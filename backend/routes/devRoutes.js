const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

router.get('/seed', async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: password,
      role: 'admin',
    });

    // Create Instructors
    const instructor1 = await User.create({
      name: 'John Smith',
      email: 'john@example.com',
      password: password,
      role: 'instructor',
    });

    const instructor2 = await User.create({
      name: 'Sarah Jane',
      email: 'sarah@example.com',
      password: password,
      role: 'instructor',
    });

    // Create Students
    const student1 = await User.create({
      name: 'Alice Cooper',
      email: 'alice@example.com',
      password: password,
      role: 'student',
    });

    const student2 = await User.create({
      name: 'Bob Ross',
      email: 'bob@example.com',
      password: password,
      role: 'student',
    });

    // Create Courses
    const courses = await Course.create([
      {
        title: 'Full-Stack Web Development',
        description: 'Master the MERN stack from scratch. Learn MongoDB, Express, React, and Node.js.',
        instructor: instructor1._id,
        category: 'Web Development',
        price: 49.99,
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
        status: 'published',
      },
      {
        title: 'Advanced React Patterns',
        description: 'Deep dive into React hooks, context API, and advanced performance optimization.',
        instructor: instructor1._id,
        category: 'Web Development',
        price: 39.99,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600',
        status: 'published',
      },
      {
        title: 'UI/UX Design Essentials',
        description: 'Learn the fundamentals of modern design, typography, and user research.',
        instructor: instructor2._id,
        category: 'Design',
        price: 29.99,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600',
        status: 'published',
      },
      {
        title: 'Data Science with Python',
        description: 'Analyze data like a pro using Pandas, NumPy, and Scikit-Learn.',
        instructor: instructor2._id,
        category: 'Data Science',
        price: 59.99,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
        status: 'published',
      }
    ]);

    // Create Enrollments
    await Enrollment.create([
      {
        student: student1._id,
        course: courses[0]._id,
        progress: 45,
      },
      {
        student: student1._id,
        course: courses[2]._id,
        progress: 10,
      },
      {
        student: student2._id,
        course: courses[1]._id,
        progress: 80,
      }
    ]);

    res.status(200).json({ success: true, message: 'Database seeded successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Seeding failed', error: err.message });
  }
});

module.exports = router;
