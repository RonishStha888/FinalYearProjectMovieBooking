import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/auth';

async function testWithCorrectCode() {
  try {
    console.log('🧪 Testing verification with correct code...');
    
    // Use the code from the backend console: 660889
    const verifyResponse = await fetch(`${BASE_URL}/verify-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newuser@example.com',
        code: '660889'
      })
    });

    const verifyResult = await verifyResponse.json();
    console.log('Verify result:', verifyResult);

    if (verifyResult.success) {
      console.log('🎉 Verification successful! User created.');
    } else {
      console.log('❌ Verification failed:', verifyResult.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testWithCorrectCode();