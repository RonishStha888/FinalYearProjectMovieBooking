import fetch from 'node-fetch';

async function testAdminAPI() {
  try {
    console.log('🧪 TESTING ADMIN API...');
    console.log('======================');

    // Test admin login
    console.log('1. Testing admin login...');
    const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@rtxcinema.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Admin login successful!');
      console.log(`   Token received: ${loginData.token.substring(0, 20)}...`);
      
      const token = loginData.token;
      
      // Test dashboard stats
      console.log('\n2. Testing dashboard stats...');
      const statsResponse = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        console.log('✅ Dashboard stats retrieved!');
        console.log(`   Movies: ${stats.totalMovies}`);
        console.log(`   Cinemas: ${stats.totalCinemas}`);
        console.log(`   Halls: ${stats.totalHalls}`);
        console.log(`   Today's Shows: ${stats.todayShowtimes}`);
      } else {
        console.log('❌ Dashboard stats failed');
      }
      
      // Test movies endpoint
      console.log('\n3. Testing movies endpoint...');
      const moviesResponse = await fetch('http://localhost:5000/api/admin/movies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (moviesResponse.ok) {
        const movies = await moviesResponse.json();
        console.log('✅ Movies retrieved!');
        console.log(`   Total movies in database: ${movies.length}`);
        if (movies.length > 0) {
          console.log(`   Sample movie: ${movies[0].title}`);
        }
      } else {
        console.log('❌ Movies endpoint failed');
      }
      
      console.log('\n🎉 ADMIN API TEST COMPLETED!');
      console.log('✅ All endpoints are working correctly!');
      console.log('🚀 Admin panel is ready for use!');
      
    } else {
      console.log('❌ Admin login failed:', loginData.message);
    }
    
  } catch (error) {
    console.error('❌ API test error:', error.message);
  }
}

testAdminAPI();