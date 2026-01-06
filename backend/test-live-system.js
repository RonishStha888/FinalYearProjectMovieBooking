import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/auth';

async function testLiveSystem() {
  try {
    console.log('🎬 Testing RTX Cinema OTP Verification System...\n');
    
    // Test data with unique values
    const timestamp = Date.now();
    const testData = {
      login: `testuser_${timestamp}`,
      email: `test_${timestamp}@example.com`,
      password: 'password123',
      verificationType: 'signup'
    };

    console.log(`📝 Test User Data:`);
    console.log(`   Username: ${testData.login}`);
    console.log(`   Email: ${testData.email}`);
    console.log(`   Password: ${testData.password}\n`);

    // Step 1: Send verification code
    console.log('🚀 Step 1: Sending OTP verification code...');
    const sendResponse = await fetch(`${BASE_URL}/send-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    const sendResult = await sendResponse.json();
    console.log('📧 Send Result:', sendResult);

    if (!sendResult.success) {
      console.log('❌ Failed to send verification code:', sendResult.message);
      return;
    }

    console.log('\n✅ OTP sent successfully!');
    console.log('🔍 Check the backend console for the 6-digit OTP code...\n');
    
    // Wait a moment for the user to see the message
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📋 To complete the test:');
    console.log('1. Check the backend server console for the OTP code');
    console.log('2. The code will look like: "🔐 VERIFICATION CODE FOR [email]: 123456"');
    console.log('3. Use that code to verify the account\n');
    
    console.log('🎯 System Status: OTP Generation and Email Sending WORKING! ✅');
    console.log('📱 Frontend URL: http://localhost:5173');
    console.log('🖥️  Backend URL: http://localhost:5000');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testLiveSystem();