import { useState } from "react";
import "../App.css";

export default function ForgotPasswordPage({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState("email"); // "email", "verify", "reset"
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setStep("verify");
        alert(`Verification code sent to ${email}. Please check your inbox!`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server. Make sure the backend is running!');
    }
    
    setIsLoading(false);
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!verificationCode || verificationCode.length !== 6) {
      alert("Please enter the 6-digit verification code!");
      setIsLoading(false);
      return;
    }

    // Move to password reset step (we'll verify the code when resetting)
    setStep("reset");
    setIsLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          code: verificationCode,
          newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Password reset successfully! You can now login with your new password.');
        onBackToLogin();
      } else {
        alert(`Error: ${data.message}`);
        // If verification code is invalid, go back to verification step
        if (data.message.includes('Invalid') || data.message.includes('expired')) {
          setStep("verify");
          setVerificationCode("");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to reset password. Please try again!');
    }
    
    setIsLoading(false);
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

      {/* Right side - Password Reset Form */}
      <div className="right-panel">
        <button className="back-arrow" onClick={onBackToLogin}>
          ←
        </button>
        
        <div className="login-container">
          {/* Step indicator */}
          <div className="step-indicator">
            <div className={`step-dot ${step === "email" ? "active" : ""}`}></div>
            <div className={`step-dot ${step === "verify" ? "active" : ""}`}></div>
            <div className={`step-dot ${step === "reset" ? "active" : ""}`}></div>
          </div>

          {step === "email" ? (
            <>
              <h1 className="welcome-title">Reset Password</h1>
              <p className="subtitle-text">
                Enter your email address and we'll send you a verification code to reset your password.
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
                  {isLoading ? "Sending..." : "Send Verification Code"}
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
            </>
          ) : step === "verify" ? (
            <>
              <h1 className="welcome-title">Enter Verification Code</h1>
              <p className="subtitle-text">
                We've sent a 6-digit verification code to <strong>{email}</strong>
              </p>

              <form className="login-form" onSubmit={handleVerificationSubmit}>
                <div className="form-group">
                  <label className="form-label">VERIFICATION CODE</label>
                  <input
                    type="text"
                    className="form-input verification-input"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                </div>

                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>
              </form>

              <p className="signup-text">
                Didn't receive the code? 
                <button 
                  className="link-button" 
                  onClick={() => setStep("email")}
                  style={{ marginLeft: '5px' }}
                >
                  Try Again
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="welcome-title">Set New Password</h1>
              <p className="subtitle-text">
                Enter your new password for <strong>{email}</strong>
              </p>

              <form className="login-form" onSubmit={handlePasswordReset}>
                <div className="form-group">
                  <label className="form-label">NEW PASSWORD</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">CONFIRM NEW PASSWORD</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <p className="signup-text">
                Wrong verification code? 
                <button 
                  className="link-button" 
                  onClick={() => setStep("verify")}
                  style={{ marginLeft: '5px' }}
                >
                  Go Back
                </button>
              </p>
            </>
          )}

          <footer className="footer-text">
            © 2024 RTX Cinema - Nepal's Premier Cinema Chain
          </footer>
        </div>
      </div>
    </div>
  );
}
