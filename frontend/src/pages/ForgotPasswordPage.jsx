import { useState } from "react";
import "../App.css";

export default function ForgotPasswordPage({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server. Make sure the backend is running!');
    }
  };

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

      {/* Right side - Forgot Password Form */}
      <div className="right-panel">
        <button className="back-arrow" onClick={onBackToLogin}>
          ←
        </button>
        
        <div className="login-container">
          {!isSubmitted ? (
            <>
              <h1 className="welcome-title">Reset Password</h1>
              <p className="subtitle-text">
                Enter your email address and we'll send you instructions to reset your password.
              </p>

              <form className="login-form" onSubmit={handleSubmit}>
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

                <button type="submit" className="login-btn">
                  Send Reset Link
                </button>
              </form>

              <p className="signup-text">
                Remember your password? <button className="link-button" onClick={onBackToLogin}>Back to Login</button>
              </p>
            </>
          ) : (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h1 className="welcome-title">Check Your Email</h1>
              <p className="subtitle-text">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="subtitle-text">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button className="login-btn" onClick={onBackToLogin}>
                Back to Login
              </button>
            </div>
          )}

          <footer className="footer-text">
            © 2020-2021, PT TIX ID
          </footer>
        </div>
      </div>
    </div>
  );
}
