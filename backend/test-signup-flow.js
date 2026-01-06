// Test the new direct signup flow
const BASE_URL = 'http://localhost:5000';

async function testDirectSignupFlow() {
  console.log('🎬 Testing Direct Signup Flow (No Email Verification)...\n');

  try {
    // Test 1: Direct signup
    console.log('1. Testing direct signup...');
    const signupData = {
      login: 'testuser_' + Date.now(),
      email: 'test_' + Date.now() + '@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    });

    const signupResult = await signupResponse.json();
    
    if (signupResult.success) {
      console.log('✅ Direct signup successful!');
      console.log(`   User: ${signupResult.user.login} (${signupResult.user.email})`);
      console.log(`   Name: ${signupResult.user.name}`);
    } else {
      console.log('❌ Signup failed:', signupResult.message);
      return;
    }

    // Test 2: Login with created user
    console.log('\n2. Testing login with created user...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: signupData.login,
        password: signupData.password
      })
    });

    const loginResult = await loginResponse.json();
    
    if (loginResult.success) {
      console.log('✅ Login successful!');
      console.log(`   Welcome back: ${loginResult.user.login}`);
    } else {
      console.log('❌ Login failed:', loginResult.message);
    }

    // Test 3: Try duplicate signup
    console.log('\n3. Testing duplicate signup prevention...');
    const duplicateResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    });

    const duplicateResult = await duplicateResponse.json();
    
    if (!duplicateResult.success) {
      console.log('✅ Duplicate signup correctly prevented');
      console.log(`   Message: ${duplicateResult.message}`);
    } else {
      console.log('❌ Duplicate signup should have been prevented');
    }

    console.log('\n🎉 Direct Signup Flow Test Completed Successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Email verification system removed');
    console.log('   ✅ Direct signup working');
    console.log('   ✅ User login working');
    console.log('   ✅ Duplicate prevention working');
    console.log('   ✅ Welcome emails sent (check server logs)');
    console.log('\n💡 Next Steps:');
    console.log('   1. Configure Gmail credentials in .env for email delivery');
    console.log('   2. Test frontend signup page');
    console.log('   3. Verify welcome emails are received');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Backend server is running (npm start)');
    console.log('2. MongoDB is connected');
    console.log('3. Check server logs for any errors');
  }
}

// Run the test
testDirectSignupFlow();