import { useState } from "react";
import "./PaymentPage.css";

export default function PaymentPage({ 
  movie, 
  selectedShowtime, 
  selectedCinema, 
  selectedHall, 
  selectedDate, 
  seatData,
  onBack, 
  onPaymentSuccess 
}) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCardPreview, setShowCardPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Show card preview when user starts typing card number
    if (field === 'cardNumber' && value.length > 0) {
      setShowCardPreview(true);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'generic';
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
      
      if (!cardDetails.cardholderName.trim()) {
        newErrors.cardholderName = 'Please enter the cardholder name';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setProcessing(true);
    
    try {
      // Simulate payment processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate booking data
      const bookingData = {
        bookingId: `RTX${Date.now()}`,
        movie: movie,
        cinema: selectedCinema,
        hall: selectedHall,
        date: selectedDate,
        showtime: selectedShowtime,
        seats: seatData.seats,
        seatDetails: seatData.seatDetails,
        total: seatData.total + 25, // Include convenience fee
        paymentMethod: paymentMethod,
        paymentStatus: 'completed',
        bookingTime: new Date().toISOString(),
        user: JSON.parse(localStorage.getItem('user') || '{}'),
        transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };
      
      // Store booking in localStorage (in real app, this would be saved to database)
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));
      
      onPaymentSuccess(bookingData);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const convenienceFee = 25;
  const total = seatData.total + convenienceFee;

  return (
    <div className="payment-page">
      {/* Header */}
      <header className="payment-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Seats
          </button>
          <div className="payment-title">
            <h2>Complete Payment</h2>
            <p>Secure payment for your movie tickets</p>
          </div>
        </div>
        <div className="header-right">
          <div className="security-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Secure Payment
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="payment-main">
        {/* Left Section - Booking Summary */}
        <div className="booking-summary-section">
          <div className="summary-card">
            <h3>Booking Summary</h3>
            
            <div className="movie-summary">
              <img src={movie.image} alt={movie.title} className="summary-movie-poster" />
              <div className="movie-details">
                <h4>{movie.title}</h4>
                <p className="cinema-name">{selectedCinema.name}</p>
                <p className="hall-info">{selectedHall.type} - Hall {selectedHall.name}</p>
                <p className="showtime-info">{selectedDate} • {selectedShowtime.time}</p>
              </div>
            </div>

            <div className="seats-summary">
              <h4>Selected Seats</h4>
              <div className="seat-tags">
                {seatData.seats.map(seat => (
                  <span key={seat} className="seat-tag">
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            <div className="price-summary">
              <div className="price-item">
                <span>Tickets ({seatData.seats.length})</span>
                <span>Rs. {seatData.total - (seatData.seatDetails.filter(s => s.isPremium).length * 100)}</span>
              </div>
              {seatData.seatDetails.filter(s => s.isPremium).length > 0 && (
                <div className="price-item">
                  <span>Premium Surcharge</span>
                  <span>Rs. {seatData.seatDetails.filter(s => s.isPremium).length * 100}</span>
                </div>
              )}
              <div className="price-item">
                <span>Convenience Fee</span>
                <span>Rs. {convenienceFee}</span>
              </div>
              <div className="price-item">
                <span>GST (18%)</span>
                <span>Rs. {Math.round(total * 0.18)}</span>
              </div>
              <div className="price-total">
                <span>Total Amount</span>
                <span>Rs. {Math.round(total * 1.18)}</span>
              </div>
            </div>

            {/* Payment Security Info */}
            <div className="security-info">
              <div className="security-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="security-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>PCI DSS Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Payment Form */}
        <div className="payment-form-section">
          <div className="payment-card">
            <h3>Payment Details</h3>
            
            {/* Payment Method Selection */}
            <div className="payment-methods">
              <div className="method-tabs">
                <button 
                  className={`method-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Credit/Debit Card
                </button>
                <button 
                  className={`method-tab ${paymentMethod === 'esewa' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('esewa')}
                >
                  <span className="wallet-icon">📱</span>
                  eSewa
                </button>
                <button 
                  className={`method-tab ${paymentMethod === 'khalti' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('khalti')}
                >
                  <span className="wallet-icon">💜</span>
                  Khalti
                </button>
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <div className="card-form">
                {/* Card Preview */}
                {showCardPreview && (
                  <div className="card-preview">
                    <div className={`credit-card ${getCardType(cardDetails.cardNumber)}`}>
                      <div className="card-chip"></div>
                      <div className="card-number">
                        {cardDetails.cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="card-info">
                        <div className="card-holder">
                          <span className="label">CARD HOLDER</span>
                          <span className="value">{cardDetails.cardholderName || 'YOUR NAME'}</span>
                        </div>
                        <div className="card-expiry">
                          <span className="label">EXPIRES</span>
                          <span className="value">{cardDetails.expiryDate || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Card Number</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength="19"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    <div className="card-type-icon">
                      {getCardType(cardDetails.cardNumber) === 'visa' && '💳'}
                      {getCardType(cardDetails.cardNumber) === 'mastercard' && '💳'}
                      {getCardType(cardDetails.cardNumber) === 'amex' && '💳'}
                    </div>
                  </div>
                  {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      maxLength="5"
                      className={errors.expiryDate ? 'error' : ''}
                    />
                    {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                      maxLength="4"
                      className={errors.cvv ? 'error' : ''}
                    />
                    {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value.toUpperCase())}
                    className={errors.cardholderName ? 'error' : ''}
                  />
                  {errors.cardholderName && <span className="error-text">{errors.cardholderName}</span>}
                </div>

                <div className="save-card-option">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Save this card for future payments
                  </label>
                </div>
              </div>
            )}

            {/* Digital Wallet Forms */}
            {(paymentMethod === 'esewa' || paymentMethod === 'khalti') && (
              <div className="wallet-form">
                <div className="wallet-info">
                  <div className="wallet-icon-large">
                    {paymentMethod === 'esewa' ? '📱' : '💜'}
                  </div>
                  <div className="wallet-details">
                    <h4>{paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'} Payment</h4>
                    <p>You will be redirected to {paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'} to complete the payment securely</p>
                    <div className="wallet-features">
                      <div className="feature">✓ Instant payment confirmation</div>
                      <div className="feature">✓ No additional charges</div>
                      <div className="feature">✓ Secure transaction</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <button 
              className="pay-button"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="spinner"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Pay Rs. {Math.round(total * 1.18)}
                </>
              )}
            </button>

            <div className="payment-security">
              <p>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}