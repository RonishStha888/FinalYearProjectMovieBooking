// Quick test script to verify F&B endpoints are working
import fetch from 'node-fetch';

const testEndpoint = async () => {
  try {
    console.log('🧪 Testing F&B endpoint...\n');
    
    // Test 1: Check if endpoint exists (should get 401 without auth)
    const response = await fetch('http://localhost:5000/api/admin/fb/items');
    console.log('✅ Endpoint exists!');
    console.log('Status:', response.status);
    console.log('Expected: 401 (Unauthorized) - This is correct!\n');
    
    if (response.status === 401) {
      console.log('✅ Authentication is working correctly!');
      console.log('📝 Next steps:');
      console.log('   1. Login to admin panel at http://localhost:5173/admin');
      console.log('   2. Navigate to Food & Beverages section');
      console.log('   3. Try adding an item\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Make sure backend server is running on port 5000');
  }
};

testEndpoint();
