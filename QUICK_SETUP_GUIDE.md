# ⚡ Quick Setup Guide - Nodemailer Email Verification

## 🎯 For Your Friend - Super Quick Version

### Step 1: Install (2 minutes)
```bash
cd backend
npm install nodemailer dotenv
```

### Step 2: Get Gmail App Password (5 minutes)
1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Click **App passwords**
4. Generate password for "Mail"
5. **Copy the 16-character code**

### Step 3: Create .env File (1 minute)
Create `backend/.env`:
```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your 16-char app password
MONGODB_URI=mongodb://localhost:27017/your_db
```

### Step 4: Copy These 3 Files (5 minutes)

**File 1:** `backend/models/EmailVerification.js`
```javascript
import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  userData: { type: Object, required: true },
  verificationType: { type: String, default: 'signup' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 15 * 60 * 1000),
    index: { expires: 0 }
  }
});

export default mongoose.model('EmailVerification', emailVerificationSchema);
```

**File 2:** `backend/services/nodemailerService.js`
```javascript
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendVerificationEmail = async (email, code, name) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Verification Code',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hello, ${name}!</h2>
          <p>Your verification code is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4CAF50; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>This code expires in 15 minutes.</p>
        </div>
      `
    });
    console.log(`✅ Email sent to ${email} | Code: ${code}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
};
```

**File 3:** `backend/routes/auth.js`
```javascript
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import EmailVerification from '../models/EmailVerification.js';
import { sendVerificationEmail } from '../services/nodemailerService.js';

const router = express.Router();

// Send verification code
router.post('/send-verification', async (req, res) => {
  try {
    const { email, login, password, name } = req.body;
    
    // Check if user exists
    const exists = await User.findOne({ $or: [{ email }, { login }] });
    if (exists) {
      return res.status(409).json({ success: false, message: 'User exists' });
    }
    
    // Generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save verification
    await EmailVerification.deleteMany({ email });
    await EmailVerification.create({
      email,
      code,
      userData: { login, email, password: hashedPassword, name: name || login }
    });
    
    // Send email
    await sendVerificationEmail(email, code, name || login);
    
    res.json({ success: true, message: 'Code sent to email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify code
router.post('/verify-signup', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const verification = await EmailVerification.findOne({ email, code });
    if (!verification) {
      return res.status(400).json({ success: false, message: 'Invalid code' });
    }
    
    const user = await User.create(verification.userData);
    await EmailVerification.deleteOne({ _id: verification._id });
    
    res.json({ success: true, message: 'Account created!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
```

### Step 5: Register Routes (1 minute)
In `backend/server.js`:
```javascript
import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);
```

### Step 6: Test (2 minutes)
```bash
cd backend
node -e "import('./services/nodemailerService.js').then(m => m.sendVerificationEmail('your@email.com', '123456', 'Test'))"
```

Check your email! 📧

---

## 🎯 API Endpoints

### Send Code
```bash
POST /api/auth/send-verification
{
  "email": "user@example.com",
  "login": "username",
  "password": "password123",
  "name": "User Name"
}
```

### Verify Code
```bash
POST /api/auth/verify-signup
{
  "email": "user@example.com",
  "code": "123456"
}
```

---

## 🐛 Quick Fixes

**Email not sending?**
- Check `.env` has correct EMAIL_USER and EMAIL_PASS
- Make sure 2FA is enabled on Gmail
- Generate new App Password

**Code not working?**
- Codes expire in 15 minutes
- Request new code
- Check console for actual code

**"Invalid login" error?**
- Regenerate Gmail App Password
- Copy it exactly (with or without spaces)

---

## ✅ Done!

You now have:
- ✅ Email verification working
- ✅ 6-digit codes
- ✅ 15-minute expiration
- ✅ Professional emails

**Total setup time: ~15 minutes**

---

## 📚 Full Guide

For detailed explanations, see:
- `HOW_TO_SETUP_NODEMAILER_VERIFICATION.md` - Complete guide
- `NODEMAILER_VERIFICATION_SYSTEM.md` - Technical details

---

**That's it! Send this to your friend and they're good to go! 🚀**
