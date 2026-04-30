const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Enrollment.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    console.log('Existing data cleared...');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // 1. Create Instructors
    const instructors = await User.create([
      { name: 'Dr. Sarah Smith', email: 'sarah@example.com', password, role: 'instructor' },
      { name: 'Prof. James Wilson', email: 'james@example.com', password, role: 'instructor' },
      { name: 'Alex Rivera', email: 'alex@example.com', password, role: 'instructor' },
    ]);
    console.log('Instructors created...');

    // 2. Create Students
    const students = await User.create([
      { name: 'John Doe', email: 'john@example.com', password, role: 'student' },
      { name: 'Emily Brown', email: 'emily@example.com', password, role: 'student' },
      { name: 'Michael Chen', email: 'michael@example.com', password, role: 'student' },
      { name: 'Sophia Garcia', email: 'sophia@example.com', password, role: 'student' },
      { name: 'David Lee', email: 'david@example.com', password, role: 'student' },
    ]);
    console.log('Students created...');

    // 3. Create Courses
    const coursesData = [
      // Web Development
      {
        title: 'Full Stack Web Development with React',
        description: 'Master modern web development from frontend to backend using React, Node, and MongoDB.',
        category: 'Web Development',
        price: 99.99,
        instructor: instructors[0]._id,
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Advanced JavaScript Patterns',
        description: 'Deep dive into functional programming, closures, and design patterns in modern JS.',
        category: 'Web Development',
        price: 79.99,
        instructor: instructors[0]._id,
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Node.js Backend Architecture',
        description: 'Learn to build scalable and secure backend systems with Node.js and Express.',
        category: 'Web Development',
        price: 89.99,
        instructor: instructors[0]._id,
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      // UI/UX Design
      {
        title: 'Mastering Figma for Designers',
        description: 'A comprehensive guide to designing high-fidelity prototypes and design systems in Figma.',
        category: 'UI/UX Design',
        price: 59.99,
        instructor: instructors[1]._id,
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'User Research & Psychology',
        description: 'Understand how users think and behave to create more effective and engaging experiences.',
        category: 'UI/UX Design',
        price: 69.99,
        instructor: instructors[1]._id,
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Mobile App Design Fundamentals',
        description: 'Learn the principles of designing intuitive and beautiful mobile applications.',
        category: 'UI/UX Design',
        price: 64.99,
        instructor: instructors[1]._id,
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      // Data Science
      {
        title: 'Python for Data Science Bootcamp',
        description: 'Learn Python, NumPy, Pandas, and Matplotlib for data analysis and visualization.',
        category: 'Data Science',
        price: 119.99,
        instructor: instructors[2]._id,
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Machine Learning A-Z',
        description: 'Building predictive models using Scikit-Learn and modern ML algorithms.',
        category: 'Data Science',
        price: 129.99,
        instructor: instructors[2]._id,
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1527477321055-43ea9179d8f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Data Visualization with Tableau',
        description: 'Create stunning dashboards and tell compelling stories with your data.',
        category: 'Data Science',
        price: 84.99,
        instructor: instructors[2]._id,
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
    ];

    const courses = await Course.create(coursesData);
    console.log('Courses created...');

    // 4. Create Enrollments (Task 2)
    const enrollments = [];
    for (let i = 0; i < students.length; i++) {
      // Randomly enroll each student in 1-3 courses
      const numCourses = Math.floor(Math.random() * 3) + 1;
      const selectedCourses = [...courses].sort(() => 0.5 - Math.random()).slice(0, numCourses);

      for (const course of selectedCourses) {
        enrollments.push({
          student: students[i]._id,
          course: course._id,
          progress: Math.floor(Math.random() * 91) + 10, // 10% to 100%
        });
      }
    }

    await Enrollment.create(enrollments);
    console.log('Enrollments created...');

    // Create an Admin User
    await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password,
      role: 'admin'
    });
    console.log('Admin created...');

    console.log('Database Seeded Successfully! 🚀');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
