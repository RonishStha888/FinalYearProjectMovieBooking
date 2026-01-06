import fetch from 'node-fetch';

async function testAdminLogin() {
  try {
    console.log('🧪 TESTING ADMIN LOGIN API...');
    console.log('==============================');

    const loginData = {
      email: 'admin@rtxcinema.com',
      password: 'admin123'
    };

    console.log('📤 Sending login request with:', loginData);

    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);

    const data = await response.json();
    console.log('📄 Response data:', data);

    if (response.ok && data.token) {
      console.log('✅ ADMIN LOGIN TEST: SUCCESS');
      console.log('🔑 Token received:', data.token.substring(0, 50) + '...');
      console.log('👤 Admin data:', data.admin);
    } else {
      console.log('❌ ADMIN LOGIN TEST: FAILED');
      console.log('💬 Error message:', data.message);
    }

  } catch (error) {
    console.error('❌ ADMIN LOGIN TEST: ERROR');
    console.error('💥 Error details:', error.message);
  }
}

testAdminLogin();