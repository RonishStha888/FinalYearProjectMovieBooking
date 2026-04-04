# 📧 Nodemailer Verification Code System - Complete Guide

## 🎯 Overview

Your RTX Cinema application uses **Nodemailer** with **Gmail SMTP** to send verification codes for:
1. **Email Verification** (during signup)
2. **Password Reset** (forgot password)
3. **Welcome Emails** (after successful signup)
4. **Booking Confirmations** (after ticket purchase)

---

## 🔧 Configuration

### Email Credentials (`.env` file)
```env
EMAIL_USER=cinemasrtx@gmail.com
EMAIL_PASS=uvha uhjg hyfy npxj
```

### Gmail SMTP Settings
- **Service:** Gmail
- **Host:** smtp.gmail.com
- **Port:** 465 (SSL) or 587 (TLS)
- **Authentication:** App Password (not regular password)

---

## 📨 How Verification Codes Are Sent

### 1. **User Requests Verification**

**Endpoint:** `POST /api/auth/send-verification`

**Request Body:**
```json
{
  "email": "user@example.com",
  "login": "username",
  "password": "password123",
  "name": "User Name",
  "verificationType": "signup"
}
```

### 2. **Backend Generates 6-Digit Code**

```javascript
// Generate random 6-digit OTP
const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
// Example: "123456"
```

### 3. **Code Saved to Database**

**Collection:** `emailverifications`

**Document Structure:**
```javascript
{
  email: "user@example.com",
  code: "123456",
  userData: {
    login: "username",
    email: "user@example.com",
    password: "hashed_password",
    name: "User Name",
    authMethod: "email"
  },
  verificationType: "signup",
  createdAt: Date,
  expiresAt: Date (15 minutes from creation)
}
```

### 4. **Email Sent via Nodemailer**

**Function:** `sendVerificationEmail(email, code, userName)`

**Email Template:**
- **Subject:** 🔐 Email Verification - RTX Cinema
- **From:** RTX Cinema <cinemasrtx@gmail.com>
- **To:** User's email
- **Content:** Professional HTML email with:
  - RTX Cinema branding
  - Large verification code display
  - 15-minute expiration notice
  - Security notice
  - Contact information

**Code Display:**
```
┌─────────────────────┐
│                     │
│      123456         │
│                     │
└─────────────────────┘
```

### 5. **Code Logged to Console**

For development purposes, the code is also logged:
```
🔐 VERIFICATION CODE FOR user@example.com: 123456
⏰ Code expires in 15 minutes
```

---

## 🔐 Verification Flow

### Step 1: Send Verification Code
```
User → Frontend → POST /api/auth/send-verification → Backend
                                                        ↓
                                                   Generate Code
                                                        ↓
                                                   Save to DB
                                                        ↓
                                                   Send Email
                                                        ↓
                                                   Return Success
```

### Step 2: User Enters Code
```
User enters code → Frontend → POST /api/auth/verify-signup → Backend
                                                                ↓
                                                           Find Code in DB
                                                                ↓
                                                           Validate Code
                                                                ↓
                                                           Create User
                                                                ↓
                                                           Delete Verification
                                                                ↓
                                                           Return Success
```

---

## 📧 Email Templates

### 1. Verification Email

**Subject:** 🔐 Email Verification - RTX Cinema

