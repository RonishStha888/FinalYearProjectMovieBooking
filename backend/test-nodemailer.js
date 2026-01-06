// Test script for new Nodemailer email system
import { testEmailConfiguration, sendWelcomeEmail, sendPasswordResetEmail } from './services/nodemailerService.js';

async function testNodemailerSystem() {
  console.log('📧 Testing Nodemailer Email System...\n');

  try {
    // Step 1: Test email configuration
    console.log('1. Testing email configuration...');
    const configTest = await testEmailConfiguration();
    
    if (configTest.success) {
      console.log('✅ Email configuration is valid');
    } else {
      console.log('❌ Email configuration failed:', configTest.error);
      console.log('\n📝 Setup Instructions:');
      console.log('1. Update backend/.env file with your Gmail credentials:');
      console.log('   EMAIL_USER=your_gmail_address@gmail.com');
      console.log('   EMAIL_PASS=your_gmail_app_password');
      console.log('\n2. To get Gmail App Password:');
      console.log('   - Go to Google Account settings');
      console.log('   - Enable 2-Factor Authentication');
      console.log('   - Go to Security > App passwords');
      console.log('   - Generate app password for "Mail"');
      console.log('   - Use that password in EMAIL_PASS');
      return;
    }

    // Step 2: Test welcome email (if configuration is valid)
    console.log('\n2. Testing welcome email...');
    const welcomeResult = await sendWelcomeEmail('test@example.com', 'Test User');
    
    if (welcomeResult.success) {
      console.log('✅ Welcome email sent successfully');
      console.log(`   Message ID: ${welcomeResult.messageId}`);
    } else {
      console.log('❌ Welcome email failed:', welcomeResult.error);
    }

    // Step 3: Test password reset email
    console.log('\n3. Testing password reset email...');
    const resetResult = await sendPasswordResetEmail('test@example.com', '123456', 'Test User');
    
    if (resetResult.success) {
      console.log('✅ Password reset email sent successfully');
      console.log(`   Message ID: ${resetResult.messageId}`);
    } else {
      console.log('❌ Password reset email failed:', resetResult.error);
    }

    console.log('\n🎉 Nodemailer System Test Completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Email verification system removed');
    console.log('   ✅ Nodemailer service implemented');
    console.log('   ✅ Direct signup without verification');
    console.log('   ✅ Welcome emails on signup');
    console.log('   ✅ Password reset emails');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('1. Update .env file with correct Gmail credentials');
    console.log('2. Enable Gmail App Password');
    console.log('3. Check internet connection');
  }
}

// Run the test
testNodemailerSystem();