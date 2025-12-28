import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmailTestPage from './pages/EmailTestPage';
import "./App.css";

const GOOGLE_CLIENT_ID = "482064319034-pu4frhppprsrmeh481o6620lg8bm3lor.apps.googleusercontent.com";

function AppContent() {
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailTest, setShowEmailTest] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setShowSignup(false);
    setShowForgotPassword(false);
    setShowEmailTest(false);
  };

  if (isLoggedIn) {
    return <HomePage user={currentUser} onLogout={handleLogout} />;
  }

  if (showEmailTest) {
    return (
      <div>
        <button 
          onClick={() => setShowEmailTest(false)}
          style={{ margin: '10px', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          ← Back to Login
        </button>
        <EmailTestPage />
      </div>
    );
  }

  if (showForgotPassword) {
    return <ForgotPasswordPage onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  if (showSignup) {
    return <SignupPage onBackToLogin={() => setShowSignup(false)} />;
  }

  return <LoginPage 
    onGoToSignup={() => setShowSignup(true)} 
    onGoToForgotPassword={() => setShowForgotPassword(true)}
    onGoToEmailTest={() => setShowEmailTest(true)}
    onLoginSuccess={handleLoginSuccess} 
  />;
}

function LoginPage({ onGoToSignup, onGoToForgotPassword, onGoToEmailTest, onLoginSuccess }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password })
      });

      const data = await response.json();

      if (data.success) {
        console.log('User data:', data.user);
        onLoginSuccess(data.user);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server. Make sure the backend is running!');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode JWT token to get user info
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

      const response = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleUser)
      });

      const data = await response.json();

      if (data.success) {
        console.log('User data:', data.user);
        onLoginSuccess(data.user);
      } else if (data.needsSignup) {
        alert('No account found with this Google account. Please sign up first.');
        onGoToSignup();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process Google sign-in!');
    }
  };

  const handleGoogleError = () => {
    alert('Google Sign-In failed. Please try again.');
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

      {/* Right side - Login Form */}
      <div className="right-panel">
        <div className="login-container">
          <h1 className="welcome-title">Welcome to RTX Cinema</h1>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Login</label>
              <input
                type="text"
                className="form-input"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
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

            <button type="button" className="forgot-password" onClick={onGoToForgotPassword}>
              Lost Password ? Reset Password
            </button>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="signup-text">
            Don't have an account? <button className="link-button" onClick={onGoToSignup}>Sign Up</button>
          </p>

          <p className="signup-text">
            <button className="link-button" onClick={onGoToEmailTest}>🧪 Test Email System</button>
          </p>

          <div className="google-signin-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="350"
            />
          </div>

          <footer className="footer-text">
            © 2020-2021, PT TIX ID
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}
