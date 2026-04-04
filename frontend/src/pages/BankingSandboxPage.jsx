import { useState } from "react";
import "./BankingSandboxPage.css";

const BANKS = [
  { id: 'nabil', name: 'Nabil Bank', color: '#c0392b', logo: '🏦' },
  { id: 'nic', name: 'NIC Asia Bank', color: '#2980b9', logo: '🏦' },
  { id: 'global', name: 'Global IME Bank', color: '#8e44ad', logo: '🏦' },
  { id: 'himalayan', name: 'Himalayan Bank', color: '#16a085', logo: '🏦' },
  { id: 'sanima', name: 'Sanima Bank', color: '#d35400', logo: '🏦' },
  { id: 'prabhu', name: 'Prabhu Bank', color: '#27ae60', logo: '🏦' },
];

export default function BankingSandboxPage({ amount, orderName, onSuccess, onCancel }) {
  const [step, setStep] = useState('select'); // select | login | otp | processing | success
  const [selectedBank, setSelectedBank] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const TEST_USER = 'testuser';
  const TEST_PASS = 'Test@1234';
  const TEST_OTP = '456789';

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setStep('login');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (username !== TEST_USER || password !== TEST_PASS) {
      setError('Invalid credentials. Use testuser / Test@1234');
      return;
    }
    setStep('otp');
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (otp !== TEST_OTP) {
      setError('Invalid OTP. Use: 456789');
      return;
    }
    setStep('processing');
    await new Promise(r => setTimeout(r, 2500));
    setStep('success');
    setTimeout(() => onSuccess(`BANK-TXN-${Date.now()}`), 1500);
  };

  return (
    <div className="bank-overlay">
      <div className="bank-modal">
        <div className="bank-header" style={{ background: selectedBank ? selectedBank.color : '#1a237e' }}>
          <div className="bank-header-left">
            {selectedBank ? (
              <>
                <span className="bank-header-logo">{selectedBank.logo}</span>
                <div>
                  <div className="bank-header-name">{selectedBank.name}</div>
                  <div className="bank-header-sub">Internet Banking</div>
                </div>
              </>
            ) : (
              <div className="bank-header-name">Internet Banking</div>
            )}
          </div>
          <button className="bank-close" onClick={onCancel}>✕</button>
        </div>

        <div className="bank-amount-bar">
          <div className="bank-amount-info">
            <span className="bank-amount-label">Payment Amount</span>
            <span className="bank-amount-value">Rs. {amount.toLocaleString()}</span>
          </div>
          <div className="bank-order-name">{orderName}</div>
        </div>

        {step === 'select' && (
          <div className="bank-select-section">
            <div className="bank-select-title">Select Your Bank</div>
            <div className="bank-grid">
              {BANKS.map(bank => (
                <button key={bank.id} className="bank-card" onClick={() => handleBankSelect(bank)}
                  style={{ '--bank-color': bank.color }}>
                  <div className="bank-card-icon" style={{ background: bank.color }}>{bank.logo}</div>
                  <span>{bank.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'login' && (
          <form className="bank-form" onSubmit={handleLoginSubmit}>
            <div className="bank-form-title">Sign in to {selectedBank?.name}</div>
            <div className="bank-field">
              <label>Username</label>
              <input type="text" placeholder="Enter username" value={username}
                onChange={e => setUsername(e.target.value)} autoFocus />
              <div className="bank-hint">Test: testuser</div>
            </div>
            <div className="bank-field">
              <label>Password</label>
              <input type="password" placeholder="Enter password" value={password}
                onChange={e => setPassword(e.target.value)} />
              <div className="bank-hint">Test: Test@1234</div>
            </div>
            {error && <div className="bank-error">{error}</div>}
            <button type="submit" className="bank-btn" style={{ background: selectedBank?.color }}>
              Login & Continue
            </button>
            <button type="button" className="bank-btn-back" onClick={() => setStep('select')}>← Choose Different Bank</button>
          </form>
        )}

        {step === 'otp' && (
          <form className="bank-form" onSubmit={handleOtpSubmit}>
            <div className="bank-form-title">Confirm Transaction</div>
            <div className="bank-otp-notice">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={selectedBank?.color || '#1a237e'} strokeWidth="2"/>
              </svg>
              OTP sent to your registered mobile number
            </div>
            <div className="bank-txn-summary">
              <div className="bank-txn-row"><span>Bank</span><span>{selectedBank?.name}</span></div>
              <div className="bank-txn-row"><span>Amount</span><span>Rs. {amount.toLocaleString()}</span></div>
              <div className="bank-txn-row"><span>Merchant</span><span>RTX Cinema</span></div>
              <div className="bank-txn-row"><span>Ref</span><span>RTX-{Date.now().toString().slice(-6)}</span></div>
            </div>
            <div className="bank-field">
              <label>Enter OTP</label>
              <input type="text" placeholder="6-digit OTP" value={otp} maxLength={6}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus
                className="bank-otp-input" />
              <div className="bank-hint">Test OTP: 456789</div>
            </div>
            {error && <div className="bank-error">{error}</div>}
            <button type="submit" className="bank-btn" style={{ background: selectedBank?.color }}>
              Confirm Payment
            </button>
          </form>
        )}

        {step === 'processing' && (
          <div className="bank-processing">
            <div className="bank-spinner" style={{ borderTopColor: selectedBank?.color }}></div>
            <div className="bank-processing-text">Processing Transaction...</div>
            <div className="bank-processing-sub">Communicating with {selectedBank?.name}</div>
            <div className="bank-processing-sub">Please do not press back or refresh</div>
          </div>
        )}

        {step === 'success' && (
          <div className="bank-success">
            <div className="bank-success-icon" style={{ background: selectedBank?.color }}>✓</div>
            <div className="bank-success-title">Transaction Successful!</div>
            <div className="bank-success-amount">Rs. {amount.toLocaleString()}</div>
            <div className="bank-success-details">
              <div className="bank-success-row"><span>Bank</span><span>{selectedBank?.name}</span></div>
              <div className="bank-success-row"><span>Status</span><span style={{color:'#27ae60'}}>✓ Approved</span></div>
              <div className="bank-success-row"><span>Ref No.</span><span>BANK-{Date.now().toString().slice(-8)}</span></div>
            </div>
            <div className="bank-success-sub">Redirecting back to RTX Cinema...</div>
          </div>
        )}

        <div className="bank-footer">
          <span>🔒 Secured by Nepal Clearing House</span>
          <span>ConnectIPS</span>
        </div>
      </div>
    </div>
  );
}
