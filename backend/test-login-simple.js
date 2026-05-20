import fetch from 'node-fetch';

async function testLogin() {
  console.log('🧪 Testing login endpoint...\n');

  // Test with existing user
  const testUser = {
    login: 'testuser',
    password: 'password123'
  };

  console.log(`Attempting login with: ${testUser.login}`);

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();

    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ Login successful!');
      console.log('User:', data.user);
    } else {
      console.log('\n❌ Login failed:', data.message);
    }

  } catch (error) {
    console.error('\n❌ Connection error:', error.message);
    console.log('\n⚠️ Make sure the backend server is running on port 5000');
  }
}

testLogin();
