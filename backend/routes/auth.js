import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import EmailVerification from '../models/EmailVerification.js';
import { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail } from '../services/sendgridService.js';

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
    const { login, email, password, verificationType = 'signup', googleData } = req.body;

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
        return res.status(409).json({ 
          success: false, 
          message: 'An account with this email already exists' 
        });
      }
    }

    // Generate verification code
    const verificationCode = generateResetCode();

    // Prepare user data to store temporarily
    const userData = verificationType === 'signup' 
      ? { login, email, password, authMethod: 'email' }
      : { ...googleData, authMethod: 'google' };

    // Delete any existing verification for this email
    await EmailVerification.deleteMany({ email });

    // Save verification code
    await EmailVerification.create({
      email,
      code: verificationCode,
      userData,
      verificationType
    });

    // Send verification email
    const userName = verificationType === 'signup' ? login : googleData?.name;
    
    // Always log verification code to console for development
    console.log(`\n🔐 VERIFICATION CODE FOR ${email}: ${verificationCode}`);
    console.log(`⏰ Code expires in 15 minutes\n`);
    
    try {
      await sendVerificationEmail(email, verificationCode, userName);
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

    if (!email || !code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and verification code are required' 
      });
    }

    // Find verification record
    const verification = await EmailVerification.findOne({ email, code });
    if (!verification) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification code' 
      });
    }

    // Create user account
    const userData = verification.userData;
    
    if (verification.verificationType === 'signup') {
      // Hash password for regular signup
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
    }

    const user = new User(userData);
    await user.save();

    // Delete verification record
    await EmailVerification.deleteOne({ _id: verification._id });

    // Send welcome email
    await sendWelcomeEmail(email, userData.login || userData.name);

    // Success
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome email sent.',
      user: {
        id: user._id,
        login: user.login,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Verify signup error:', error);
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
        id: user._id,
        login: user.login,
        email: user.email,
        name: user.name
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
        id: user._id,
        login: user.login,
        email: user.email,
        name: user.name
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
    await sendPasswordResetEmail(email, resetCode);

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
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Send test verification email
    const testCode = generateResetCode();
    await sendVerificationEmail(email, testCode, 'Test User');

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      code: testCode // Only for testing - remove in production
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
