// Test CORS and admin login from frontend perspective
import fetch from 'node-fetch';

async function testCORS() {
  try {
    console.log('🧪 TESTING CORS AND ADMIN LOGIN...');
    console.log('==================================');

    // Test basic API connection
    console.log('1. Testing basic API connection...');
    const basicResponse = await fetch('http://localhost:5000/');
    const basicData = await basicResponse.json();
    console.log('✅ Basic API:', basicData.message);

    // Test admin login with exact frontend data
    console.log('\n2. Testing admin login with frontend format...');
    const loginData = {
      email: 'admin@rtxcinema.com',
      password: 'admin123'
    };

    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    console.log(`Response Status: ${response.status}`);
    console.log(`Response Headers:`, response.headers.raw());

    if (response.ok) {
      const data = await response.json();
      console.log('✅ LOGIN SUCCESS!');
      console.log('Response:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ LOGIN FAILED!');
      console.log('Error Response:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCORS();