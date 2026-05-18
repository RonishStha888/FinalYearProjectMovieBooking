import { useState } from 'react';
import './ParkingDiscountOffer.css';

export default function ParkingDiscountOffer({ bookingId, userId, onClaim, onDismiss }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClaimCoupon = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/parking/claim-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingId, userId })
      });

      const data = await response.json();

      if (data.success && data.coupon) {
        onClaim(data.coupon);
      } else {
        setError(data.error || 'Failed to claim coupon. Please try again.');
      }
    } catch (err) {
      console.error('Error claiming coupon:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    onDismiss();
  };

  return (
    <div className="parking-discount-offer">
      <div className="parking-offer-card">
        <div className="parking-offer-icon">🚗</div>
        <h3 className="parking-offer-heading">Did you drive here?</h3>
        <p className="parking-offer-subtext">Get up to 50% off at our parking facility</p>
        
        {error && (
          <div className="parking-offer-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="parking-offer-actions">
          <button 
            className="parking-offer-btn parking-offer-btn-primary"
            onClick={handleClaimCoupon}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="parking-spinner"></div>
                <span>Getting Your Discount...</span>
              </>
            ) : (
              'Yes, Get My Discount'
            )}
          </button>
          <button 
            className="parking-offer-btn parking-offer-btn-secondary"
            onClick={handleDismiss}
            disabled={isLoading}
          >
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
}
