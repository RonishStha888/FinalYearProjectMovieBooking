import mongoose from 'mongoose';
import EmailVerification from './models/EmailVerification.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rtx_cinema');

async function testVerification() {
  try {
    console.log('🧪 Testing verification process...');
    
    // Test data
    const testEmail = 'test@example.com';
    const testCode = '123456';
    const testUserData = {
      login: 'testuser',
      email: testEmail,
      password: 'password123',
      authMethod: 'email'
    };

    // 1. Create verification record
    console.log('1. Creating verification record...');
    await EmailVerification.deleteMany({ email: testEmail });
    
    const verification = await EmailVerification.create({
      email: testEmail,
      code: testCode,
      userData: testUserData,
      verificationType: 'signup'
    });
    console.log('✅ Verification record created:', verification._id);

    // 2. Test finding verification
    console.log('2. Testing verification lookup...');
    const foundVerification = await EmailVerification.findOne({ email: testEmail, code: testCode });
    if (foundVerification) {
      console.log('✅ Verification found:', foundVerification._id);
    } else {
      console.log('❌ Verification not found');
      return;
    }

    // 3. Test user creation
    console.log('3. Testing user creation...');
    const userData = foundVerification.userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // Delete existing user if any
    await User.deleteOne({ email: testEmail });
    
    const user = new User(userData);
    await user.save();
    console.log('✅ User created:', user._id);

    // 4. Clean up verification
    await EmailVerification.deleteOne({ _id: foundVerification._id });
    console.log('✅ Verification record cleaned up');

    console.log('🎉 Verification test completed successfully!');
    
  } catch (error) {
    console.error('❌ Verification test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testVerification();