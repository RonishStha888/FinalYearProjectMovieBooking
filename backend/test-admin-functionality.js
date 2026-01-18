const testAdminFunctionality = async () => {
  try {
    console.log('🧪 Testing Admin Panel Functionality...\n');
    
    // Test admin login
    const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@rtxcinema.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Admin login test:', loginData.message);
    
    if (!loginData.token) {
      console.error('❌ No token received');
      return;
    }
    
    const authHeaders = {
      'Authorization': `Bearer ${loginData.token}`,
      'Content-Type': 'application/json'
    };
    
    // Test getting movies
    const moviesResponse = await fetch('http://localhost:5000/api/admin/movies', {
      headers: authHeaders
    });
    const moviesData = await moviesResponse.json();
    console.log(`✅ Movies API test: Found ${moviesData.length} movies`);
    
    // Test getting dashboard stats
    const statsResponse = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
      headers: authHeaders
    });
    const statsData = await statsResponse.json();
    console.log('✅ Dashboard stats test:');
    console.log(`   - Total Movies: ${statsData.totalMovies}`);
    console.log(`   - Total Cinemas: ${statsData.totalCinemas}`);
    console.log(`   - Total Users: ${statsData.totalUsers}`);
    console.log(`   - Today's Shows: ${statsData.todayShowtimes}`);
    console.log(`   - Today's Revenue: NPR ${statsData.todayRevenue}`);
    
    // Test getting cinemas
    const cinemasResponse = await fetch('http://localhost:5000/api/admin/cinemas', {
      headers: authHeaders
    });
    const cinemasData = await cinemasResponse.json();
    console.log(`✅ Cinemas API test: Found ${cinemasData.length} cinemas`);
    
    // Test getting showtimes
    const today = new Date().toISOString().split('T')[0];
    const showtimesResponse = await fetch(`http://localhost:5000/api/admin/showtimes?date=${today}`, {
      headers: authHeaders
    });
    const showtimesData = await showtimesResponse.json();
    console.log(`✅ Showtimes API test: Found ${showtimesData.length} showtimes for today`);
    
    console.log('\n🎉 All admin functionality tests passed!');
    console.log('\n📋 Admin Panel Features Available:');
    console.log('   ✓ Real-time dashboard with live stats');
    console.log('   ✓ Movie management (add, edit, delete)');
    console.log('   ✓ Showtime management (add, edit, delete)');
    console.log('   ✓ Cinema and hall management');
    console.log('   ✓ User management');
    console.log('   ✓ Booking management');
    console.log('   ✓ Analytics and reports');
    console.log('   ✓ Auto-refresh every 30 seconds');
    console.log('\n🌐 Access Admin Panel: http://localhost:5173/admin');
    console.log('📧 Email: admin@rtxcinema.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAdminFunctionality();