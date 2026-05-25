import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './EmailVerificationPage.css';

export default function EmailVerificationPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    // Prevent double API calls in React StrictMode
    if (hasVerified.current) return;
    hasVerified.current = true;
    
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-email/${token}`);
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        
        // Automatically log the user in
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('✅ User logged in:', data.user);
        }
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred during verification. Please try again.');
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        {status === 'verifying' && (
          <>
            <div className="verification-spinner"></div>
            <h2>Verifying Your Email...</h2>
            <p>Please wait while we verify your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="verification-icon success">✓</div>
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <p className="redirect-message">Logging you in...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="verification-icon error">✗</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <button 
              className="back-to-login-btn"
              onClick={() => navigate('/')}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
