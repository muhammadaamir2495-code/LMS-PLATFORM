/**
 * GLOBAL ENTERPRISE ERROR HANDLER
 * Provides structured, secure error responses and handles specific 
 * MongoDB/JWT failure cases.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for the developer
  console.error(`[ERROR] ${err.stack}`);

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // 2. Mongoose Duplicate Key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Not authorized, token failed', statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    error = { message: 'Session expired, please login again', statusCode: 401 };
  }

  const statusCode = error.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    statusCode,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
