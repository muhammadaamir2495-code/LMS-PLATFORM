const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // For text/markdown content
  videoUrl: { type: String },
  pdfUrl: { type: String },
  duration: { type: Number, default: 0 }, // In minutes
  isFree: { type: Boolean, default: false }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0.0,
    },
    thumbnail: {
      type: String,
      default: 'no-photo.jpg',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    // 🚀 NEW: Hierarchical Content Structure
    modules: [moduleSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for enrollment count
courseSchema.virtual('enrollmentsCount', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'course',
  count: true
});

// Optimize queries
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });

module.exports = mongoose.model('Course', courseSchema);
