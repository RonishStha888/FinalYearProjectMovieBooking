import { useState } from "react";
import "./PaymentConfirmation.css";

export default function PaymentConfirmation({ 
  bookingData, 
  onConfirmPayment, 
  onBack 
}) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    esewa: "",
    khalti: ""
  });

  const handleInputChange = (e) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value
    });
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

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentForm({
      ...paymentForm,
      cardNumber: formatted
    });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setPaymentForm({
      ...paymentForm,
      expiryDate: value
    });
  };

  const calculateSubtotal = () => {
    const basePrice = bookingData.seatDetails.length * (bookingData.basePrice || 500);
    const premiumSurcharge = bookingData.seatDetails.filter(seat => seat.isPremium).length * 100;
    return basePrice + premiumSurcharge;
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.13); // 13% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + 25; // +25 convenience fee
  };

  const handleConfirmPayment = async () => {
    if (processing) return;

    // Basic validation
    if (paymentMethod === "card") {
      if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.cardholderName) {
        alert("Please fill in all card details");
        return;
      }
    } else if (paymentMethod === "esewa" && !paymentForm.esewa) {
      alert("Please enter your eSewa ID");
      return;
    } else if (paymentMethod === "khalti" && !paymentForm.khalti) {
      alert("Please enter your Khalti number");
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate booking confirmation
      const bookingConfirmation = {
        bookingId: `RTX${Date.now()}`,
        paymentMethod: paymentMethod,
        paymentStatus: "completed",
        transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        bookedAt: new Date(),
        total: calculateTotal()
      };

      onConfirmPayment({
        ...bookingData,
        ...bookingConfirmation
      });
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-confirmation-page">
      <div className="payment-container">
        {/* Header */}
        <header className="payment-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Seats
          </button>
          <h1>Confirm Payment</h1>
        </header>

        <div className="payment-content">
          {/* Left Side - Booking Details */}
          <div className="booking-details">
            <h2>Booking Details</h2>
            
            <div className="detail-section">
              <h3>Movie</h3>
              <p className="movie-title">{bookingData.movie?.title}</p>
            </div>

            <div className="detail-section">
              <h3>Cinema & Hall</h3>
              <p>{bookingData.cinema?.name}</p>
              <p className="hall-type">{bookingData.hall?.type}</p>
            </div>

            <div className="detail-section">
              <h3>Date & Time</h3>
              <p>{bookingData.date}</p>
              <p className="showtime">{bookingData.time}</p>
            </div>

            <div className="detail-section">
              <h3>Selected Seats</h3>
              <div className="seat-tags">
                {bookingData.seats?.map(seat => (
                  <span key={seat} className={`seat-tag ${bookingData.seatDetails?.find(s => s.id === seat)?.isPremium ? 'premium' : ''}`}>
                    {seat}
                    {bookingData.seatDetails?.find(s => s.id === seat)?.isPremium && <span className="premium-badge">Premium</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Payment */}
          <div className="payment-section">
            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-item">
                <span>Tickets ({bookingData.seats?.length})</span>
                <span>Rs. {calculateSubtotal()}</span>
              </div>
              
              <div className="summary-item">
                <span>Tax (13%)</span>
                <span>Rs. {calculateTax()}</span>
              </div>
              
              <div className="summary-item">
                <span>Convenience Fee</span>
                <span>Rs. 25</span>
              </div>
              
              <div className="summary-total">
                <span>Total</span>
                <span>Rs. {calculateTotal()}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <h3>Payment Method</h3>
              
              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-icon">💳</span>
                    <span>Credit/Debit Card</span>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'esewa' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="esewa"
                    checked={paymentMethod === 'esewa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-icon">🟢</span>
                    <span>eSewa</span>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'khalti' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="khalti"
                    checked={paymentMethod === 'khalti'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-icon">🟣</span>
                    <span>Khalti</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Form */}
            <div className="payment-form">
              {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={paymentForm.cardholderName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentForm.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentForm.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentForm.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'esewa' && (
                <div className="esewa-form">
                  <div className="form-group">
                    <label>eSewa ID</label>
                    <input
                      type="text"
                      name="esewa"
                      value={paymentForm.esewa}
                      onChange={handleInputChange}
                      placeholder="Enter your eSewa ID"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'khalti' && (
                <div className="khalti-form">
                  <div className="form-group">
                    <label>Khalti Number</label>
                    <input
                      type="text"
                      name="khalti"
                      value={paymentForm.khalti}
                      onChange={handleInputChange}
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Button */}
            <button 
              className="confirm-payment-button"
              onClick={handleConfirmPayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="payment-spinner"></div>
                  Processing Payment...
                </>
              ) : (
                `Pay Rs. ${calculateTotal()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}