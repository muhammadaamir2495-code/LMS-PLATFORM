require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const adminRoutes = require('./routes/adminRoutes'); // New import
const devRoutes = require('./routes/devRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes); // New registration
app.use('/api', enrollmentRoutes);
app.use('/api/dev', devRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('LMS API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`🔴 Server Error: ${err.message}`);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

/**
 * AUTO-SEED ADMIN USER
 * Ensures admin@gmail.com exists with password admin123 on every startup
 */
const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Production Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Auto-Seeded Production Admin (admin@gmail.com)');
    }
  } catch (error) {
    console.error('❌ Admin Auto-Seeding Failed:', error.message);
  }
};

const PORT = process.env.PORT || 5000;

/**
 * STARTUP SEQUENCE
 * We MUST connect to the database successfully before opening the port
 */
const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();
    
    // 2. Run Auto-Seeding
    await seedAdmin();
    
    // 3. Listen for requests
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Critical Startup Failure:', error.message);
    process.exit(1);
  }
};

startServer();
