# 📧 How to Setup Nodemailer Email Verification System

## Complete Step-by-Step Guide for Your Friend

This guide will help you set up a professional email verification system using Nodemailer and Gmail SMTP for your Node.js/Express application.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Node.js installed
- ✅ Express.js backend
- ✅ MongoDB database
- ✅ Gmail account
- ✅ Basic knowledge of JavaScript/Node.js

---

## 🚀 Step 1: Install Required Packages

Open your terminal in the **backend** folder and install Nodemailer:

```bash
cd backend
npm install nodemailer dotenv
```

**What these do:**
- `nodemailer` - Sends emails
- `dotenv` - Manages environment variables

---

## 🔐 Step 2: Setup Gmail App Password

You **cannot** use your regular Gmail password. You need an **App Password**.

### 2.1 Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Find **2-Step Verification**
4. Click **Get Started** and follow the steps
5. Complete the setup

### 2.2 Generate App Password

1. Go back to **Security** page
2. Find **App passwords** (under 2-Step Verification)
3. Click **App passwords**
4. Select:
   - **App:** Mail
   - **Device:** Other (Custom name)
5. Type: "Nodemailer" or "My App"
6. Click **Generate**
7. **COPY THE 16-CHARACTER PASSWORD** (e.g., `abcd efgh ijkl mnop`)
8. Save it somewhere safe!

---

## 📝 Step 3: Create .env File

In your **backend** folder, create a file named `.env`:

```bash
# backend/.env

PORT=5000
MONGODB_URI=mongodb://localhost:27017/your_database_name

# Email Configuration
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your app password here

# JWT Secret (optional, for authentication)
JWT_SECRET=your_secret_key_here
```

**Replace:**
- `your.email@gmail.com` → Your Gmail address
- `your app password here` → The 16-character app password from Step 2

**Example:**
```env
EMAIL_USER=myproject@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

---

## 🗄️ Step 4: Create Email Verification Model

Create a new file: `backend/models/EmailVerification.js`

```javascript
import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  userData: {
    type: Object,
    required: true
  },
  verificationType: {
    type: String,
    enum: ['signup', 'password-reset', 'google-signup'],
    default: 'signup'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    index: { expires: 0 } // Auto-delete after expiration
  }
});

export default mongoose.model('EmailVerification', emailVerificationSchema);
```

**What this does:**
- Stores verification codes in MongoDB
- Auto-deletes expired codes after 15 minutes
- Stores user data temporarily until verification

---

## 📧 Step 5: Create Nodemailer Service

Create a new file: `backend/services/nodemailerService.js`

```javascript
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send verification email
export const sendVerificationEmail = async (userEmail, verificationCode, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Your App Name',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: '🔐 Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1>Email Verification</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border: 1px solid #ddd;">
            <h2>Hello, ${userName}!</h2>
            
            <p>Thank you for signing up! Please use the verification code below to complete your registration:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px;">
                ${verificationCode}
              </div>
            </div>
            
            <p style="color: #666;">This code will expire in <strong>15 minutes</strong>.</p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${userEmail}`);
    console.log(`🔐 CODE: ${verificationCode}`); // For development
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (userEmail, resetCode, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Your App Name',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: '🔐 Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #FF5722; color: white; padding: 20px; text-align: center;">
            <h1>Password Reset</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border: 1px solid #ddd;">
            <h2>Hello, ${userName}!</h2>
            
            <p>We received a request to reset your password. Use the code below:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #FF5722; letter-spacing: 5px;">
                ${resetCode}
              </div>
            </div>
            
            <p style="color: #666;">This code will expire in <strong>15 minutes</strong>.</p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${userEmail}`);
    console.log(`🔐 CODE: ${resetCode}`); // For development
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return { success: false, error: error.message };
  }
};
```

---

## 🛣️ Step 6: Create Authentication Routes

Create or update: `backend/routes/auth.js`

```javascript
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import EmailVerification from '../models/EmailVerification.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/nodemailerService.js';

const router = express.Router();

