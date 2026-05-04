require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  
  // Database
  mongo: {
    uri: process.env.MONGO_URI,
    options: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },

  // Authentication
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpire: '15m',
    refreshExpire: '7d',
  },

  // Security
  cors: {
    allowedOrigins: [
      process.env.FRONTEND_URL?.replace(/\/$/, ""),
      'http://localhost:5173',
      'http://localhost:3000'
    ].filter(Boolean)
  },

  // Cookies
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },

  // Email (Nodemailer)
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'NexusLMS <noreply@nexuslms.com>'
  }
};

module.exports = config;
