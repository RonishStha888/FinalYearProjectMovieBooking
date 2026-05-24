import { useState, useEffect } from "react";
import "./MyBookingsPage.css";
import { API_URL } from '../config';

export default function MyBookingsPage({ user, onBack }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Mock booking data - in a real app, you'd fetch from your API
      const mockBookings = [
        {
          id: 'BK001',
          movie: {
            title: 'Spider-Man: No Way Home',
            image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
            genre: 'Action • Adventure • Sci-Fi'
          },
          cinema: 'QFX Jai Nepal',
          hall: 'Hall 1',
          date: '2024-02-15',
          time: '7:30 PM',
          seats: ['F5', 'F6'],
          totalAmount: 800,
          bookingDate: '2024-02-10',
          status: 'confirmed',
          bookingReference: 'RTX240210001'
        },
        {
          id: 'BK002',
          movie: {
            title: 'Avatar: The Way of Water',
            image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
            genre: 'Action • Adventure • Sci-Fi'
          },
          cinema: 'FCube Labim Mall',
          hall: 'IMAX Hall',
          date: '2024-01-20',
          time: '2:15 PM',
          seats: ['G8', 'G9', 'G10'],
          totalAmount: 1200,
          bookingDate: '2024-01-18',
          status: 'completed',
          bookingReference: 'RTX240118002'
        },
        {
          id: 'BK003',
          movie: {
            title: 'Top Gun: Maverick',
            image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
            genre: 'Action • Drama'
          },
          cinema: 'Big Movies Civil Mall',
          hall: 'Hall 3',
          date: '2024-02-25',
          time: '9:45 PM',
          seats: ['H12', 'H13'],
          totalAmount: 600,
          bookingDate: '2024-02-12',
          status: 'confirmed',
          bookingReference: 'RTX240212003'
        }
      ];
      
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      
      switch (filter) {
        case 'upcoming':
          return bookingDate >= today && booking.status === 'confirmed';
        case 'past':
          return bookingDate < today || booking.status === 'completed';
        default:
          return true;
      }
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmed', class: 'status-confirmed' },
      completed: { label: 'Completed', class: 'status-completed' },
      cancelled: { label: 'Cancelled', class: 'status-cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.confirmed;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // In a real app, you'd call your API to cancel the booking
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
        alert('Booking cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleDownloadTicket = (booking) => {
    // In a real app, you'd generate and download the ticket
    alert(`Downloading ticket for ${booking.movie.title}`);
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back to Home
        </button>
        <h1>My Bookings</h1>
      </div>

      <div className="bookings-container">
        <div className="bookings-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Bookings ({bookings.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({bookings.filter(b => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return new Date(b.date) >= today && b.status === 'confirmed';
            }).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past ({bookings.filter(b => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return new Date(b.date) < today || b.status === 'completed';
            }).length})
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">🎬</div>
            <h3>No Bookings Found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't made any bookings yet. Start exploring movies!"
                : filter === 'upcoming'
                ? "No upcoming bookings. Book your next movie experience!"
                : "No past bookings to show."
              }
            </p>
          </div>
        ) : (
          <div className="bookings-grid">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-movie-info">
                  <img 
                    src={booking.movie.image} 
                    alt={booking.movie.title}
                    className="booking-poster"
                  />
                  <div className="booking-details">
                    <h3 className="movie-title">{booking.movie.title}</h3>
                    <p className="movie-genre">{booking.movie.genre}</p>
                    
                    <div className="booking-meta">
                      <div className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                      </div>
                      
                      <div className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>{booking.cinema} - {booking.hall}</span>
                      </div>
                      
                      <div className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Seats: {booking.seats.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="booking-footer">
                  <div className="booking-status-section">
                    {getStatusBadge(booking.status)}
                    <div className="booking-reference">
                      <span>Ref: {booking.bookingReference}</span>
                    </div>
                  </div>
                  
                  <div className="booking-amount">
                    <span className="amount-label">Total Paid</span>
                    <span className="amount-value">Rs. {booking.totalAmount}</span>
                  </div>
                  
                  <div className="booking-actions">
                    {booking.status === 'confirmed' && (
                      <>
                        <button 
                          className="action-btn download-btn"
                          onClick={() => handleDownloadTicket(booking)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Download Ticket
                        </button>
                        <button 
                          className="action-btn cancel-btn"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Cancel
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'completed' && (
                      <button 
                        className="action-btn download-btn"
                        onClick={() => handleDownloadTicket(booking)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
                          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Download Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}