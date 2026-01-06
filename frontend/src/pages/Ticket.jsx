import { useState } from "react";
import "./Ticket.css";

export default function Ticket({ bookingData, onClose, onNewBooking }) {
  const [showQR, setShowQR] = useState(false);

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

  const generateQRCode = () => {
    // Simple QR code placeholder - in real app, use a QR library
    const qrData = `RTX-${bookingData.bookingId}-${bookingData.seats?.join('')}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
  };

  const handleDownloadTicket = () => {
    // In a real app, this would generate a PDF
    const ticketData = {
      bookingId: bookingData.bookingId,
      movie: bookingData.movie?.title,
      cinema: bookingData.cinema?.name,
      hall: bookingData.hall?.type,
      date: bookingData.date,
      time: bookingData.time,
      seats: bookingData.seats,
      total: bookingData.total,
      transactionId: bookingData.transactionId
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ticketData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `RTX-Ticket-${bookingData.bookingId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    alert("Ticket downloaded! In a real app, this would be a PDF ticket.");
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="ticket-page">
      <div className="ticket-overlay" onClick={onClose}></div>
      
      <div className="ticket-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
          <h2>Booking Confirmed!</h2>
          <p>Your tickets have been successfully booked</p>
        </div>

        {/* Ticket */}
        <div className="ticket" id="ticket-print">
          <div className="ticket-header">
            <div className="cinema-logo">
              <h1>🎬 RTX Cinema</h1>
              <p>Premium Movie Experience</p>
            </div>
            <div className="booking-id">
              <span>Booking ID</span>
              <strong>{bookingData.bookingId}</strong>
            </div>
          </div>

          <div className="ticket-body">
            <div className="ticket-main">
              <div className="movie-section">
                <h3 className="movie-title">{bookingData.movie?.title}</h3>
                <div className="movie-details">
                  <span className="genre">{bookingData.movie?.genre}</span>
                  <span className="rating">⭐ {bookingData.movie?.rating}/10</span>
                </div>
              </div>

              <div className="show-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">Cinema</span>
                    <span className="value">{bookingData.cinema?.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Hall</span>
                    <span className="value">{bookingData.hall?.type}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">Date</span>
                    <span className="value">{formatDate(bookingData.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Time</span>
                    <span className="value">{formatTime(bookingData.time)}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item full-width">
                    <span className="label">Seats</span>
                    <div className="seat-numbers">
                      {bookingData.seats?.map(seat => (
                        <span key={seat} className={`seat-number ${bookingData.seatDetails?.find(s => s.id === seat)?.isPremium ? 'premium' : ''}`}>
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="payment-details">
                <div className="payment-row">
                  <span>Tickets ({bookingData.seats?.length})</span>
                  <span>Rs. {bookingData.total - 25 - Math.round((bookingData.total - 25) * 0.115)}</span>
                </div>
                <div className="payment-row">
                  <span>Tax & Fees</span>
                  <span>Rs. {25 + Math.round((bookingData.total - 25) * 0.115)}</span>
                </div>
                <div className="payment-total">
                  <span>Total Paid</span>
                  <span>Rs. {bookingData.total}</span>
                </div>
              </div>
            </div>

            <div className="ticket-side">
              <div className="qr-section">
                <div className="qr-code">
                  {showQR ? (
                    <img src={generateQRCode()} alt="QR Code" />
                  ) : (
                    <div className="qr-placeholder" onClick={() => setShowQR(true)}>
                      <span>📱</span>
                      <p>Tap to show QR</p>
                    </div>
                  )}
                </div>
                <p className="qr-instruction">Show this QR code at the cinema</p>
              </div>

              <div className="transaction-details">
                <div className="transaction-item">
                  <span>Transaction ID</span>
                  <span>{bookingData.transactionId}</span>
                </div>
                <div className="transaction-item">
                  <span>Payment Method</span>
                  <span>{bookingData.paymentMethod?.toUpperCase()}</span>
                </div>
                <div className="transaction-item">
                  <span>Booked At</span>
                  <span>{new Date(bookingData.bookedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ticket-footer">
            <div className="terms">
              <p>• Please arrive 15 minutes before showtime</p>
              <p>• No outside food or beverages allowed</p>
              <p>• Ticket is non-refundable and non-transferable</p>
            </div>
            <div className="contact">
              <p>For support: support@rtxcinema.com | +977-1-4470000</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ticket-actions">
          <button className="action-button secondary" onClick={handlePrintTicket}>
            🖨️ Print Ticket
          </button>
          <button className="action-button secondary" onClick={handleDownloadTicket}>
            📥 Download
          </button>
          <button className="action-button primary" onClick={onNewBooking}>
            🎬 Book Another Movie
          </button>
        </div>

        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}