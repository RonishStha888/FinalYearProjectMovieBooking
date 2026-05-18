import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import EmailVerification from '../models/EmailVerification.js';
import { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail } from '../services/nodemailerService.js';

const router = express.Router();

// Generate 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Send verification code for signup
router.post('/send-verification', async (req, res) => {
  try {
    const { login, email, password, name, verificationType = 'signup', googleData } = req.body;

    console.log(`📧 Verification request for: ${email}, Type: ${verificationType}`);

    // Validate email format
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // For regular signup, validate other fields
    if (verificationType === 'signup') {
      if (!login || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username and password are required' 
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ login }, { email }] 
      });
      if (existingUser) {
        console.log(`❌ User already exists: ${existingUser.login} / ${existingUser.email}`);
        return res.status(409).json({ 
          success: false, 
          message: 'Username or email already exists' 
        });
      }
    }

    // For Google signup, check if email already exists
    if (verificationType === 'google-signup') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`❌ Google user already exists: ${existingUser.email}`);
        return res.status(409).json({ 
          success: false, 
          message: 'An account with this email already exists' 
        });
      }
    }

    // Generate random 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔐 Generated OTP: ${verificationCode} for ${email}`);

    // Prepare user data to store temporarily
    const userData = verificationType === 'signup' 
      ? { login, email, password, name: name || login, authMethod: 'email' }
      : { ...googleData, authMethod: 'google' };

    // Delete any existing verification for this email
    await EmailVerification.deleteMany({ email });
    console.log(`🗑️ Cleaned up old verifications for ${email}`);

    // Save verification code with expiration
    const verification = await EmailVerification.create({
      email,
      code: verificationCode,
      userData,
      verificationType,
      createdAt: new Date() // Will expire in 15 minutes due to schema
    });
    console.log(`💾 Saved verification record: ${verification._id}`);

    // Send verification email
    const userName = verificationType === 'signup' ? (name || login) : googleData?.name;
    
    // Always log verification code to console for development
    console.log(`\n🔐 VERIFICATION CODE FOR ${email}: ${verificationCode}`);
    console.log(`⏰ Code expires in 15 minutes\n`);
    
    try {
      const emailResult = await sendVerificationEmail(email, verificationCode, userName);
      if (emailResult.success) {
        console.log(`✅ Email sent successfully to ${email}`);
      } else {
        console.log(`⚠️ Email sending failed, but code is available in console`);
      }
    } catch (emailError) {
      console.error('Email sending failed, but verification code is available in console:', emailError);
    }

    res.json({
      success: true,
      message: 'Verification code sent to your email',
      email: email
    });

  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while sending verification code' 
    });
  }
});

