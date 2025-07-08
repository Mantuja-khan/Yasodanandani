import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'mantujak@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      
      // Update existing user to admin with new password
      existingAdmin.password = 'mantuja@2002';
      existingAdmin.role = 'admin';
      existingAdmin.isEmailVerified = true;
      existingAdmin.isActive = true;
      existingAdmin.name = 'Admin User';
      
      await existingAdmin.save();
      console.log('Existing user updated to admin successfully');
    } else {
      // Create new admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'mantujak@gmail.com',
        password: 'mantuja@2002',
        role: 'admin',
        isEmailVerified: true,
        isActive: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    }

    console.log('Admin credentials:');
    console.log('Email: mantujak@gmail.com');
    console.log('Password: mantuja@2002');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();