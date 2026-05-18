import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './ParkingCoupon.css';

export default function ParkingCoupon({ code, discountPercent, expiresAt }) {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopyCode = async () => {
    try {
      // Try using the Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        setIsCopied(true);
        setCopyError(false);
        
        // Reset the copied state after 3 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      } else {
        // Fallback for browsers that don't support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          document.execCommand('copy');
          setIsCopied(true);
          setCopyError(false);
          setTimeout(() => {
            setIsCopied(false);
          }, 3000);
        } catch (err) {
          console.error('Fallback copy failed:', err);
          setCopyError(true);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy code:', err);
      setCopyError(true);
      setTimeout(() => {
        setCopyError(false);
      }, 3000);
    }
  };

  return (
    <div className="parking-coupon">
      <div className="parking-coupon-card">
        <div className="parking-coupon-header">
          <div className="parking-coupon-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
            </svg>
            <span>{discountPercent}% OFF</span>
          </div>
          <h3 className="parking-coupon-title">Parking Discount Coupon</h3>
          <p className="parking-coupon-subtitle">Show this at the parking counter</p>
        </div>

        <div className="parking-coupon-body">
          <div className="parking-coupon-qr">
            <div className="qr-code-wrapper">
              <QRCodeSVG 
                value={code} 
                size={140}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          <div className="parking-coupon-code-section">
            <label className="parking-coupon-label">Coupon Code</label>
            <div className="parking-coupon-code">{code}</div>
            
            <button 
              className="parking-copy-btn"
              onClick={handleCopyCode}
            >
              {isCopied ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Copied!</span>
                </>
              ) : copyError ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>Copy Failed</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="parking-coupon-validity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Valid today only — show this at the parking counter</span>
          </div>

          <div className="parking-coupon-hint">
            💡 Tip: Take a screenshot or save this page for easy access
          </div>
        </div>
      </div>
    </div>
  );
}
