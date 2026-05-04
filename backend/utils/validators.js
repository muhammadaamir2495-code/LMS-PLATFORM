const Joi = require('joi');

// Auth Validators
exports.registerSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid('student', 'instructor', 'admin').default('student')
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Course Validators
exports.courseSchema = Joi.object({
  title: Joi.string().required().min(5).max(100),
  description: Joi.string().required().min(10).max(1000),
  category: Joi.string().required(),
  price: Joi.number().min(0).required(),
  status: Joi.string().valid('draft', 'published').default('draft'),
  thumbnail: Joi.any()
});
