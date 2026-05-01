require('dotenv').config();

// Global Error Listeners
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
});

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const seedAdmin = require('./utils/seeder');

// 🚀 Initialize Express
const app = express();

// 🔌 Database Connection
connectDB();

// 🔐 Production Secret Check
if (!process.env.JWT_SECRET) {
  console.log("⚠️ WARNING: JWT_SECRET is missing from environment variables!");
}

// 🛠️ Global Middleware
app.use(express.json());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : 'http://localhost:5173',
    'http://localhost:3000',
    'https://your-backend.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 📁 Static Folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🛣️ Route Registration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/enrollmentRoutes'));
app.use('/api/dev', require('./routes/devRoutes'));

// 🏠 Base Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NexusLMS API is operational',
    version: '1.0.0'
  });
});

// ⚠️ 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// 🛑 Centralized Error Handler
app.use(errorHandler);

// 🏗️ Startup Sequence
const PORT = process.env.PORT || 8080;

const startServer = () => {
  try {
    app.listen(PORT);
    
    // Run Auto-Seeding asynchronously (Non-blocking)
    seedAdmin();
  } catch (error) {
    console.error('❌ Critical Startup Failure:', error.message);
    process.exit(1);
  }
};

startServer();
