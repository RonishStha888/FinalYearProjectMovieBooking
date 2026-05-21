import { useState, useEffect } from "react";
import "./PaymentPage.css";
import KhaltiSandboxPage from "./KhaltiSandboxPage";
import EsewaSandboxPage from "./EsewaSandboxPage";
import khaltiLogo from "../assets/khalti.png";
import esewaLogo from "../assets/esewa.png";

export default function PaymentPage({ 
  movie, 
  selectedShowtime, 
  selectedCinema, 
  selectedHall, 
  selectedDate, 
  seatData,
  fbData,
  holdExpiresAt,
  onBack, 
  onPaymentSuccess 
}) {
  const [paymentMethod, setPaymentMethod] = useState('khalti');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showKhaltiSandbox, setShowKhaltiSandbox] = useState(false);
  const [showEsewaSandbox, setShowEsewaSandbox] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);

  // Derived totals
  const ticketTotal = seatData?.total || 0;
  const fbTotal = fbData?.finalTotal || 0;
  const total = Math.max(0, ticketTotal + fbTotal - loyaltyDiscount);

  // Fetch user loyalty points
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?._id || user?.id;
    if (!userId) return;
    fetch(`http://localhost:5000/api/loyalty/user/${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setLoyaltyPoints(data.loyaltyPoints?.available || 0);
      })
      .catch(() => {});
  }, []);

  const handleRedeemChange = (pts) => {
    const clamped = Math.min(Math.max(0, pts), Math.min(100, loyaltyPoints));
    setPointsToRedeem(clamped);
    setLoyaltyDiscount(clamped * 5);
  };

  // Timer countdown
  useEffect(() => {
    if (!holdExpiresAt) return;
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((holdExpiresAt - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining === 0) {
        alert('Your seat hold has expired. Please select seats again.');
        onBack();
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt, onBack]);

  // Handle Khalti return (after redirect back from Khalti)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pidx = urlParams.get('pidx');
    const status = urlParams.get('status');

    if (pidx && status === 'Completed') {
      verifyKhaltiPayment(pidx);
    }
  }, []);

  const verifyKhaltiPayment = async (pidx) => {
    try {
      setProcessing(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const pendingBooking = JSON.parse(sessionStorage.getItem('pendingBooking') || '{}');

      const response = await fetch('http://localhost:5000/api/payment/khalti/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pidx, bookingData: pendingBooking })
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.removeItem('pendingBooking');
        onPaymentSuccess({
          ...pendingBooking,
          bookingId: data.booking._id,
          bookingReference: data.bookingReference,
          transactionId: pidx,
          paymentMethod: 'khalti',
          paymentStatus: 'completed',
          bookingTime: new Date().toISOString(),
          movie, cinema: selectedCinema, hall: selectedHall,
          date: selectedDate, showtime: selectedShowtime
        });
      } else {
        alert('Payment verification failed. Please contact support.');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Khalti verify error:', error);
      alert('Error verifying payment.');
      setProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (field === 'cardNumber' && value.length > 0) setShowCardPreview(true);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) parts.push(match.substring(i, i + 4));
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    return v.length >= 2 ? v.substring(0, 2) + '/' + v.substring(2, 4) : v;
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
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16)
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5)
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    if (!cardDetails.cvv || cardDetails.cvv.length < 3)
      newErrors.cvv = 'Please enter a valid CVV';
    if (!cardDetails.cardholderName.trim())
      newErrors.cardholderName = 'Please enter the cardholder name';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKhaltiSandboxSuccess = (pidx) => {
    setShowKhaltiSandbox(false);
    completeSandboxBooking(pidx);
  };

  const handleEsewaSandboxSuccess = (txnId) => {
    setShowEsewaSandbox(false);
    completeSandboxBooking(txnId);
  };

  const completeSandboxBooking = async (transactionId) => {
    const bookingReference = `RTX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?._id || user?.id;

    // Mark seats as permanently booked
    try {
      const showtimeId = selectedShowtime?._id || `showtime_${selectedCinema?._id}_${selectedDate}_${selectedShowtime?.time}`;
      await fetch('http://localhost:5000/api/seat-hold/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'guest',
          sessionId: `session_${Date.now()}`,
          showtimeId,
          seats: seatData.seats
        })
      });
      console.log('✅ Seats permanently booked');
    } catch (e) {
      console.error('Seat booking error:', e);
    }

    // Redeem points if selected
    if (userId && pointsToRedeem > 0) {
      try {
        await fetch('http://localhost:5000/api/loyalty/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, points: pointsToRedeem, bookingReference })
        });
      } catch (e) { console.log('Points redeem failed (non-critical)', e); }
    }

    // Award points for ticket purchase
    if (userId && ticketTotal > 0) {
      try {
        await fetch('http://localhost:5000/api/loyalty/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            bookingData: {
              ticketAmount: ticketTotal,
              bookingReference,
              bookingId: `sandbox-${Date.now()}`,
              bookingDate: new Date().toISOString()
            }
          })
        });
      } catch (e) { console.log('Points award failed (non-critical)', e); }
    }

    // Store earned points for loyalty page banner
    const earnedPts = Math.floor(ticketTotal / 100);
    if (earnedPts > 0) sessionStorage.setItem('lastEarnedPoints', String(earnedPts));

    onPaymentSuccess({
      bookingId: `sandbox-${Date.now()}`,
      bookingReference,
      transactionId,
      paymentMethod,
      paymentStatus: 'completed',
      bookingTime: new Date().toISOString(),
      movie, cinema: selectedCinema, hall: selectedHall,
      date: selectedDate, showtime: selectedShowtime,
      seats: seatData.seats, seatDetails: seatData.seatDetails,
      ticketTotal, fbItems: fbData?.items || [],
      fbSubtotal: fbData?.subtotal || 0,
      fbDiscount: fbData?.totalDiscount || 0,
      fbTotal,
      loyaltyDiscount,
      pointsRedeemed: pointsToRedeem,
      pointsEarned: Math.floor(ticketTotal / 100),
      total, user
    });
  };

  const handlePayment = async () => {
    if (paymentMethod === 'khalti') {
      setShowKhaltiSandbox(true);
    } else if (paymentMethod === 'esewa') {
      setShowEsewaSandbox(true);
    } else {
      if (paymentMethod === 'card' && !validateForm()) return;
      setProcessing(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const bookingReference = `RTX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = storedUser?._id || storedUser?.id;

        // Mark seats as permanently booked
        try {
          const showtimeId = selectedShowtime?._id || `showtime_${selectedCinema?._id}_${selectedDate}_${selectedShowtime?.time}`;
          await fetch('http://localhost:5000/api/seat-hold/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userId || 'guest',
              sessionId: `session_${Date.now()}`,
              showtimeId,
              seats: seatData.seats
            })
          });
          console.log('✅ Seats permanently booked');
        } catch (e) {
          console.error('Seat booking error:', e);
        }

        // Redeem points if selected
        if (userId && pointsToRedeem > 0) {
          try {
            await fetch('http://localhost:5000/api/loyalty/redeem', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, points: pointsToRedeem, bookingReference })
            });
          } catch (e) { console.log('Points redeem failed', e); }
        }

        // Award points
        if (userId && ticketTotal > 0) {
          try {
            await fetch('http://localhost:5000/api/loyalty/award', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                bookingData: {
                  ticketAmount: ticketTotal,
                  bookingReference,
                  bookingId: `RTX${Date.now()}`,
                  bookingDate: new Date().toISOString()
                }
              })
            });
          } catch (e) { console.log('Points award failed', e); }
        }

        // Store earned points for loyalty page banner
        const earnedPts = Math.floor(ticketTotal / 100);
        if (earnedPts > 0) sessionStorage.setItem('lastEarnedPoints', String(earnedPts));

        const bookingData = {
          bookingId: `RTX${Date.now()}`,
          bookingReference,
          movie, cinema: selectedCinema, hall: selectedHall,
          date: selectedDate, showtime: selectedShowtime,
          seats: seatData.seats, seatDetails: seatData.seatDetails,
          ticketTotal, fbItems: fbData?.items || [],
          fbSubtotal: fbData?.subtotal || 0,
          fbDiscount: fbData?.totalDiscount || 0,
          fbTotal, loyaltyDiscount, pointsRedeemed: pointsToRedeem,
          pointsEarned: Math.floor(ticketTotal / 100),
          total,
          paymentMethod, paymentStatus: 'completed',
          bookingTime: new Date().toISOString(),
          user: storedUser,
          transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };
        onPaymentSuccess(bookingData);
      } catch (error) {
        alert('Payment failed. Please try again.');
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <div className="payment-page">
      {/* Khalti Sandbox Modal */}
      {showKhaltiSandbox && (
        <KhaltiSandboxPage
          amount={total * 100}
          orderName={`${movie.title} - ${seatData.seats.length} Ticket(s)`}
          onSuccess={handleKhaltiSandboxSuccess}
          onCancel={() => setShowKhaltiSandbox(false)}
        />
      )}
      {/* eSewa Sandbox Modal */}
      {showEsewaSandbox && (
        <EsewaSandboxPage
          amount={total}
          orderName={`${movie.title} - ${seatData.seats.length} Ticket(s)`}
          onSuccess={handleEsewaSandboxSuccess}
          onCancel={() => setShowEsewaSandbox(false)}
        />
      )}
      {/* Internet Banking Sandbox Modal - removed */}
      {/* Header */}
      <header className="payment-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Selection
          </button>
          <div className="payment-title">
            <h2>Secure Checkout</h2>
            <p>Complete your booking with confidence</p>
          </div>
        </div>
        <div className="header-right">
          {holdExpiresAt && timeRemaining > 0 && (
            <div className={`timer-display ${timeRemaining <= 60 ? 'warning' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Seats Reserved: {formatTime(timeRemaining)}</span>
            </div>
          )}
          <div className="security-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Secure Checkout
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
                  <span key={seat} className="seat-tag">{seat}</span>
                ))}
              </div>
            </div>

            <div className="price-summary">
              <div className="price-section">
                <h4 className="price-section-title">Tickets</h4>
                <div className="price-item">
                  <span>Tickets ({seatData.seats.length})</span>
                  <span>Rs. {seatData.seats.length * (seatData.ticketPrice || selectedShowtime?.price || 500)}</span>
                </div>
                {seatData.seatDetails.filter(s => s.isPremium).length > 0 && (
                  <div className="price-item">
                    <span>Premium Surcharge</span>
                    <span>Rs. {seatData.seatDetails.filter(s => s.isPremium).length * 100}</span>
                  </div>
                )}
                <div className="price-subtotal">
                  <span>Ticket Subtotal</span>
                  <span>Rs. {ticketTotal}</span>
                </div>
              </div>

              {fbData && fbData.items && fbData.items.length > 0 && (
                <div className="price-section fb-section">
                  <h4 className="price-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 2L7 6H3L5 20H19L21 6H17L15 2H9Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Food & Beverages
                  </h4>
                  {fbData.items.map((item, index) => (
                    <div key={index} className="price-item fb-item">
                      <span>{item.item.name} {item.selectedSize && `(${item.selectedSize})`} × {item.quantity}</span>
                      <span>Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                  {fbData.totalDiscount > 0 && (
                    <div className="price-item discount">
                      <span>F&B Discount</span>
                      <span>- Rs. {fbData.totalDiscount}</span>
                    </div>
                  )}
                  <div className="price-subtotal">
                    <span>F&B Subtotal</span>
                    <span>Rs. {fbTotal}</span>
                  </div>
                </div>
              )}

              <div className="price-total">
                <span>Subtotal</span>
                <span>Rs. {ticketTotal + fbTotal}</span>
              </div>
              {loyaltyDiscount > 0 && (
                <div className="price-item discount">
                  <span>Loyalty Discount ({pointsToRedeem} pts)</span>
                  <span>- Rs. {loyaltyDiscount}</span>
                </div>
              )}
              <div className="price-total" style={loyaltyDiscount > 0 ? {color: '#4caf50'} : {}}>
                <span>Total Amount</span>
                <span>Rs. {total}</span>
              </div>
            </div>

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
            <h3>Payment Method</h3>
            
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
                  eSewa
                </button>
                <button 
                  className={`method-tab ${paymentMethod === 'khalti' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('khalti')}
                >
                  Khalti
                </button>
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <div className="card-form">
                {showCardPreview && (
                  <div className="card-preview">
                    <div className={`credit-card ${getCardType(cardDetails.cardNumber)}`}>
                      <div className="card-chip"></div>
                      <div className="card-number">{cardDetails.cardNumber || '•••• •••• •••• ••••'}</div>
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
              </div>
            )}

            {/* Digital Wallet Info */}
            {(paymentMethod === 'esewa' || paymentMethod === 'khalti') && (
              <div className="wallet-form">
                <div className="wallet-info">
                  <div className="wallet-icon-large">
                    <img 
                      src={paymentMethod === 'esewa' ? esewaLogo : khaltiLogo} 
                      alt={paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'} 
                      style={{ width: '120px', height: 'auto', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="wallet-details">
                    <h4>{paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'} Digital Wallet</h4>
                    <p>You will be redirected to a secure payment gateway to complete your transaction.</p>
                    <div className="wallet-features">
                      {paymentMethod === 'khalti' && (
                        <div className="feature">Test Credentials: Mobile <strong>9800000000</strong> | MPIN <strong>1111</strong> | OTP <strong>987654</strong></div>
                      )}
                      {paymentMethod === 'esewa' && (
                        <div className="feature">Test Credentials: ID <strong>9800000001</strong> | Password <strong>Nepal@123</strong> | OTP <strong>123456</strong></div>
                      )}
                      <div className="feature">Instant confirmation & e-ticket delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loyalty Points Redemption */}
            <div className="loyalty-redeem-section">
              <div className="loyalty-redeem-header">
                <div className="loyalty-redeem-icon">🎁</div>
                <div>
                  <h4>Redeem Loyalty Rewards</h4>
                  <p>Available balance: <strong>{loyaltyPoints} points</strong></p>
                  <p style={{fontSize: '12px', color: '#888', marginTop: '4px'}}>Order total: Rs. {ticketTotal + fbTotal}</p>
                </div>
              </div>
              <div className="loyalty-input-group">
                <label>Points to redeem (1 point = Rs. 5 discount)</label>
                <div className="loyalty-input-wrapper">
                  <input
                    type="number"
                    min="0"
                    max={Math.min(100, loyaltyPoints)}
                    value={pointsToRedeem}
                    onChange={(e) => handleRedeemChange(parseInt(e.target.value) || 0)}
                    placeholder="Enter points (20-100)"
                    className="loyalty-input"
                  />
                  <button
                    className="apply-loyalty-btn"
                    onClick={() => handleRedeemChange(pointsToRedeem)}
                    disabled={pointsToRedeem < 20 || pointsToRedeem > Math.min(100, loyaltyPoints)}
                  >
                    Apply
                  </button>
                </div>
                <p className="loyalty-hint">Redeem between 20-100 points per transaction</p>
              </div>
              <div className="loyalty-redeem-options">
                <p style={{fontSize: '13px', color: '#aaa', marginBottom: '8px'}}>Quick select:</p>
                {[20, 40, 60, 80, 100].filter(p => p <= loyaltyPoints).map(pts => (
                  <button
                    key={pts}
                    className={`redeem-opt-btn ${pointsToRedeem === pts ? 'active' : ''}`}
                    onClick={() => handleRedeemChange(pts)}
                  >
                    {pts} pts = Rs.{pts * 5} off
                  </button>
                ))}
              </div>
              {loyaltyDiscount > 0 && (
                <div className="loyalty-discount-applied">
                  ✓ Discount applied: Rs. {loyaltyDiscount} ({pointsToRedeem} points redeemed)
                </div>
              )}
            </div>

            {/* Payment Button */}
            <button 
              className="pay-button"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="spinner"></div>
                  {paymentMethod === 'khalti' ? 'Redirecting to Khalti...' : 'Processing Payment...'}
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {paymentMethod === 'khalti' ? `Proceed to Pay Rs. ${total}` : paymentMethod === 'esewa' ? `Proceed to Pay Rs. ${total}` : `Complete Payment - Rs. ${total}`}
                </>
              )}
            </button>

            <div className="payment-security">
              <p>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Your payment is protected with industry-standard encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
