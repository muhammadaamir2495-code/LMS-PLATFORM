const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Seed Admin User
 * Ensures a default admin exists in the system
 */
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
      
      await User.create({
        name: 'Production Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`✅ Admin user created: ${adminEmail}`);
    }
  } catch (error) {
    console.error('❌ Admin seeding failed:', error.message);
  }
};

module.exports = seedAdmin;
