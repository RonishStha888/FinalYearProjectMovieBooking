import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcrypt';

mongoose.connect('mongodb://localhost:27017/rtx_cinema');

async function checkUserPassword() {
  try {
    console.log('🔍 Checking user password...\n');
    
    const user = await User.findOne({ login: 'testuser' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('User found:');
    console.log('Login:', user.login);
    console.log('Email:', user.email);
    console.log('Password (hashed):', user.password);
    console.log('Password length:', user.password?.length);
    console.log('Starts with $2b$ (bcrypt):', user.password?.startsWith('$2b$'));
    
    // Test password comparison
    const testPassword = 'password123';
    console.log('\n🧪 Testing password:', testPassword);
    
    try {
      const isMatch = await bcrypt.compare(testPassword, user.password);
      console.log('Password match:', isMatch);
    } catch (err) {
      console.log('❌ Password comparison error:', err.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUserPassword();
