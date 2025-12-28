import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB using the same connection as the main app
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const createTestUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ login: 'testuser' });
    if (existingUser) {
      console.log('🔍 Test user already exists');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Login:', existingUser.login);
      console.log('🔐 You can login with: testuser / password123');
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = new User({
      login: 'testuser',
      email: 'test@rtxcinema.com',
      name: 'Test User',
      password: hashedPassword,
      authMethod: 'email'
    });

    await testUser.save();
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@rtxcinema.com');
    console.log('👤 Login: testuser');
    console.log('🔐 Password: password123');
    console.log('\n🎬 You can now login to RTX Cinema!');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestUser();