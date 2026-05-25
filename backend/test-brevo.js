// Test Brevo Email Sending
import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;

console.log('🧪 Testing Brevo Configuration...\n');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 20)}...` : '❌ NOT FOUND');
console.log('Sender Email:', SENDER_EMAIL || '❌ NOT FOUND');
console.log('');

if (!API_KEY || !SENDER_EMAIL) {
  console.error('❌ Missing configuration in .env file');
  process.exit(1);
}

async function testBrevo() {
  try {
    console.log('📧 Attempting to send test email...\n');
    
    const client = new BrevoClient({ apiKey: API_KEY });
    
    const result = await client.transactionalEmails.sendTransacEmail({
      sender: { 
        name: "RTX Cinema Test", 
        email: SENDER_EMAIL
      },
      to: [{ 
        email: SENDER_EMAIL, // Send to yourself for testing
        name: "Test User" 
      }],
      subject: "Brevo Test Email",
      htmlContent: "<h1>Success!</h1><p>If you receive this email, Brevo is working correctly!</p>"
    });

    console.log('✅ SUCCESS! Email sent!');
    console.log('Message ID:', result.messageId);
    console.log('\n📬 Check your inbox:', SENDER_EMAIL);
    console.log('(Also check spam folder)');
    
  } catch (error) {
    console.error('❌ BREVO ERROR:\n');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code || 'N/A');
    console.error('\nFull Error:', error);
    
    console.log('\n💡 Common Issues:');
    console.log('1. Sender email not verified in Brevo');
    console.log('   → Go to: https://app.brevo.com/settings/senders');
    console.log('   → Add and verify:', SENDER_EMAIL);
    console.log('');
    console.log('2. Invalid API key');
    console.log('   → Go to: https://app.brevo.com/settings/keys/api');
    console.log('   → Create new API key');
    console.log('');
    console.log('3. Free tier limit reached (300 emails/day)');
    console.log('   → Check your Brevo dashboard');
  }
}

testBrevo();
