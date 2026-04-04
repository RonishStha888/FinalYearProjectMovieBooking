import { useState } from "react";
import "./EsewaSandboxPage.css";

export default function EsewaSandboxPage({ amount, orderName, onSuccess, onCancel }) {
  const [step, setStep] = useState('login'); // login | password | otp | processing | success
  const [esewaid, setEsewaid] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const TEST_ID = '9800000001';
  const TEST_PASSWORD = 'Nepal@123';
  const TEST_OTP = '123456';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (esewaid !== TEST_ID) {
      setError('Invalid eSewa ID. Use: 9800000001');
      return;
    }
    setStep('password');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password !== TEST_PASSWORD) {
      setError('Invalid password. Use: Nepal@123');
      return;
    }
    setStep('otp');
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (otp !== TEST_OTP) {
      setError('Invalid OTP. Use: 123456');
      return;
    }
    setStep('processing');
    await new Promise(r => setTimeout(r, 2000));
    setStep('success');
    setTimeout(() => onSuccess(`ESEWA-TXN-${Date.now()}`), 1500);
  };

  const amountRs = typeof amount === 'number' ? (amount > 1000 ? amount : amount) : amount;

  return (
    <div className="esewa-overlay">
      <div className="esewa-modal">
        {/* Header */}
        <div className="esewa-header">
          <div className="esewa-logo">
            <div className="esewa-logo-icon">e</div>
            <span className="esewa-brand">sewa</span>
            <span className="esewa-sandbox-tag">SANDBOX</span>
          </div>
          <button className="esewa-close" onClick={onCancel}>✕</button>
        </div>

        {/* Merchant Info */}
        <div className="esewa-merchant-bar">
          <div className="esewa-merchant-info">
            <span className="esewa-merchant-label">Paying to</span>
            <span className="esewa-merchant-name">RTX Cinema</span>
          </div>
          <div className="esewa-amount-pill">
            Rs. {amountRs.toLocaleString()}
          </div>
        </div>

        {/* Order */}
        <div className="esewa-order-info">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#3d9970" strokeWidth="2"/>
          </svg>
          {orderName}
        </div>

        {/* Steps */}
        {step === 'login' && (
          <form className="esewa-form" onSubmit={handleLoginSubmit}>
            <div className="esewa-step-label">Sign in to eSewa</div>
            <div className="esewa-field">
              <label>eSewa ID (Mobile / Email)</label>
              <input
                type="text"
                placeholder="98XXXXXXXX"
                value={esewaid}
                onChange={e => setEsewaid(e.target.value.trim())}
                autoFocus
              />
              <div className="esewa-hint">Test ID: 9800000001</div>
            </div>
            {error && <div className="esewa-error">{error}</div>}
            <button type="submit" className="esewa-btn">Continue →</button>
            <div className="esewa-divider"><span>New to eSewa?</span></div>
            <button type="button" className="esewa-btn-outline">Create Account</button>
          </form>
        )}

        {step === 'password' && (
          <form className="esewa-form" onSubmit={handlePasswordSubmit}>
            <div className="esewa-step-label">Enter Password</div>
            <div className="esewa-user-chip">
              <div className="esewa-user-avatar">{esewaid[0]}</div>
              <span>{esewaid}</span>
              <button type="button" onClick={() => setStep('login')} className="esewa-change">Change</button>
            </div>
            <div className="esewa-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              <div className="esewa-hint">Test Password: Nepal@123</div>
            </div>
            {error && <div className="esewa-error">{error}</div>}
            <button type="submit" className="esewa-btn">Verify Password</button>
            <button type="button" className="esewa-forgot">Forgot Password?</button>
          </form>
        )}

        {step === 'otp' && (
          <form className="esewa-form" onSubmit={handleOtpSubmit}>
            <div className="esewa-step-label">Verify Payment</div>
            <div className="esewa-otp-sent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" stroke="#3d9970" strokeWidth="2"/>
              </svg>
              OTP sent to +977-{esewaid}
            </div>
            <div className="esewa-field">
              <label>One Time Password (OTP)</label>
              <div className="esewa-otp-boxes">
                {[0,1,2,3,4,5].map(i => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="esewa-otp-box"
                    value={otp[i] || ''}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      const newOtp = otp.split('');
                      newOtp[i] = val;
                      const joined = newOtp.join('').slice(0, 6);
                      setOtp(joined);
                      if (val && i < 5) {
                        const next = e.target.parentElement.children[i + 1];
                        if (next) next.focus();
                      }
                    }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <div className="esewa-hint">Test OTP: 123456</div>
            </div>
            {error && <div className="esewa-error">{error}</div>}
            <div className="esewa-payment-confirm">
              <div className="esewa-confirm-row">
                <span>Amount</span>
                <span>Rs. {amountRs.toLocaleString()}</span>
              </div>
              <div className="esewa-confirm-row">
                <span>Service Charge</span>
                <span>Rs. 0</span>
              </div>
              <div className="esewa-confirm-row total">
                <span>Total</span>
                <span>Rs. {amountRs.toLocaleString()}</span>
              </div>
            </div>
            <button type="submit" className="esewa-btn">Confirm Payment</button>
            <button type="button" className="esewa-btn-back" onClick={() => setStep('password')}>← Back</button>
          </form>
        )}

        {step === 'processing' && (
          <div className="esewa-processing">
            <div className="esewa-spinner"></div>
            <div className="esewa-processing-text">Processing Payment...</div>
            <div className="esewa-processing-sub">Please wait, do not close this window</div>
          </div>
        )}

        {step === 'success' && (
          <div className="esewa-success">
            <div className="esewa-success-ring">
              <div className="esewa-success-icon">✓</div>
            </div>
            <div className="esewa-success-title">Payment Successful!</div>
            <div className="esewa-success-amount">Rs. {amountRs.toLocaleString()}</div>
            <div className="esewa-success-ref">Ref: ESEWA-{Date.now().toString().slice(-8)}</div>
            <div className="esewa-success-sub">Redirecting back to RTX Cinema...</div>
          </div>
        )}

        <div className="esewa-footer">
          <span>🔒 256-bit SSL Secured</span>
          <span style={{color: '#3d9970', fontWeight: 600}}>eSewa</span>
        </div>
      </div>
    </div>
  );
}
