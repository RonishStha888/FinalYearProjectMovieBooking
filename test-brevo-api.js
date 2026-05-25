// Test Brevo API Key
import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const API_KEY = process.env.BREVO_API_KEY;

console.log('🧪 Testing Brevo API Key...\n');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 20)}...` : '❌ NOT FOUND');
console.log('');

if (!API_KEY) {
  console.error('❌ BREVO_API_KEY not found in backend/.env');
  console.log('\n💡 Steps to fix:');
  console.log('1. Go to https://www.brevo.com/');
  console.log('2. Sign up / Login');
  console.log('3. Go to: Settings → SMTP & API → API Keys');
  console.log('4. Create new API key');
  console.log('5. Copy the key');
  console.log('6. Add to backend/.env: BREVO_API_KEY=your_key_here');
  process.exit(1);
}

async function testBrevo() {
  try {
    console.log('📧 Attempting to send test email...\n');
    
    const client = new BrevoClient({ apiKey: API_KEY });
    
    const result = await client.transactionalEmails.sendTransacEmail({
      sender: { 
        name: "RTX Cinema Test", 
        email: process.env.BREVO_SENDER_EMAIL || "noreply@rtxcinema.com"
      },
      to: [{ 
        email: "test@example.com", 
        name: "Test User" 
      }],
      subject: "Brevo API Test",
      htmlContent: "<h1>Test Email</h1><p>If you receive this, Brevo is working!</p>"
    });

    console.log('✅ SUCCESS! Brevo API is working!');
    console.log('Message ID:', result.messageId);
    console.log('\n💡 Note: Email to test@example.com won\'t actually be delivered (invalid domain)');
    console.log('But the API accepted the request, which means your API key is valid!');
    
  } catch (error) {
    console.error('❌ BREVO API ERROR:\n');
    console.error('Error:', error.message);
    
    if (error.message.includes('Unauthorized') || error.message.includes('401')) {
      console.log('\n💡 Your API key is invalid or expired.');
      console.log('Get a new one from: https://www.brevo.com/ → Settings → API Keys');
    } else if (error.message.includes('sender')) {
      console.log('\n💡 Sender email issue. Make sure you verify your sender email in Brevo.');
    } else {
      console.log('\n💡 Check your internet connection and Brevo account status.');
    }
  }
}

testBrevo();
