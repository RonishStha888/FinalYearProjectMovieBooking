import { useState, useEffect } from "react";
import "./TicketPage.css";

export default function TicketPage({ bookingData, onBackToHome }) {
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    // Show download option after a short delay
    const timer = setTimeout(() => setShowDownload(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadTicket = () => {
    // In a real app, this would generate a PDF ticket
    const ticketData = {
      ...bookingData,
      qrCode: `RTX-${bookingData.bookingId}`,
      downloadTime: new Date().toISOString()
    };
    
    // Create a downloadable text file (in real app, would be PDF)
    const ticketContent = `
RTX CINEMA - MOVIE TICKET
========================

Booking ID: ${bookingData.bookingId}
Movie: ${bookingData.movie.title}
Cinema: ${bookingData.cinema.name}
Hall: ${bookingData.hall.type} - ${bookingData.hall.name}
Date: ${bookingData.date}
Time: ${bookingData.showtime.time}
Seats: ${bookingData.seats.join(', ')}
Total: Rs. ${bookingData.total}

QR Code: ${ticketData.qrCode}
Booking Time: ${new Date(bookingData.bookingTime).toLocaleString()}

Thank you for choosing RTX Cinema!
    `;
    
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RTX-Ticket-${bookingData.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailTicket = () => {
    // In a real app, this would send email via backend
    alert('Ticket has been sent to your email address!');
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
          <div className="success-icon">✅</div>
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
                <h2>RTX CINEMA</h2>
                <p>Premium Movie Experience</p>
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
                    <span className="rating">⭐ {bookingData.movie.rating}/10</span>
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
                    <span className="label">Total Amount</span>
                    <span className="value total-amount">Rs. {bookingData.total}</span>
                  </div>
                </div>
              </div>

              <div className="qr-section">
                <div className="qr-code">
                  <div className="qr-placeholder">
                    <div className="qr-pattern"></div>
                    <p>QR Code</p>
                  </div>
                </div>
                <div className="qr-info">
                  <p>Show this QR code at the cinema</p>
                  <small>Booking Time: {new Date(bookingData.bookingTime).toLocaleString()}</small>
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

          {/* Action Buttons */}
          {showDownload && (
            <div className="ticket-actions">
              <button className="action-button download-btn" onClick={handleDownloadTicket}>
                📥 Download Ticket
              </button>
              <button className="action-button email-btn" onClick={handleEmailTicket}>
                📧 Email Ticket
              </button>
              <button className="action-button share-btn">
                📤 Share
              </button>
            </div>
          )}

          <div className="navigation-actions">
            <button className="back-home-btn" onClick={onBackToHome}>
              🏠 Back to Home
            </button>
            <button className="view-bookings-btn">
              📋 View All Bookings
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