// Verify code and complete signup
router.post('/verify-signup', async (req, res) => {
  try {
    const { email, code } = req.body;

    console.log(`🔍 Verification attempt for: ${email} with code: ${code}`);

    if (!email || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and verification code are required' 
      });
    }

    // Find verification record
    const verification = await EmailVerification.findOne({ email, code });
    if (!verification) {
      console.log(`❌ Invalid verification: ${email} / ${code}`);
      
      // Check if there's any verification for this email
      const anyVerification = await EmailVerification.findOne({ email });
      if (anyVerification) {
        console.log(`📧 Found verification for ${email} but code mismatch. Expected: ${anyVerification.code}`);
      } else {
        console.log(`📧 No verification found for ${email}`);
      }
      
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification code' 
      });
    }

    console.log(`✅ Verification found: ${verification._id}`);

    // Double-check that user doesn't already exist (race condition protection)
    const userData = verification.userData;
    if (verification.verificationType === 'signup') {
      const existingUser = await User.findOne({ 
        $or: [{ login: userData.login }, { email: userData.email }] 
      });
      if (existingUser) {
        console.log(`❌ User already exists during verification: ${existingUser.login}`);
        await EmailVerification.deleteOne({ _id: verification._id });
        return res.status(409).json({ 
          success: false, 
          message: 'Username or email already exists' 
        });
      }
    }

    // Create user account
    if (verification.verificationType === 'signup') {
      // Hash password for regular signup
      console.log(`🔐 Hashing password for ${userData.login}`);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
    }

    console.log(`👤 Creating user: ${userData.login || userData.name}`);
    const user = new User(userData);
    await user.save();
    console.log(`✅ User created with ID: ${user._id}`);

    // Award welcome bonus points
    try {
      await user.addPoints(10, 'Welcome bonus - new account', null, 'bonus');
      console.log(`🎁 Welcome bonus (10 pts) awarded to ${user.login}`);
    } catch (bonusErr) {
      console.log('Welcome bonus failed (non-critical):', bonusErr.message);
    }

    // Delete verification record
    await EmailVerification.deleteOne({ _id: verification._id });
    console.log(`🗑️ Verification record cleaned up`);

    // Send welcome email
    try {
      await sendWelcomeEmail(email, userData.name || userData.login);
      console.log(`📧 Welcome email sent to ${email}`);
    } catch (emailError) {
      console.log(`⚠️ Welcome email failed, but user was created successfully`);
    }

    // Success
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome email sent.',
      user: {
        _id: user._id,
        id: user._id,
        login: user.login,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Verify signup error:', error);
    
    // Provide more specific error messages
    if (error.code === 11000) {
      // Duplicate key error
      const field = error.keyPattern?.login ? 'username' : 'email';
      return res.status(409).json({ 
        success: false, 
        message: `This ${field} is already taken. Please choose a different one.` 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during account verification' 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    // Validate input
    if (!login || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Login and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid login or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid login or password' 
      });
    }

    // Success
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        id: user._id,
        login: user.login,
        email: user.email,
        name: user.name,
        loyaltyPoints: user.loyaltyPoints?.available || 0
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login' 
    });
  }
});

// Google login (for existing users)
router.post('/google-login', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    // Validate input
    if (!email || !googleId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and Google ID are required' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ 
      $or: [{ googleId }, { email }] 
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found. Please sign up first.',
        needsSignup: true
      });
    }

    // Success - user exists
    res.json({
      success: true,
      message: 'Google login successful',
      user: {
        _id: user._id,
        id: user._id,
        login: user.login,
        email: user.email,
        name: user.name,
        loyaltyPoints: user.loyaltyPoints?.available || 0
      }
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during Google login' 
    });
  }
});

// Forgot password - Send reset code
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset code.'
      });
    }

    // Generate 6-digit code
    const resetCode = generateResetCode();

    // Save reset code to database
    await PasswordReset.create({
      email,
      code: resetCode
    });

    // Send email with reset code
    try {
      await sendPasswordResetEmail(email, resetCode, user.name || user.login);
      console.log(`📧 Password reset email sent to ${email}`);
    } catch (emailError) {
      console.log(`⚠️ Password reset email failed:`, emailError.message);
      // Still return success to not reveal if email exists
    }

    res.json({
      success: true,
      message: 'Password reset code sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your request' 
    });
  }
});

// Verify reset code and reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, code, and new password are required' 
      });
    }

    // Find valid reset code
    const resetRequest = await PasswordReset.findOne({ email, code });
    if (!resetRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset code' 
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete used reset code
    await PasswordReset.deleteOne({ _id: resetRequest._id });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while resetting password' 
    });
  }
});

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { email, type = 'verification' } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    let result;
    if (type === 'welcome') {
      result = await sendWelcomeEmail(email, 'Test User');
    } else if (type === 'reset') {
      const testCode = generateResetCode();
      result = await sendPasswordResetEmail(email, testCode, 'Test User');
    } else if (type === 'verification') {
      const testCode = generateResetCode();
      result = await sendVerificationEmail(email, testCode, 'Test User');
    }

    res.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully!' : 'Failed to send test email',
      error: result.error || null
    });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send test email',
      error: error.message 
    });
  }
});

export default router;
