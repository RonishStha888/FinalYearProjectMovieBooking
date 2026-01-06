import mongoose from 'mongoose';
import User from './models/User.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rtx_cinema');

async function checkAdminUser() {
  try {
    console.log('🔍 CHECKING ADMIN USER...');
    console.log('========================');

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      console.log('✅ Admin user found!');
      console.log(`📧 Email: ${admin.email}`);
      console.log(`👤 Name: ${admin.name}`);
      console.log(`🔑 Login: ${admin.login}`);
      console.log(`🎭 Role: ${admin.role}`);
      console.log(`✅ Active: ${admin.isActive}`);
      console.log(`🔐 Auth Method: ${admin.authMethod}`);
      console.log(`📅 Created: ${admin.createdAt}`);
    } else {
      console.log('❌ No admin user found!');
      console.log('Need to create admin user...');
    }

    // Also check all users with admin role
    const allAdmins = await User.find({ role: 'admin' });
    console.log(`\n📊 Total admin users: ${allAdmins.length}`);

    // Check if there's a user with admin email
    const userByEmail = await User.findOne({ email: 'admin@rtxcinema.com' });
    if (userByEmail) {
      console.log('\n🔍 User with admin email found:');
      console.log(`   Role: ${userByEmail.role}`);
      console.log(`   Active: ${userByEmail.isActive}`);
    } else {
      console.log('\n❌ No user with admin email found');
    }

  } catch (error) {
    console.error('❌ Error checking admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkAdminUser();