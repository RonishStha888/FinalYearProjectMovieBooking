import nodemailer from 'nodemailer';

// Create transporter - works globally without regional restrictions
const createTransporter = async () => {
  // For development: Use Ethereal Email (fake SMTP service for testing)
  if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  
  // For production: Use any SMTP service (Mailtrap, etc.)
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send welcome email when user signs up
export const sendWelcomeEmail = async (userEmail, userName) => {
  const transporter = await createTransporter();
  
  const mailOptions = {
    from: `RTX Cinema <${process.env.FROM_EMAIL || 'noreply@rtxcinema.com'}>`,
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
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userEmail}`);
    
    // In development, show preview URL
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send email verification code
export const sendVerificationEmail = async (userEmail, verificationCode, userName) => {
  const transporter = await createTransporter();
  
  const mailOptions = {
    from: `RTX Cinema <${process.env.FROM_EMAIL || 'noreply@rtxcinema.com'}>`,
    to: userEmail,
    subject: '🔐 Verify Your Email - RTX Cinema',
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
          .warning { background: #e7f3ff; border-left: 4px solid #2196F3; padding: 12px; margin: 20px 0; text-align: left; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 RTX Cinema</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hello ${userName || 'Movie Lover'}! 👋</p>
            <p>To complete your RTX Cinema account setup, please verify your email address using the code below:</p>
            <div class="code-box">
              <div class="code">${verificationCode}</div>
            </div>
            <p>This verification code will expire in <strong>15 minutes</strong>.</p>
            <div class="warning">
              <strong>🔒 Security Notice:</strong><br>
              If you didn't create an account with RTX Cinema, please ignore this email.
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
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${userEmail}`);
    console.log(`🔐 VERIFICATION CODE: ${verificationCode}`); // Always log for development
    
    // In development, show preview URL
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset code
export const sendPasswordResetEmail = async (userEmail, resetCode) => {
  const transporter = await createTransporter();
  
  const mailOptions = {
    from: `RTX Cinema <${process.env.FROM_EMAIL || 'noreply@rtxcinema.com'}>`,
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
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${userEmail}`);
    
    // In development, show preview URL
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending reset email:', error);
    return { success: false, error: error.message };
  }
};
