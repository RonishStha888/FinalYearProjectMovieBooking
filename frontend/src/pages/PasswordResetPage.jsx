import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import '../App.css';

export default function PasswordResetPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevent double checking in React StrictMode
    if (hasChecked.current) return;
    hasChecked.current = true;
    
    // Token is valid if it exists (we'll verify on submit)
    if (token) {
      setTokenValid(true);
    } else {
      setTokenValid(false);
    }
  }, [token]);

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
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Password reset successfully! You can now login with your new password.');
        navigate('/');
      } else {
        alert(`Error: ${data.message}`);
        if (data.message.includes('Invalid') || data.message.includes('expired')) {
          setTokenValid(false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to reset password. Please try again!');
    }
    
    setIsLoading(false);
  };

  if (tokenValid === null) {
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
          <div className="login-container">
            <div className="verification-spinner"></div>
            <h2>Verifying reset link...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
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
          <div className="login-container">
            <div className="verification-icon error">✗</div>
            <h2>Invalid or Expired Link</h2>
            <p>This password reset link is invalid or has expired.</p>
            <button 
              className="login-btn"
              onClick={() => navigate('/')}
              style={{ marginTop: '20px' }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <button className="back-arrow" onClick={() => navigate('/')}>
          ←
        </button>

        <div className="login-container">
          <h1 className="welcome-title">Set New Password</h1>
          <p className="subtitle-text">
            Enter your new password below
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
                  minLength={8}
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
                  minLength={8}
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

          <footer className="footer-text">
            © 2024 RTX Cinema
          </footer>
        </div>
      </div>
    </div>
  );
}
