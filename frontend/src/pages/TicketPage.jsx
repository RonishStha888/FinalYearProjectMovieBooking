import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import "./TicketPage.css";
import ParkingDiscountOffer from "../components/ParkingDiscountOffer";
import ParkingCoupon from "../components/ParkingCoupon";
import logo from "../assets/logo.png";

export default function TicketPage({ bookingData, onBackToHome }) {
  const [showDownload, setShowDownload] = useState(false);
  const [parkingCouponStatus, setParkingCouponStatus] = useState('offered'); // 'offered', 'claimed', 'dismissed'
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    // Show download option after a short delay
    const timer = setTimeout(() => setShowDownload(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Generate QR Code
    if (qrCanvasRef.current) {
      const qrData = JSON.stringify({
        bookingId: bookingData.bookingId,
        transactionId: bookingData.transactionId,
        movie: bookingData.movie.title,
        cinema: bookingData.cinema.name,
        date: bookingData.date,
        time: bookingData.showtime.time,
        seats: bookingData.seats,
        total: bookingData.total,
        verificationCode: bookingData.bookingId.slice(-6).toUpperCase()
      });

      QRCode.toCanvas(qrCanvasRef.current, qrData, {
        width: 120,
        margin: 1,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [bookingData]);

  const handleCouponClaim = (couponData) => {
    setClaimedCoupon(couponData);
    setParkingCouponStatus('claimed');
  };

  const handleCouponDismiss = () => {
    setParkingCouponStatus('dismissed');
  };

  const handleDownloadTicket = () => {
    // Create professional PDF-style ticket content
    const ticketData = {
      ...bookingData,
      qrCode: `RTX-${bookingData.bookingId}`,
      downloadTime: new Date().toISOString(),
      verificationCode: bookingData.bookingId.slice(-6).toUpperCase()
    };
    
    // Create a professional ticket content
    const ticketContent = `
═══════════════════════════════════════════════════════════════
                        RTX CINEMA
                   PREMIUM MOVIE EXPERIENCE
═══════════════════════════════════════════════════════════════

🎬 DIGITAL MOVIE TICKET 🎬

Booking ID: ${bookingData.bookingId}
Transaction ID: ${bookingData.transactionId}
Verification Code: ${ticketData.verificationCode}

───────────────────────────────────────────────────────────────
MOVIE DETAILS
───────────────────────────────────────────────────────────────
Movie: ${bookingData.movie.title}
Genre: ${bookingData.movie.genre}
Rating: ⭐ ${bookingData.movie.rating}/10
Duration: ${bookingData.movie.duration} minutes

───────────────────────────────────────────────────────────────
VENUE & TIMING
───────────────────────────────────────────────────────────────
Cinema: ${bookingData.cinema.name}
Hall: ${bookingData.hall.type} - ${bookingData.hall.name}
Date: ${formatDate(bookingData.date)}
Time: ${formatTime(bookingData.showtime.time)}

───────────────────────────────────────────────────────────────
SEAT INFORMATION
───────────────────────────────────────────────────────────────
Selected Seats: ${bookingData.seats.join(', ')}
Number of Tickets: ${bookingData.seats.length}

───────────────────────────────────────────────────────────────
PAYMENT DETAILS
───────────────────────────────────────────────────────────────
Ticket Amount: Rs. ${bookingData.ticketTotal || bookingData.total}
${bookingData.fbItems && bookingData.fbItems.length > 0 ? `
Food & Beverages:
${bookingData.fbItems.map(item => 
  `  • ${item.item.name}${item.selectedSize ? ` (${item.selectedSize})` : ''} × ${item.quantity} - Rs. ${item.price * item.quantity}`
).join('\n')}
${bookingData.fbDiscount > 0 ? `  F&B Discount: - Rs. ${bookingData.fbDiscount}` : ''}
  F&B Total: Rs. ${bookingData.fbTotal}

⚠️ IMPORTANT: Collect your F&B items at the counter before the show
` : ''}
Total Amount Paid: Rs. ${bookingData.total}
Payment Method: ${bookingData.paymentMethod.toUpperCase()}
Payment Status: ✅ CONFIRMED
Booking Time: ${new Date(bookingData.bookingTime).toLocaleString()}

───────────────────────────────────────────────────────────────
QR CODE & BARCODE
───────────────────────────────────────────────────────────────
QR Code: ${ticketData.qrCode}
Barcode: ${bookingData.transactionId}

───────────────────────────────────────────────────────────────
IMPORTANT INFORMATION
───────────────────────────────────────────────────────────────
• Please arrive 15 minutes before showtime
• Show this ticket and valid ID at the entrance
• This ticket is non-refundable and non-transferable
• Outside food and beverages are not allowed
• Mobile phones must be switched off during the show
• Photography and recording are strictly prohibited

───────────────────────────────────────────────────────────────
CONTACT INFORMATION
───────────────────────────────────────────────────────────────
RTX Cinema Customer Service
📞 Phone: +977-1-4444444
📧 Email: support@rtxcinema.com
🌐 Website: www.rtxcinema.com

═══════════════════════════════════════════════════════════════
Thank you for choosing RTX Cinema!
Enjoy your movie experience!
═══════════════════════════════════════════════════════════════

Generated on: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RTX-Cinema-Ticket-${bookingData.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert('🎫 Professional ticket downloaded successfully!');
  };

  const handleEmailTicket = () => {
    const emailSubject = `RTX Cinema Ticket - ${bookingData.movie.title}`;
    const emailBody = `
Booking Confirmation - RTX Cinema

Booking ID: ${bookingData.bookingId}
Movie: ${bookingData.movie.title}
Cinema: ${bookingData.cinema.name}
Date: ${formatDate(bookingData.date)}
Time: ${formatTime(bookingData.showtime.time)}
Seats: ${bookingData.seats.join(', ')}

Total Amount: Rs. ${bookingData.total}

Please show this email and a valid ID at the cinema entrance.

Thank you for choosing RTX Cinema!
    `.trim();

    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const handleShareTicket = () => {
    const shareText = `🎬 Just booked tickets for "${bookingData.movie.title}" at RTX Cinema! 
📅 ${formatDate(bookingData.date)} at ${formatTime(bookingData.showtime.time)}
🎭 ${bookingData.cinema.name} - ${bookingData.hall.type}
💺 Seats: ${bookingData.seats.join(', ')}

#RTXCinema #MovieNight #${bookingData.movie.title.replace(/\s+/g, '')}`;

    if (navigator.share) {
      // Use native sharing if available
      navigator.share({
        title: `RTX Cinema Ticket - ${bookingData.movie.title}`,
        text: shareText,
        url: window.location.origin
      }).then(() => {
        console.log('Ticket shared successfully');
      }).catch((error) => {
        console.log('Error sharing:', error);
        fallbackShare(shareText);
      });
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (text) => {
    // Fallback sharing options
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('🎬 Ticket details copied to clipboard! You can now share it on social media.');
      });
    } else {
      // Create a temporary textarea for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('🎬 Ticket details copied to clipboard! You can now share it on social media.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <div className="ticket-page">
      {/* Header */}
      <header className="ticket-header">
        <div className="header-content">
          <div className="success-icon"></div>
          <div className="success-message">
            <h1>Booking Confirmed!</h1>
            <p>Your tickets have been successfully booked</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="ticket-main">
        <div className="ticket-container">
          {/* Ticket */}
          <div className="ticket">
            <div className="ticket-header-section">
              <div className="cinema-logo">
                <img src={logo} alt="RTX Cinema Logo" style={{ width: '100px', height: 'auto', objectFit: 'contain' }} />
              </div>
              <div className="booking-id">
                <span>Booking ID</span>
                <strong>{bookingData.bookingId}</strong>
              </div>
            </div>

            <div className="ticket-divider">
              <div className="perforation"></div>
            </div>

            <div className="ticket-body">
              <div className="movie-section">
                <div className="movie-poster-small">
                  <img src={bookingData.movie.image} alt={bookingData.movie.title} />
                </div>
                <div className="movie-info">
                  <h3>{bookingData.movie.title}</h3>
                  <div className="movie-meta">
                    <span className="genre">{bookingData.movie.genre}</span>
                    <span className="rating">{bookingData.movie.rating}/10</span>
                  </div>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">Cinema</span>
                    <span className="value">{bookingData.cinema.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Hall</span>
                    <span className="value">{bookingData.hall.type}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">Date</span>
                    <span className="value">{formatDate(bookingData.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Time</span>
                    <span className="value">{formatTime(bookingData.showtime.time)}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">Seats</span>
                    <span className="value seats-list">
                      {bookingData.seats.map(seat => (
                        <span key={seat} className="seat-badge">{seat}</span>
                      ))}
                    </span>
                  </div>
                </div>

                <div className="detail-row total-row">
                  <div className="detail-item">
                    <span className="label">Ticket Amount</span>
                    <span className="value total-amount">Rs. {bookingData.ticketTotal || bookingData.total}</span>
                  </div>
                </div>

                {bookingData.fbItems && bookingData.fbItems.length > 0 && (
                  <div className="fb-details-section">
                    <h4 className="fb-section-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 2L7 6H3L5 20H19L21 6H17L15 2H9Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Food & Beverages
                    </h4>
                    <div className="fb-items-list">
                      {bookingData.fbItems.map((item, index) => (
                        <div key={index} className="fb-item-row">
                          <span className="fb-item-name">
                            {item.item.name} {item.selectedSize && `(${item.selectedSize})`}
                          </span>
                          <span className="fb-item-qty">× {item.quantity}</span>
                          <span className="fb-item-price">Rs. {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    {bookingData.fbDiscount > 0 && (
                      <div className="fb-discount-row">
                        <span>F&B Discount</span>
                        <span className="discount-amount">- Rs. {bookingData.fbDiscount}</span>
                      </div>
                    )}
                    <div className="fb-total-row">
                      <span className="label">F&B Total</span>
                      <span className="value">Rs. {bookingData.fbTotal}</span>
                    </div>
                    <div className="fb-collection-note">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>Collect your F&B items at the counter before the show</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="booking-details">
                <div className="detail-row final-total-row">
                  <div className="detail-item">
                    <span className="label">Total Paid</span>
                    <span className="value total-amount">Rs. {bookingData.total}</span>
                  </div>
                </div>

                {(bookingData.pointsRedeemed > 0 || bookingData.pointsEarned > 0) && (
                  <div className="detail-row loyalty-row">
                    {bookingData.pointsRedeemed > 0 && (
                      <div className="detail-item">
                        <span className="label">Points Redeemed</span>
                        <span className="value" style={{color:'#e50914'}}>-{bookingData.pointsRedeemed} pts (Rs. {bookingData.loyaltyDiscount} off)</span>
                      </div>
                    )}
                    {bookingData.pointsEarned > 0 && (
                      <div className="detail-item">
                        <span className="label">Points Earned</span>
                        <span className="value" style={{color:'#4caf50'}}>+{bookingData.pointsEarned} pts added to your account</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="qr-section">
                <div className="qr-code">
                  <canvas ref={qrCanvasRef} className="qr-canvas"></canvas>
                </div>
                <div className="qr-info">
                  <p className="qr-title">Scan at Cinema Entrance</p>
                  <small>Booking Time: {new Date(bookingData.bookingTime).toLocaleString()}</small>
                  <div className="verification-code">
                    <span>Code: {bookingData.bookingId.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Professional Barcode */}
              <div className="barcode-section">
                <div className="barcode">
                  <div className="barcode-lines">
                    {Array.from({length: 50}, (_, i) => (
                      <div 
                        key={i} 
                        className="barcode-line" 
                        style={{
                          width: Math.random() > 0.5 ? '2px' : '1px',
                          height: '40px',
                          backgroundColor: '#333'
                        }}
                      />
                    ))}
                  </div>
                  <p className="barcode-number">{bookingData.transactionId}</p>
                </div>
              </div>
            </div>

            <div className="ticket-footer">
              <div className="terms">
                <p>• Please arrive 15 minutes before showtime</p>
                <p>• This ticket is non-refundable and non-transferable</p>
                <p>• Outside food and beverages are not allowed</p>
              </div>
            </div>
          </div>

          {/* Parking Discount Offer/Coupon */}
          {parkingCouponStatus === 'offered' && (
            <ParkingDiscountOffer
              bookingId={bookingData.bookingId}
              userId={bookingData.userId || bookingData.user?._id}
              onClaim={handleCouponClaim}
              onDismiss={handleCouponDismiss}
            />
          )}

          {parkingCouponStatus === 'claimed' && claimedCoupon && (
            <ParkingCoupon
              code={claimedCoupon.code}
              discountPercent={claimedCoupon.discountPercent}
              expiresAt={claimedCoupon.expiresAt}
            />
          )}

          {/* Action Buttons */}
          {showDownload && (
            <div className="ticket-actions">
              <button className="action-button download-btn" onClick={handleDownloadTicket}>
                Download Ticket
              </button>
              <button className="action-button email-btn" onClick={handleEmailTicket}>
                Email Ticket
              </button>
              <button className="action-button share-btn" onClick={handleShareTicket}>
                Share
              </button>
            </div>
          )}

          <div className="navigation-actions">
            <button className="back-home-btn" onClick={onBackToHome}>
              Back to Home
            </button>
            <button className="view-bookings-btn">
              View All Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      <div className="success-animation">
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
      </div>
    </div>
  );
}