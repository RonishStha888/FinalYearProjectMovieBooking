import { useState } from "react";
import "../App.css";
import { API_URL } from '../config';

export default function ForgotPasswordPage({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email format
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setEmailSent(true);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server. Make sure the backend is running!');
    }
    
    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <div className="app-container">
        <div className="left-panel">
          <img 
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800" 
            alt="Cinema" 
            className="cinema-image"
          />
        </div>

        <div className="right-panel">
          <button className="back-arrow" onClick={onBackToLogin}>
            ←
          </button>

          <div className="login-container">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h1 className="welcome-title">Check Your Email!</h1>
              <p className="subtitle-text">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="subtitle-text">
                Please click the link in the email to reset your password.
              </p>
              <p className="subtitle-text" style={{ marginTop: '20px', fontSize: '14px' }}>
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button 
                className="login-btn" 
                onClick={onBackToLogin}
                style={{ marginTop: '30px' }}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Left side - Image */}
      <div className="left-panel">
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800" 
          alt="Cinema" 
          className="cinema-image"
        />
      </div>

      {/* Right side - Password Reset Form */}
      <div className="right-panel">
        <button className="back-arrow" onClick={onBackToLogin}>
          ←
        </button>
        
        <div className="login-container">
          <h1 className="welcome-title">Reset Password</h1>
          <p className="subtitle-text">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form className="login-form" onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label className="form-label">EMAIL</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="signup-text">
            Remember your password? 
            <button 
              className="link-button" 
              onClick={onBackToLogin}
              style={{ marginLeft: '5px' }}
            >
              Back to Login
            </button>
          </p>

          <footer className="footer-text">
            © 2024 RTX Cinema
          </footer>
        </div>
      </div>
    </div>
  );
}
