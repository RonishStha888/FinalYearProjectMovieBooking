import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rtx_cinema');

async function createAdmin() {
  try {
    console.log('🔐 CREATING ADMIN USER...');
    console.log('========================');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log('Use existing credentials to login to admin panel.');
      mongoose.connection.close();
      return;
    }

    // Admin credentials
    const adminData = {
      login: 'admin',
      email: 'admin@rtxcinema.com',
      password: 'admin123',
      name: 'RTX Cinema Administrator',
      role: 'admin',
      authMethod: 'email',
      isActive: true
    };

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin user
    const admin = new User({
      ...adminData,
      password: hashedPassword
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('===========================');
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔒 Password: ${adminData.password}`);
    console.log('');
    console.log('🚀 You can now login to the admin panel!');
    console.log('📍 Admin Panel URL: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();