**Key Features:**
- RTX Cinema header with red branding (#D84040)
- Large, centered verification code
- 15-minute expiration warning
- Security notice
- Professional footer

**Code Display:**
```html
<div style="font-size: 32px; font-weight: bold; color: #D84040; letter-spacing: 4px;">
  123456
</div>
```

### 2. Password Reset Email

**Subject:** 🔐 Password Reset - RTX Cinema

**Similar to verification email but:**
- Different header text
- Reset code instead of verification code
- Instructions for password reset

### 3. Welcome Email

**Subject:** 🎬 Welcome to RTX Cinema!

**Features:**
- Welcome message
- What's next section
- Call-to-action button
- Cinema benefits

### 4. Booking Confirmation

**Subject:** 🎫 Booking Confirmed - [Movie Title]

**Features:**
- Booking details table
- Movie, cinema, date, time, seats
- Total amount
- Booking reference
- Important instructions

---

## 🔒 Security Features

### 1. **Code Expiration**
- Codes expire after **15 minutes**
- Automatic cleanup via MongoDB TTL index
- Schema definition:
  ```javascript
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000),
    index: { expires: 0 }
  }
  ```

### 2. **One-Time Use**
- Code is deleted after successful verification
- Cannot be reused

### 3. **Email Validation**
- Checks if email already exists
- Prevents duplicate accounts

### 4. **Secure Password Storage**
- Passwords hashed with bcrypt
- Never stored in plain text

### 5. **App Password**
- Uses Gmail App Password (not regular password)
- More secure than regular password
- Can be revoked independently

---

## 🧪 Testing the System

### Test Verification Email

**Run this script:**
```bash
cd backend
node test-email-verification.js
```

**What it does:**
1. Sends verification code to test email
2. Verifies the code
3. Creates test user
4. Confirms everything works

### Manual Test

**1. Send Verification:**
```bash
curl -X POST http://localhost:5000/api/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "login": "testuser",
    "password": "password123",
    "name": "Test User",
    "verificationType": "signup"
  }'
```

**2. Check Console:**
Look for:
```
🔐 VERIFICATION CODE FOR test@example.com: 123456
```

**3. Check Email:**
- Open Gmail inbox
- Look for email from RTX Cinema
- Find 6-digit code

**4. Verify Code:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

---

## 🐛 Troubleshooting

### Issue 1: Email Not Received

**Possible Causes:**
1. **Wrong email credentials**
   - Check `.env` file
   - Verify `EMAIL_USER` and `EMAIL_PASS`

2. **Gmail App Password not set**
   - Go to Google Account → Security
   - Enable 2FA
   - Generate App Password
   - Update `.env` with new password

3. **Email in spam folder**
   - Check spam/junk folder
   - Mark as "Not Spam"

4. **Gmail blocking**
   - Check Gmail security settings
   - Allow less secure apps (if needed)

**Solution:**
```bash
# Test email configuration
cd backend
node -e "import('./services/nodemailerService.js').then(m => m.testEmailConfiguration())"
```

### Issue 2: Code Not Working

**Possible Causes:**
1. **Code expired** (15 minutes passed)
2. **Wrong code entered**
3. **Code already used**
4. **Database connection issue**

**Solution:**
- Request new code
- Check console for actual code
- Verify database connection

### Issue 3: "Network Error"

**Possible Causes:**
1. **Backend not running**
2. **Wrong port**
3. **CORS issue**

**Solution:**
```bash
# Restart backend
cd backend
npm start
```

---

## 📊 Database Schema

### EmailVerification Collection

```javascript
{
  _id: ObjectId,
  email: String (indexed),
  code: String,
  userData: {
    login: String,
    email: String,
    password: String (hashed),
    name: String,
    authMethod: String
  },
  verificationType: String,
  createdAt: Date,
  expiresAt: Date (TTL index)
}
```

**Indexes:**
- `email` (for quick lookup)
- `expiresAt` (TTL index for auto-deletion)

---

## 🔄 Code Flow Diagram

```
┌─────────────┐
│   User      │
│  Signup     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  POST /send-verification│
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────┐
│  Generate 6-digit   │
│  Random Code        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Save to MongoDB    │
│  (15 min expiry)    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Send Email via     │
│  Nodemailer/Gmail   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Log Code to        │
│  Console            │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Return Success     │
│  to Frontend        │
└─────────────────────┘
```

---

## 💡 Key Features

### ✅ Advantages

1. **Professional Emails**
   - Branded HTML templates
   - RTX Cinema styling
   - Mobile-responsive

2. **Secure**
   - 15-minute expiration
   - One-time use codes
   - App password authentication

3. **Reliable**
   - Gmail SMTP (99.9% uptime)
   - Error handling
   - Fallback to console logging

4. **Developer Friendly**
   - Codes logged to console
   - Easy testing
   - Clear error messages

5. **User Friendly**
   - Clear instructions
   - Large code display
   - Security notices

---

## 🎯 Usage Examples

### Send Verification Code
```javascript
import { sendVerificationEmail } from './services/nodemailerService.js';

const result = await sendVerificationEmail(
  'user@example.com',
  '123456',
  'John Doe'
);

if (result.success) {
  console.log('Email sent!');
} else {
  console.error('Failed:', result.error);
}
```

### Send Password Reset
```javascript
import { sendPasswordResetEmail } from './services/nodemailerService.js';

const result = await sendPasswordResetEmail(
  'user@example.com',
  '789012',
  'John Doe'
);
```

### Send Welcome Email
```javascript
import { sendWelcomeEmail } from './services/nodemailerService.js';

const result = await sendWelcomeEmail(
  'user@example.com',
  'John Doe'
);
```

---

## 📝 Environment Variables

Required in `.env`:
```env
# Email Configuration
EMAIL_USER=cinemasrtx@gmail.com
EMAIL_PASS=your_app_password_here

# Optional
NODE_ENV=development
```

---

## 🚀 Production Considerations

### Before Going Live:

1. **Use Production Email**
   - Create dedicated email (e.g., noreply@rtxcinema.com)
   - Set up proper domain authentication

2. **Remove Console Logging**
   - Don't log codes in production
   - Only log errors

3. **Rate Limiting**
   - Limit verification requests per email
   - Prevent spam/abuse

4. **Email Delivery Service**
   - Consider SendGrid, AWS SES, or Mailgun
   - Better deliverability than Gmail

5. **Monitoring**
   - Track email delivery rates
   - Monitor failed sends
   - Alert on issues

---

## ✅ Current Status

Your Nodemailer system is:
- ✅ **Configured** with Gmail SMTP
- ✅ **Working** and sending emails
- ✅ **Secure** with app password
- ✅ **Professional** HTML templates
- ✅ **Tested** and verified
- ✅ **Logging** codes to console for development

**Email:** cinemasrtx@gmail.com  
**Status:** Active and sending  
**Expiration:** 15 minutes  
**Format:** 6-digit numeric code

---

**Your verification system is fully functional! 🎉**
