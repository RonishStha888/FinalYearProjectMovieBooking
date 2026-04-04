import { useState } from "react";
import "./KhaltiSandboxPage.css";

// Simulated Khalti Sandbox Payment Page
export default function KhaltiSandboxPage({ amount, orderName, onSuccess, onCancel }) {
  const [step, setStep] = useState('login'); // login | mpin | otp | processing | success
  const [mobile, setMobile] = useState('');
  const [mpin, setMpin] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const TEST_MOBILE = '9800000000';
  const TEST_MPIN = '1111';
  const TEST_OTP = '987654';

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (mobile !== TEST_MOBILE) {
      setError('Invalid mobile number. Use: 9800000000');
      return;
    }
    setStep('mpin');
  };

  const handleMpinSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (mpin !== TEST_MPIN) {
      setError('Invalid MPIN. Use: 1111');
      return;
    }
    setStep('otp');
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (otp !== TEST_OTP) {
      setError('Invalid OTP. Use: 987654');
      return;
    }
    setLoading(true);
    setStep('processing');
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 2000));
    setStep('success');
    setLoading(false);
    // Auto-complete after showing success
    setTimeout(() => {
      onSuccess(`SANDBOX-PIDX-${Date.now()}`);
    }, 1500);
  };

  return (
    <div className="khalti-sandbox-overlay">
      <div className="khalti-sandbox-modal">
        {/* Khalti Header */}
        <div className="khalti-header">
          <div className="khalti-logo">
            <span className="khalti-purple">💜</span>
            <span className="khalti-brand">khalti</span>
            <span className="khalti-sandbox-badge">SANDBOX</span>
          </div>
          <button className="khalti-close" onClick={onCancel}>✕</button>
        </div>

        {/* Amount Display */}
        <div className="khalti-amount-section">
          <div className="khalti-merchant">{orderName}</div>
          <div className="khalti-amount">Rs. {(amount / 100).toLocaleString()}</div>
          <div className="khalti-amount-label">Total Payable Amount</div>
        </div>

        {/* Steps */}
        {step === 'login' && (
          <form className="khalti-form" onSubmit={handleMobileSubmit}>
            <div className="khalti-step-title">Enter your Khalti ID</div>
            <div className="khalti-input-group">
              <label>Mobile Number</label>
              <div className="khalti-phone-input">
                <span className="khalti-flag">🇳🇵 +977</span>
                <input
                  type="text"
                  placeholder="98XXXXXXXX"
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  autoFocus
                />
              </div>
              <div className="khalti-hint">Test: 9800000000</div>
            </div>
            {error && <div className="khalti-error">{error}</div>}
            <button type="submit" className="khalti-btn">Continue</button>
          </form>
        )}

        {step === 'mpin' && (
          <form className="khalti-form" onSubmit={handleMpinSubmit}>
            <div className="khalti-step-title">Enter your MPIN</div>
            <div className="khalti-input-group">
              <label>MPIN</label>
              <input
                type="password"
                placeholder="Enter MPIN"
                value={mpin}
                onChange={e => setMpin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="khalti-mpin-input"
                autoFocus
              />
              <div className="khalti-hint">Test MPIN: 1111</div>
            </div>
            {error && <div className="khalti-error">{error}</div>}
            <button type="submit" className="khalti-btn">Verify MPIN</button>
            <button type="button" className="khalti-btn-back" onClick={() => setStep('login')}>← Back</button>
          </form>
        )}

        {step === 'otp' && (
          <form className="khalti-form" onSubmit={handleOtpSubmit}>
            <div className="khalti-step-title">Enter OTP</div>
            <div className="khalti-otp-info">
              OTP sent to +977-{TEST_MOBILE}
            </div>
            <div className="khalti-input-group">
              <label>One Time Password</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="khalti-otp-input"
                autoFocus
              />
              <div className="khalti-hint">Test OTP: 987654</div>
            </div>
            {error && <div className="khalti-error">{error}</div>}
            <button type="submit" className="khalti-btn">Confirm Payment</button>
            <button type="button" className="khalti-btn-back" onClick={() => setStep('mpin')}>← Back</button>
          </form>
        )}

        {step === 'processing' && (
          <div className="khalti-processing">
            <div className="khalti-spinner"></div>
            <div className="khalti-processing-text">Processing your payment...</div>
            <div className="khalti-processing-sub">Please do not close this window</div>
          </div>
        )}

        {step === 'success' && (
          <div className="khalti-success">
            <div className="khalti-success-icon">✓</div>
            <div className="khalti-success-title">Payment Successful!</div>
            <div className="khalti-success-amount">Rs. {(amount / 100).toLocaleString()}</div>
            <div className="khalti-success-sub">Redirecting back...</div>
          </div>
        )}

        <div className="khalti-footer">
          <span>🔒 Secured by Khalti</span>
          <span>Sandbox Mode</span>
        </div>
      </div>
    </div>
  );
}
