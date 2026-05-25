import { BrevoClient } from '@getbrevo/brevo';

/**
 * Get Brevo client instance
 */
const getClient = () => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not defined in environment variables');
  }
  return new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
};

/**
 * Send email verification link
 */
export const sendVerificationEmail = async (email, token, userName) => {
  try {
    const client = getClient();
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const result = await client.transactionalEmails.sendTransacEmail({
      sender: { 
        name: "RTX Cinema", 
        email: process.env.BREVO_SENDER_EMAIL || "noreply@rtxcinema.com" 
      },
      to: [{ email, name: userName }],
      subject: "Verify Your RTX Cinema Account",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D84040, #c73636); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #D84040, #c73636); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Welcome to RTX Cinema!</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>Thank you for signing up! We're excited to have you join our cinema community.</p>
              <p>Please verify your email address by clicking the button below:</p>
              <center>
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${verificationLink}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account with RTX Cinema, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 RTX Cinema. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Verification email sent via Brevo:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Brevo email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email after verification
 */
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const client = getClient();
    const result = await client.transactionalEmails.sendTransacEmail({
      sender: { 
        name: "RTX Cinema", 
        email: process.env.BREVO_SENDER_EMAIL || "noreply@rtxcinema.com" 
      },
      to: [{ email, name: userName }],
      subject: "Welcome to RTX Cinema! 🎉",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D84040, #c73636); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Welcome to RTX Cinema!</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>Your email has been verified successfully! 🎉</p>
              <p>You can now enjoy all the features of RTX Cinema:</p>
              <ul>
                <li>🎟️ Book movie tickets online</li>
                <li>🍿 Pre-order food & beverages</li>
                <li>⭐ Earn loyalty points</li>
                <li>🎁 Get exclusive offers</li>
              </ul>
              <p>Start exploring now and book your next movie experience!</p>
            </div>
            <div class="footer">
              <p>© 2024 RTX Cinema. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Welcome email sent via Brevo:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Brevo welcome email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const client = getClient();
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const result = await client.transactionalEmails.sendTransacEmail({
      sender: { 
        name: "RTX Cinema", 
        email: process.env.BREVO_SENDER_EMAIL || "noreply@rtxcinema.com" 
      },
      to: [{ email, name: userName }],
      subject: "Reset Your RTX Cinema Password",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D84040, #c73636); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #D84040, #c73636); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>We received a request to reset your password for your RTX Cinema account.</p>
              <p>Click the button below to reset your password:</p>
              <center>
                <a href="${resetLink}" class="button">Reset Password</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetLink}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
              <p>© 2024 RTX Cinema. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Password reset email sent via Brevo:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Brevo password reset email error:', error);
    return { success: false, error: error.message };
  }
};
