const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const timeout = require('connect-timeout');
const responseTime = require('response-time');
const { v4: uuidv4 } = require('uuid');

const config = require('./config');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const seedAdmin = require('./utils/seeder');

// 🚀 Initialize Express
const app = express();

// 🔌 Database Connection
connectDB();

// 🛡️ Request ID & Timeout
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});
app.use(timeout('15s')); 

// 📊 Latency Monitoring
app.use(responseTime((req, res, time) => {
  logger.info(`⏱️ [LATENCY] ${req.method} ${req.originalUrl} - ${time.toFixed(2)}ms`);
}));

// 📊 Production Logging (Morgan + Winston)
const morganFormat = config.env === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: { write: (message) => logger.info(message.trim()) } }));

// 🛡️ SECURITY MIDDLEWARE
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(cookieParser());

// 🚦 GLOBAL RATE LIMITER
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests' }
}));

// 🛠️ CORS Configuration
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 📁 Static Folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🛣️ API VERSIONING (v1)
const v1Prefix = '/api/v1';
app.use(`${v1Prefix}/auth`, require('./routes/authRoutes'));
app.use(`${v1Prefix}/users`, require('./routes/userRoutes'));
app.use(`${v1Prefix}/courses`, require('./routes/courseRoutes'));
app.use(`${v1Prefix}/admin`, require('./routes/adminRoutes'));
app.use(`${v1Prefix}/student`, require('./routes/studentRoutes'));
app.use(`${v1Prefix}/instructor`, require('./routes/instructorRoutes'));
app.use(`${v1Prefix}/enrollments`, require('./routes/enrollmentRoutes'));

// 🛑 Error Handling
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`🚀 Server running in ${config.env} on port ${config.port}`);
  seedAdmin();
});
