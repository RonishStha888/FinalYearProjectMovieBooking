// Quick test to verify backend connection and Brevo API
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing backend connection...\n');
  
  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Testing if backend is running...');
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log('✅ Backend is running:', data.message);
    console.log('');
    
    // Test 2: Test signup endpoint
    console.log('2️⃣ Testing signup endpoint...');
    const testEmail = `test${Date.now()}@example.com`;
    const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: `testuser${Date.now()}`,
        email: testEmail,
        password: 'testpassword123',
        name: 'Test User'
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('Signup response:', signupData);
    
    if (signupData.success) {
      console.log('✅ Signup endpoint working!');
      console.log('📧 Check if email was sent (check backend console)');
    } else {
      console.log('❌ Signup failed:', signupData.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure backend is running: cd backend && npm start');
  }
}

testBackend();