// ROUTE 1: Send Verification Code
router.post('/send-verification', async (req, res) => {
  try {
    const { email, login, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { login }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔐 Generated code: ${verificationCode} for ${email}`);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete old verifications for this email
    await EmailVerification.deleteMany({ email });

    // Save verification to database
    await EmailVerification.create({
      email,
      code: verificationCode,
      userData: {
        login,
        email,
        password: hashedPassword,
        name: name || login
      },
      verificationType: 'signup'
    });

    // Send email
    const emailResult = await sendVerificationEmail(
      email, 
      verificationCode, 
      name || login
    );

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Verification code sent to your email'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email'
      });
    }

  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ROUTE 2: Verify Code and Create User
router.post('/verify-signup', async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find verification record
    const verification = await EmailVerification.findOne({ email, code });
    
    if (!verification) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification code' 
      });
    }

    // Create user
    const newUser = await User.create(verification.userData);

    // Delete verification record
    await EmailVerification.deleteOne({ _id: verification._id });

    res.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Verify signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ROUTE 3: Send Password Reset Code
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Generate code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old verifications
    await EmailVerification.deleteMany({ email });

    // Save reset code
    await EmailVerification.create({
      email,
      code: resetCode,
      userData: { userId: user._id },
      verificationType: 'password-reset'
    });

    // Send email
    const emailResult = await sendPasswordResetEmail(
      email, 
      resetCode, 
      user.name
    );

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Reset code sent to your email'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ROUTE 4: Reset Password with Code
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Find verification
    const verification = await EmailVerification.findOne({ 
      email, 
      code,
      verificationType: 'password-reset'
    });
    
    if (!verification) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset code' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.findByIdAndUpdate(
      verification.userData.userId,
      { password: hashedPassword }
    );

    // Delete verification
    await EmailVerification.deleteOne({ _id: verification._id });

    res.json({
      success: true,
      message: 'Password reset successfully!'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

export default router;
```

---

## 🔌 Step 7: Register Routes in Server

Update your `backend/server.js`:

```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## 🧪 Step 8: Test the System

### 8.1 Create Test Script

Create: `backend/test-email.js`

```javascript
import { sendVerificationEmail, testEmailConfiguration } from './services/nodemailerService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('📧 Testing email system...\n');
  
  // Test 1: Check configuration
  console.log('1️⃣ Testing email configuration...');
  const configTest = await testEmailConfiguration();
  if (configTest.success) {
    console.log('✅ Configuration is valid\n');
  } else {
    console.log('❌ Configuration error:', configTest.error);
    return;
  }
  
  // Test 2: Send test email
  console.log('2️⃣ Sending test verification email...');
  const testCode = '123456';
  const result = await sendVerificationEmail(
    'your.email@gmail.com', // Replace with your email
    testCode,
    'Test User'
  );
  
  if (result.success) {
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Check your inbox for code: ${testCode}`);
  } else {
    console.log('❌ Failed to send email:', result.error);
  }
}

testEmail();
```

### 8.2 Run Test

```bash
cd backend
node test-email.js
```

**Expected output:**
```
📧 Testing email system...

1️⃣ Testing email configuration...
✅ Configuration is valid

2️⃣ Sending test verification email...
✅ Verification email sent to your.email@gmail.com
🔐 CODE: 123456
✅ Test email sent successfully!
📧 Check your inbox for code: 123456
```

### 8.3 Check Your Email

1. Open your Gmail inbox
2. Look for email from your app
3. You should see the verification code!

---

## 🎨 Step 9: Frontend Integration (Optional)

### Example React Signup Form

```javascript
import { useState } from 'react';

function SignupForm() {
  const [step, setStep] = useState(1); // 1 = signup, 2 = verify
  const [formData, setFormData] = useState({
    email: '',
    login: '',
    password: '',
    name: '',
    code: ''
  });

  // Step 1: Send verification code
  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          login: formData.login,
          password: formData.password,
          name: formData.name
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Verification code sent to your email!');
        setStep(2); // Move to verification step
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  // Step 2: Verify code
  const handleVerify = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Account created successfully!');
        // Redirect to login or dashboard
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div>
      {step === 1 ? (
        <form onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Username"
            value={formData.login}
            onChange={(e) => setFormData({...formData, login: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <h2>Enter Verification Code</h2>
          <p>We sent a code to {formData.email}</p>
          <input
            type="text"
            placeholder="6-digit code"
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
            maxLength="6"
            required
          />
          <button type="submit">Verify</button>
          <button type="button" onClick={() => setStep(1)}>Back</button>
        </form>
      )}
    </div>
  );
}

export default SignupForm;
```

---

## 🐛 Troubleshooting

### Problem 1: "Invalid login" error

**Solution:**
- Make sure 2FA is enabled on Gmail
- Generate a new App Password
- Copy it exactly (with spaces or without)
- Update `.env` file

### Problem 2: Email not received

**Check:**
1. Spam/Junk folder
2. Email address is correct
3. Gmail account is active
4. App password is correct
5. Backend console for errors

### Problem 3: "Connection timeout"

**Solution:**
- Check internet connection
- Verify Gmail SMTP is not blocked
- Try different network
- Check firewall settings

### Problem 4: Code expired

**Solution:**
- Codes expire after 15 minutes
- Request a new code
- Verify quickly after receiving

---

## ✅ Checklist

Before going live, make sure:

- [ ] Gmail 2FA is enabled
- [ ] App Password is generated
- [ ] `.env` file is configured
- [ ] `.env` is in `.gitignore`
- [ ] MongoDB is connected
- [ ] Test email works
- [ ] Verification flow works
- [ ] Password reset works
- [ ] Error handling is in place
- [ ] Email templates look good

---

## 🎯 Summary

You now have:
1. ✅ Nodemailer configured with Gmail
2. ✅ Email verification system
3. ✅ Password reset system
4. ✅ Professional email templates
5. ✅ 15-minute code expiration
6. ✅ Secure authentication flow

---

## 📚 Additional Resources

- **Nodemailer Docs:** https://nodemailer.com/
- **Gmail App Passwords:** https://support.google.com/accounts/answer/185833
- **MongoDB TTL Index:** https://docs.mongodb.com/manual/core/index-ttl/

---

## 💡 Pro Tips

1. **Development:** Codes are logged to console for easy testing
2. **Production:** Remove console.log statements
3. **Security:** Never commit `.env` file to Git
4. **Emails:** Test with your own email first
5. **Styling:** Customize email templates to match your brand

---

**Good luck with your project! 🚀**

If you have questions, refer to the Nodemailer documentation or check the troubleshooting section above.
