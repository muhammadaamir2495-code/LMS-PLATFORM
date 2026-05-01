const mongoose = require('mongoose');

/**
 * MongoDB Connection
 * Standardized connection logic using Promises
 */
const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
      console.log("MongoDB Error:", err.message);
      // Exit process on failure in production
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });
};

module.exports = connectDB;
