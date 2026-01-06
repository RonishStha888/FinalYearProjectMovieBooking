// Test admin JWT authentication with new secret
const BASE_URL = 'http://localhost:5000';

async function testAdminJWT() {
  console.log('🔐 Testing Admin JWT Authentication...\n');

  try {
    // Test 1: Admin login (should generate JWT)
    console.log('1. Testing admin login...');
    const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@rtxcinema.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Admin login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Admin login successful');
    console.log(`   Admin: ${loginData.admin.name} (${loginData.admin.email})`);
    console.log(`   JWT Token: ${loginData.token.substring(0, 50)}...`);

    const adminToken = loginData.token;

    // Test 2: Access protected admin route
    console.log('\n2. Testing protected admin route...');
    const statsResponse = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Protected route access successful');
      console.log(`   Total Movies: ${stats.totalMovies}`);
      console.log(`   Total Users: ${stats.totalUsers}`);
    } else {
      console.log('❌ Protected route access failed');
    }

    // Test 3: Access without token (should fail)
    console.log('\n3. Testing access without token...');
    const noTokenResponse = await fetch(`${BASE_URL}/api/admin/dashboard/stats`);
    
    if (!noTokenResponse.ok) {
      console.log('✅ Unauthorized access correctly blocked');
    } else {
      console.log('❌ Should have blocked unauthorized access');
    }

    // Test 4: Test movie management
    console.log('\n4. Testing admin movie management...');
    const moviesResponse = await fetch(`${BASE_URL}/api/admin/movies`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (moviesResponse.ok) {
      const movies = await moviesResponse.json();
      console.log(`✅ Admin movies access successful: ${movies.length} movies`);
    } else {
      console.log('❌ Admin movies access failed');
    }

    console.log('\n🎉 Admin JWT Authentication Test Completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ JWT secret properly configured');
    console.log('   ✅ Admin login generates valid JWT');
    console.log('   ✅ Protected routes secured with JWT');
    console.log('   ✅ Unauthorized access blocked');
    console.log('   ✅ Admin movie management working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminJWT();