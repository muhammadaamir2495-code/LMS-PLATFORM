const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google's Public DNS instead of the buggy local Windows/ISP DNS
// This is often required for MongoDB Atlas SRV resolution on Windows
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    console.log('🔄 Initiating connection to MongoDB Atlas...');
    
    // In Mongoose 6+, these options are no longer necessary:
    // useNewUrlParser, useUnifiedTopology, useFindAndModify, useCreateIndex
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Force IPv4 to avoid potential local machine resolution issues
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Provide actionable feedback for common Atlas errors
    if (error.message.includes('whitelist')) {
      console.error('👉 ACTION REQUIRED: Your current IP is not whitelisted in MongoDB Atlas.');
      console.error('   Please go to Network Access in Atlas and add 0.0.0.0/0 for development.');
    } else if (error.message.includes('authentication')) {
      console.error('👉 ACTION REQUIRED: Authentication failed. Please check your username/password in .env');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
