import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../services/brevoService.js';

const router = express.Router();

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * SIGNUP - Send verification email with link
 */
router.post('/signup', async (req, res) => {
  try {
    const { login, email, password, name } = req.body;

    console.log(`📧 Signup request for: ${email}`);

    // Validate fields
    if (!login || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ login }, { email }] 
    });
    
    if (existingUser) {
      if (existingUser.emailVerified) {
        return res.status(400).json({ 
          success: false, 
          message: 'User already exists with this email or username' 
        });
      } else {
        // User exists but not verified - resend verification
        const verificationToken = crypto.randomBytes(32).toString('hex');
        existingUser.verificationToken = verificationToken;
        existingUser.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await existingUser.save();

        await sendVerificationEmail(email, verificationToken, existingUser.name);

        return res.json({
          success: true,
          message: 'Verification email resent. Please check your inbox.',
          email
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user (not verified yet)
    const user = await User.create({
      login,
      email,
      password: hashedPassword,
      name: name || login,
      authMethod: 'email',
      emailVerified: false,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    console.log(`✅ User created (unverified): ${user.login}`);

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken, user.name);

    if (emailResult.success) {
      console.log(`📧 Verification email sent to ${email}`);
    } else {
      console.error(`❌ Failed to send verification email:`, emailResult.error);
    }

    res.json({
      success: true,
      message: 'Signup successful! Please check your email to verify your account.',
      email
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during signup' 
    });
  }
});

/**
 * VERIFY EMAIL - Verify token and activate account
 */
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    console.log(`🔍 Email verification attempt with token: ${token.substring(0, 10)}...`);

    // Find user with this token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      console.log(`❌ No user found with token or token expired`);
      
      // Check if user exists with this token (but expired)
      const expiredUser = await User.findOne({ verificationToken: token });
      if (expiredUser) {
        console.log(`⏰ Token expired for user: ${expiredUser.login}`);
        return res.status(400).json({
          success: false,
          message: 'Verification link has expired. Please sign up again.'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification link'
      });
    }

    // Verify the user
    user.emailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    console.log(`✅ Email verified for user: ${user.login}`);

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    res.json({
      success: true,
      message: 'Email verified successfully! You can now login.',
      user: {
        _id: user._id,
        login: user.login,
        email: user.email,
        name: user.name,
        role: user.role,
        authMethod: user.authMethod,
        loyaltyPoints: user.loyaltyPoints
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during verification'
    });
  }
});

/**
 * LOGIN
 */
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ 
      $or: [{ login }, { email: login }] 
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if email is verified (only for email auth)
    if (user.authMethod === 'email' && !user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for the verification link.',
        needsVerification: true
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        login: user.login,
        email: user.email,
        name: user.name,
        role: user.role,
        authMethod: user.authMethod,
        loyaltyPoints: user.loyaltyPoints
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

/**
 * GOOGLE LOGIN
 */
router.post('/google-login', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        needsSignup: true,
        message: 'No account found. Please sign up first.'
      });
    }

    // Google users are automatically verified
    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        login: user.login,
        email: user.email,
        name: user.name,
        role: user.role,
        authMethod: user.authMethod,
        loyaltyPoints: user.loyaltyPoints
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

/**
 * GOOGLE SIGNUP
 */
router.post('/google-signup', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user with Google auth (automatically verified)
    const user = await User.create({
      login: email.split('@')[0] + '_' + Date.now(),
      email,
      name,
      googleId,
      authMethod: 'google',
      emailVerified: true, // Google users are pre-verified
      password: crypto.randomBytes(32).toString('hex') // Random password (not used)
    });

    console.log(`✅ Google user created: ${user.login}`);

    // Send welcome email
    await sendWelcomeEmail(email, name);

    res.json({
      success: true,
      message: 'Signup successful',
      user: {
        _id: user._id,
        login: user.login,
        email: user.email,
        name: user.name,
        role: user.role,
        authMethod: user.authMethod,
        loyaltyPoints: user.loyaltyPoints
      }
    });

  } catch (error) {
    console.error('Google signup error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during Google signup'
    });
  }
});

/**
 * FORGOT PASSWORD
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    await PasswordReset.create({
      email,
      code: resetCode,
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    await sendPasswordResetEmail(email, resetToken, user.name);

    res.json({
      success: true,
      message: 'Password reset link sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred'
    });
  }
});

/**
 * RESET PASSWORD
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const resetRecord = await PasswordReset.findOne({
      token,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link'
      });
    }

    const user = await User.findOne({ email: resetRecord.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await PasswordReset.deleteMany({ email: resetRecord.email });

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred'
    });
  }
});

export default router;
