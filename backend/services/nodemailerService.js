import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter with Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // Your Gmail app password
    }
  });
};

// Send welcome email
export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'RTX Cinema',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: '🎬 Welcome to RTX Cinema!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #D84040; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎬 RTX Cinema</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Premium Movie Experience</p>
          </div>
          
          <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Welcome, ${userName}! 🎉</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for joining RTX Cinema! Your account has been successfully created.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #D84040; margin-top: 0;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>🎬 Browse our latest movies</li>
                <li>🎫 Book your favorite shows</li>
                <li>🏢 Find cinema locations near you</li>
                <li>🎁 Enjoy exclusive offers and promotions</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173" style="background-color: #D84040; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Start Booking Movies
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #999; font-size: 14px;">
              <p>RTX Cinema - Nepal's Premier Cinema Chain</p>
              <p>📧 info@rtxcinema.com | 📞 +977-1-4444444</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userEmail}`);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (userEmail, resetCode, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'RTX Cinema',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: '🔐 Password Reset - RTX Cinema',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #D84040; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎬 RTX Cinema</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
          </div>
          
          <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hello, ${userName}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password. Use the code below to reset your password:
            </p>
            
            <div style="background-color: #f8f9fa; border: 2px dashed #D84040; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <div style="font-size: 32px; font-weight: bold; color: #D84040; letter-spacing: 4px; font-family: monospace;">
                ${resetCode}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              This reset code will expire in <strong>15 minutes</strong>.
            </p>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>🔒 Security Notice:</strong><br>
                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
              </p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #999; font-size: 14px;">
              <p>RTX Cinema - Nepal's Premier Cinema Chain</p>
              <p>📧 info@rtxcinema.com | 📞 +977-1-4444444</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${userEmail}`);
    console.log(`🔐 RESET CODE: ${resetCode}`); // Log for development
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (userEmail, userName, bookingDetails) => {
  try {
    const transporter = createTransporter();
    
    const { movieTitle, cinemaName, showDate, showTime, seats, totalAmount, bookingReference } = bookingDetails;
    
    const mailOptions = {
      from: {
        name: 'RTX Cinema',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: `🎫 Booking Confirmed - ${movieTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #D84040; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎬 RTX Cinema</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Booking Confirmation</p>
          </div>
          
          <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">🎉 Booking Confirmed!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hello ${userName}, your movie booking has been confirmed successfully!
            </p>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #D84040; margin-top: 0; margin-bottom: 20px;">🎫 Booking Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Movie:</td>
                  <td style="padding: 8px 0; color: #333;">${movieTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Cinema:</td>
                  <td style="padding: 8px 0; color: #333;">${cinemaName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                  <td style="padding: 8px 0; color: #333;">${showDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Time:</td>
                  <td style="padding: 8px 0; color: #333;">${showTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Seats:</td>
                  <td style="padding: 8px 0; color: #333;">${seats.join(', ')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 8px 0; color: #D84040; font-weight: bold;">NPR ${totalAmount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Booking Reference:</td>
                  <td style="padding: 8px 0; color: #333; font-family: monospace;">${bookingReference}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #155724; font-size: 14px;">
                <strong>📱 Important:</strong><br>
                Please arrive at the cinema at least 15 minutes before showtime. Bring a valid ID and this confirmation email.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173" style="background-color: #D84040; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                View My Bookings
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #999; font-size: 14px;">
              <p>RTX Cinema - Nepal's Premier Cinema Chain</p>
              <p>📧 info@rtxcinema.com | 📞 +977-1-4444444</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email sent to ${userEmail}`);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send email verification code
export const sendVerificationEmail = async (userEmail, verificationCode, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'RTX Cinema',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: '🔐 Email Verification - RTX Cinema',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #D84040; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎬 RTX Cinema</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
          </div>
          
          <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hello, ${userName}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              To complete your RTX Cinema account setup, please verify your email address using the code below:
            </p>
            
            <div style="background-color: #f8f9fa; border: 2px dashed #D84040; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
              <div style="font-size: 32px; font-weight: bold; color: #D84040; letter-spacing: 4px; font-family: monospace;">
                ${verificationCode}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              This verification code will expire in <strong>15 minutes</strong>.
            </p>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>🔒 Security Notice:</strong><br>
                If you didn't request this verification, please ignore this email. Your account will not be created.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; font-size: 14px;">
                Enter this code on the RTX Cinema verification page to complete your signup.
              </p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #999; font-size: 14px;">
              <p>RTX Cinema - Nepal's Premier Cinema Chain</p>
              <p>📧 info@rtxcinema.com | 📞 +977-1-4444444</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${userEmail}`);
    console.log(`🔐 VERIFICATION CODE: ${verificationCode}`); // Log for development
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    
    // Verify connection
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};