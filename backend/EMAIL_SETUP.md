# Email Setup Guide for RTX Cinema

## Gmail App Password Setup

To send emails from your application, you need to create a Gmail App Password.

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click on **2-Step Verification**
4. Follow the steps to enable 2-Step Verification

### Step 2: Generate App Password

1. Go back to **Security** settings
2. Under "Signing in to Google", click on **App passwords**
3. You might need to sign in again
4. Select app: **Mail**
5. Select device: **Other (Custom name)**
6. Enter name: **RTX Cinema**
7. Click **Generate**
8. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

### Step 3: Update .env File

Open `backend/.env` and update:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

Replace:
- `your-actual-email@gmail.com` with your Gmail address
- `xxxx xxxx xxxx xxxx` with the App Password you generated

### Step 4: Test the Setup

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Try signing up with a real email address
3. Check your inbox for the welcome email!

---

## Features Implemented

### 1. Welcome Email on Signup
- Sent automatically when user creates account
- Beautiful HTML template with RTX Cinema branding
- Includes account benefits and call-to-action

### 2. Password Reset Email
- 6-digit verification code
- Code expires after 15 minutes
- Secure HTML template with warnings

### 3. Email Templates
- Professional design matching your color theme
- Responsive HTML emails
- Clear call-to-actions

---

## Testing

### Test Welcome Email
1. Sign up with your real email
2. Check inbox for welcome email

### Test Password Reset
1. Click "Lost Password? Reset Password" on login page
2. Enter your email
3. Check inbox for reset code
4. Use code to reset password

---

## Troubleshooting

### "Invalid login" error
- Make sure 2-Factor Authentication is enabled
- Use App Password, not your regular Gmail password
- Remove spaces from the App Password in .env

### Emails not sending
- Check if EMAIL_USER and EMAIL_PASSWORD are set correctly
- Make sure backend server is running
- Check console for error messages

### Emails going to spam
- This is normal for development
- Check your spam folder
- In production, use a professional email service like SendGrid or AWS SES

---

## Production Recommendations

For production, consider using:
- **SendGrid** - Free tier: 100 emails/day
- **AWS SES** - Very cheap, reliable
- **Mailgun** - Good for transactional emails
- **Postmark** - Excellent deliverability

These services have better deliverability rates than Gmail.
