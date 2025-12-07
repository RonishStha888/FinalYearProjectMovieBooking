import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/sendgridService.js';

const router = express.Router();

// Generate 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { login, email, password } = req.body;

    // Validate input
    if (!login || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      login,
      email,
      password: hashedPassword,
      authMethod: 'email'
    });

    await user.save();

    // Send welcome email
    if (email) {
      await sendWelcomeEmail(email, login);
    }

    // Success
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id,
        login: user.login,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during signup' 
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

// Google signup/login endpoint
router.post('/google', async (req, res) => {
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
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create new user
      user = new User({
        login: email,
        email,
        name,
        googleId,
        authMethod: 'google'
      });
      await user.save();
      
      // Send welcome email for new users
      await sendWelcomeEmail(email, name);
    }

    // Success
    res.json({
      success: true,
      message: 'Google authentication successful',
      user: {
        id: user._id,
        login: user.login,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during Google authentication' 
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

export default router;
