import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import "../App.css";
import { API_URL } from '../config';

export default function SignupPage({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address!");
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          login: username,
          email,
          password,
          name: name || username
        })
      });

      const data = await response.json();

      if (data.success) {
        setSignupSuccess(true);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server. Please try again!');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const userInfo = JSON.parse(jsonPayload);

      const googleUser = {
        email: userInfo.email,
        name: userInfo.name,
        googleId: userInfo.sub
      };

      // Try to login first
      const loginResponse = await fetch(`${API_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleUser)
      });

      const loginData = await loginResponse.json();

      if (loginData.success) {
        localStorage.setItem('user', JSON.stringify(loginData.user));
        window.location.href = '/';
      } else if (loginData.needsSignup) {
        // Create new account
        const signupResponse = await fetch(`${API_URL}/api/auth/google-signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(googleUser)
        });

        const signupData = await signupResponse.json();

        if (signupData.success) {
          localStorage.setItem('user', JSON.stringify(signupData.user));
          window.location.href = '/';
        } else {
          alert(`Error: ${signupData.message}`);
        }
      } else {
        alert(`Error: ${loginData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process Google sign-in!');
    }
  };

  const handleGoogleError = () => {
    alert('Google Sign-In failed. Please try again.');
  };

  // Success screen
  if (signupSuccess) {
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
                We've sent a verification link to <strong>{email}</strong>
              </p>
              <p className="subtitle-text">
                Please click the link in the email to verify your account and complete the signup process.
              </p>
              <p className="subtitle-text" style={{ marginTop: '20px', fontSize: '14px' }}>
                Didn't receive the email? Check your spam folder or try signing up again.
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

  // Signup form
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
          <h1 className="welcome-title">Create Account</h1>
          <p className="subtitle-text">Join RTX Cinema for the best movie experience</p>

          <form className="login-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">EMAIL</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">USERNAME</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">FULL NAME (Optional)</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <label className="form-label">CONFIRM PASSWORD</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="signup-text">
            Already have an account? <button className="link-button" onClick={onBackToLogin}>Login</button>
          </p>

          <div className="auth-divider">OR</div>

          <div className="google-signin-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="350"
            />
          </div>

          <footer className="footer-text">
            © 2024 RTX Cinema
          </footer>
        </div>
      </div>
    </div>
  );
}
