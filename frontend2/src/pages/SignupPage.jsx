import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import "../App.css";

export default function SignupPage({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Verification states
  const [step, setStep] = useState("signup"); // "signup" or "verify"
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email format
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
      const response = await fetch('http://localhost:5000/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          login: username,
          email,
          password,
          verificationType: 'signup'
        })
      });

      const data = await response.json();

      if (data.success) {
        setPendingEmail(email);
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

  const handleVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!verificationCode || verificationCode.length !== 6) {
      alert("Please enter the 6-digit verification code!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: pendingEmail,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Welcome ${data.user.login}! Account created successfully. Check your email for welcome message!`);
        console.log('User data:', data.user);
        onBackToLogin();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to verify code. Please try again!');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    
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
        googleId: userInfo.sub,
        login: userInfo.email
      };

      // First check if user already exists (try login)
      const loginResponse = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleUser)
      });

      const loginData = await loginResponse.json();

      if (loginData.success) {
        alert(`Welcome back ${loginData.user.name}! Logged in successfully.`);
        console.log('User data:', loginData.user);
        onBackToLogin();
        setIsLoading(false);
        return;
      }

      // If user doesn't exist, send verification for signup
      if (loginData.needsSignup) {
        const verifyResponse = await fetch('http://localhost:5000/api/auth/send-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: googleUser.email,
            verificationType: 'google-signup',
            googleData: googleUser
          })
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
          setPendingEmail(googleUser.email);
          setStep("verify");
          alert(`Verification code sent to ${googleUser.email}. Please check your inbox to complete Google signup!`);
        } else {
          alert(`Error: ${verifyData.message}`);
        }
      } else {
        alert(`Error: ${loginData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process Google sign-up!');
    }
    
    setIsLoading(false);
  };

  const handleGoogleError = () => {
    alert('Google Sign-Up failed. Please try again.');
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

      {/* Right side - Signup Form */}
      <div className="right-panel">
        <button className="back-arrow" onClick={onBackToLogin}>
          ←
        </button>
        
        <div className="login-container">
          {/* Step indicator */}
          <div className="step-indicator">
            <div className={`step-dot ${step === "signup" ? "active" : ""}`}></div>
            <div className={`step-dot ${step === "verify" ? "active" : ""}`}></div>
          </div>

          {step === "signup" ? (
            <>
              <h1 className="welcome-title">Create Account</h1>

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
              <label className="form-label">PASSWORD</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <label className="form-label">CONFIRM PASSWORD</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </button>
              </form>

              <div className="auth-divider">Or sign up with</div>

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
            </>
          ) : (
            <>
              <h1 className="welcome-title">Verify Your Email</h1>
              <p className="subtitle-text">
                We've sent a 6-digit verification code to <strong>{pendingEmail}</strong>
              </p>

              <form className="login-form" onSubmit={handleVerification}>
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
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
                </button>
              </form>

              <p className="signup-text">
                Didn't receive the code? 
                <button 
                  className="link-button" 
                  onClick={() => setStep("signup")}
                  style={{ marginLeft: '5px' }}
                >
                  Try Again
                </button>
              </p>
            </>
          )}

          <footer className="footer-text">
            © 2020-2021, PT TIX ID
          </footer>
        </div>
      </div>
    </div>
  );
}
