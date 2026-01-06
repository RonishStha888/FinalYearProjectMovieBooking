import mongoose from 'mongoose';
import User from './models/User.js';
import EmailVerification from './models/EmailVerification.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rtx_cinema');

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...');
    
    // Check existing users
    const users = await User.find({}, { login: 1, email: 1, authMethod: 1 });
    console.log('\n📊 Existing users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Login: ${user.login}, Email: ${user.email}, Method: ${user.authMethod}`);
    });

    // Check pending verifications
    const verifications = await EmailVerification.find({}, { email: 1, code: 1, verificationType: 1 });
    console.log('\n📧 Pending verifications:');
    if (verifications.length === 0) {
      console.log('No pending verifications');
    } else {
      verifications.forEach((verification, index) => {
        console.log(`${index + 1}. Email: ${verification.email}, Code: ${verification.code}, Type: ${verification.verificationType}`);
      });
    }

    console.log('\n✅ Database check completed');
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkDatabase();