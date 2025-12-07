import nodemailer from 'nodemailer';

// Create transporter using Gmail
// You'll need to use an App Password for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD // Your Gmail App Password
    }
  });
};

// Send welcome email when user signs up
export const sendWelcomeEmail = async (userEmail, userName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `RTX Cinema <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🎬 Welcome to RTX Cinema!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #D84040 0%, #8E1616 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 32px; }
          .content { padding: 40px 30px; }
          .content h2 { color: #1D1616; margin-top: 0; }
          .content p { color: #666; line-height: 1.6; font-size: 16px; }
          .button { display: inline-block; background: #D84040; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 RTX Cinema</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${userName || 'Movie Lover'}! 🎉</h2>
            <p>Thank you for creating an account with RTX Cinema. We're excited to have you join our community of movie enthusiasts!</p>
            <p>Your account has been successfully created and you can now:</p>
            <ul>
              <li>Browse our extensive movie collection</li>
              <li>Book tickets for the latest releases</li>
              <li>Get personalized movie recommendations</li>
              <li>Access exclusive member benefits</li>
            </ul>
            <p>Start exploring now and enjoy the ultimate cinema experience!</p>
            <a href="http://localhost:5173" class="button">Start Watching</a>
          </div>
          <div class="footer">
            <p>© 2020-2021, PT TIX ID</p>
            <p>This email was sent to ${userEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset code
export const sendPasswordResetEmail = async (userEmail, resetCode) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `RTX Cinema <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🔐 Password Reset Code - RTX Cinema',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #D84040 0%, #8E1616 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 32px; }
          .content { padding: 40px 30px; text-align: center; }
          .content h2 { color: #1D1616; margin-top: 0; }
          .content p { color: #666; line-height: 1.6; font-size: 16px; }
          .code-box { background: #f5f5f5; border: 2px dashed #D84040; border-radius: 8px; padding: 20px; margin: 30px 0; }
          .code { font-size: 36px; font-weight: bold; color: #D84040; letter-spacing: 8px; font-family: monospace; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; text-align: left; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 RTX Cinema</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Use the code below to reset your password:</p>
            <div class="code-box">
              <div class="code">${resetCode}</div>
            </div>
            <p>This code will expire in <strong>15 minutes</strong>.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
          </div>
          <div class="footer">
            <p>© 2020-2021, PT TIX ID</p>
            <p>This email was sent to ${userEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending reset email:', error);
    return { success: false, error: error.message };
  }
};
