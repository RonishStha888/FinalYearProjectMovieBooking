import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rtx_cinema');

async function updateAdmin() {
  try {
    console.log('🔐 UPDATING ADMIN USER...');
    console.log('========================');

    // Find existing admin user
    let admin = await User.findOne({ login: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found! Creating new admin...');
      
      // Admin credentials
      const adminData = {
        login: 'admin',
        email: 'admin@rtxcinema.com',
        password: 'admin123',
        name: 'RTX Cinema Administrator',
        role: 'admin',
        authMethod: 'email',
        isActive: true
      };

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

      // Create admin user
      admin = new User({
        ...adminData,
        password: hashedPassword
      });

      await admin.save();
      console.log('✅ New admin user created successfully!');
    } else {
      // Update existing user to admin
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      
      await User.updateOne(
        { login: 'admin' },
        {
          $set: {
            email: 'admin@rtxcinema.com',
            password: hashedPassword,
            name: 'RTX Cinema Administrator',
            role: 'admin',
            authMethod: 'email',
            isActive: true
          }
        }
      );
      
      console.log('✅ Existing user updated to admin successfully!');
    }

    console.log('');
    console.log('🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('===========================');
    console.log('📧 Email: admin@rtxcinema.com');
    console.log('🔒 Password: admin123');
    console.log('');
    console.log('🚀 You can now login to the admin panel!');
    console.log('📍 Admin Panel URL: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error updating admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateAdmin();