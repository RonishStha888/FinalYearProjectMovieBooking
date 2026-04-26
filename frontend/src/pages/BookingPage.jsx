import { useState, useEffect } from "react";
import "./BookingPage.css";
import SeatSelection from "./SeatSelection";
import PaymentPage from "./PaymentPage";
import TicketPage from "./TicketPage";
import CinemaRecommendations from "../components/CinemaRecommendations";
import CinemaComparison from "../components/CinemaComparison";
import FBPromptModal from "../components/FBPromptModal";
import FoodBeveragePage from "./FoodBeveragePage";

export default function BookingPage({ movie, onBack }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Kathmandu");
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showFBPrompt, setShowFBPrompt] = useState(false);
  const [showFBMenu, setShowFBMenu] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [seatData, setSeatData] = useState(null);
  const [fbData, setFBData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState(null); // Track when hold expires

  // Generate dates for the next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const shortDayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      
      dates.push({
        id: i,
        day: date.getDate(),
        dayName: dayNames[date.getDay()],
        shortDay: shortDayNames[date.getDay()],
        month: monthNames[date.getMonth()],
        fullDate: date.toISOString().split('T')[0],
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
    
    return dates;
  };

  const dates = generateDates();

  // Fetch showtimes when date or location changes
  useEffect(() => {
    if (selectedDate && movie.id) {
      fetchShowtimes();
    }
  }, [selectedDate, selectedLocation, movie.id]);

  const fetchShowtimes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/movies/${movie.id}/showtimes?date=${selectedDate.fullDate}&city=${selectedLocation}`
      );
      const data = await response.json();
      
      if (data.success) {
        setShowtimes(data.cinemas);
      } else {
        console.error('Failed to fetch showtimes:', data.message);
        setShowtimes([]);
      }
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      setShowtimes([]);
    } finally {
      setLoading(false);
    }
  };

  const locations = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"];

  const handleTimeSelect = (cinema, hall, showtime) => {
    setSelectedCinema(cinema);
    setSelectedClass(hall);
    setSelectedTime(showtime.time);
    setSelectedShowtime(showtime);
  };

  const handleBuyTicket = () => {
    if (!selectedDate || !selectedTime || !selectedCinema || !selectedClass || !selectedShowtime) {
      alert('Please select date, time, and cinema first!');
      return;
    }

    // Navigate to seat selection
    setShowSeatSelection(true);
  };

  const handleBackFromSeatSelection = () => {
    setShowSeatSelection(false);
  };

  const handleProceedFromSeatSelection = (seatSelectionData) => {
    setSeatData(seatSelectionData);
    // Store the expiration time (10 minutes from now)
    setHoldExpiresAt(Date.now() + 10 * 60 * 1000);
    setShowSeatSelection(false);
    // Show F&B prompt modal instead of going directly to payment
    setShowFBPrompt(true);
  };

  const handleFBYes = () => {
    setShowFBPrompt(false);
    // Navigate to F&B menu page
    setShowFBMenu(true);
  };

  const handleFBNo = () => {
    setShowFBPrompt(false);
    // Go directly to payment without F&B
    setShowPayment(true);
  };

  const handleBackFromFBMenu = () => {
    setShowFBMenu(false);
    setShowSeatSelection(true);
  };

  const handleContinueFromFBMenu = (fbSelectionData) => {
    setFBData(fbSelectionData);
    setShowFBMenu(false);
    setShowPayment(true);
  };

  const handleBackFromPayment = () => {
    setShowPayment(false);
    setShowSeatSelection(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    setBookingData(paymentData);
    setShowPayment(false);
    setShowTicket(true);
  };

  const handleBackToHome = () => {
    // Reset all states
    setShowSeatSelection(false);
    setShowPayment(false);
    setShowTicket(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedCinema(null);
    setSelectedClass(null);
    setSelectedShowtime(null);
    setSeatData(null);
    setBookingData(null);
    
    // Navigate back to home
    onBack();
  };

  // If ticket is being shown, show ticket page
  if (showTicket && bookingData) {
    return (
      <TicketPage
        bookingData={bookingData}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // If payment is active, show payment page
  if (showPayment && seatData) {
    return (
      <PaymentPage
        movie={movie}
        selectedShowtime={selectedShowtime}
        selectedCinema={selectedCinema}
        selectedHall={selectedClass}
        selectedDate={selectedDate?.fullDate}
        seatData={seatData}
        fbData={fbData}
        holdExpiresAt={holdExpiresAt}
        onBack={handleBackFromPayment}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  // If F&B menu is active, show F&B menu page
  if (showFBMenu) {
    return (
      <FoodBeveragePage
        cinema={selectedCinema}
        ticketCount={seatData?.selectedSeats?.length || 1}
        bookingDate={selectedDate?.fullDate}
        holdExpiresAt={holdExpiresAt}
        onBack={handleBackFromFBMenu}
        onContinue={handleContinueFromFBMenu}
      />
    );
  }

  // If seat selection is active, show seat selection component
  if (showSeatSelection) {
    return (
      <SeatSelection
        movie={movie}
        selectedShowtime={selectedShowtime}
        selectedCinema={selectedCinema}
        selectedHall={selectedClass}
        selectedDate={selectedDate?.fullDate}
        onBack={handleBackFromSeatSelection}
        onProceed={handleProceedFromSeatSelection}
      />
    );
  }

  return (
    <div className="booking-page">
      {/* Header */}
      <header className="booking-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Movies
          </button>
          <div className="breadcrumb">
            <span>Home</span>
            <span className="separator">›</span>
            <span>Movies</span>
            <span className="separator">›</span>
            <span className="current">{movie.title}</span>
          </div>
        </div>
        <div className="header-right">
          <div className="location-selector">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="location-select"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="booking-main">
        {/* Left Section - Movie Info */}
        <div className="movie-info-section">
          <div className="movie-poster-container">
            <img src={movie.image} alt={movie.title} className="movie-poster" />
            <div className="movie-details-overlay">
              <h1 className="movie-title">{movie.title}</h1>
              <div className="movie-meta">
                <span className="genre">{movie.genre}</span>
                <span className="separator">•</span>
                <span className="duration">2h 28m</span>
                <span className="separator">•</span>
                <span className="rating-badge">UA</span>
              </div>
              <div className="movie-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                  ))}
                </div>
                <span className="rating-text">{movie.rating}/10 • 2.1K votes</span>
              </div>
              <p className="movie-description">
                Experience the ultimate cinematic adventure with stunning visuals and immersive sound. 
                Book your tickets now for an unforgettable movie experience.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Booking Details */}
        <div className={`booking-details-section ${selectedDate && selectedTime && selectedCinema && selectedClass ? 'with-summary' : ''}`}>
          {/* Date Selection */}
          <div className="section-card">
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Select Date
            </h2>
            <div className="date-grid">
              {dates.slice(0, 7).map((date) => (
                <button
                  key={date.id}
                  className={`date-card ${selectedDate?.id === date.id ? 'selected' : ''} ${date.isToday ? 'today' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="date-day">{date.day}</div>
                  <div className="date-name">{date.shortDay}</div>
                  {date.isToday && <div className="date-label">Today</div>}
                  {date.isTomorrow && <div className="date-label">Tomorrow</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Cinema Selection */}
          <div className="section-card">
            <div className="section-title-row">
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7H17V17H7V7Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Choose Cinema & Time
              </h2>
              {selectedDate && showtimes.length > 1 && (
                <button 
                  className="compare-cinemas-btn"
                  onClick={() => setShowComparison(true)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H9M15 5H17C18.1046 5 19 5.89543 19 7V19C19 20.1046 18.1046 21 17 21H15M9 5V21M15 5V21M9 12H15" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Compare Cinemas
                </button>
              )}
            </div>

            {/* Recommendation Component */}
            {selectedDate && showtimes.length > 0 && (
              <CinemaRecommendations
                cinemas={showtimes}
                selectedDate={selectedDate}
                user={null}
                onCinemaSelect={(cinema) => {
                  console.log('Recommended cinema:', cinema);
                }}
              />
            )}
            
            <div className="cinema-list">
              {loading ? (
                <div className="loading-message">Loading showtimes...</div>
              ) : showtimes.length === 0 ? (
                <div className="no-showtimes">
                  {selectedDate ? 'No showtimes available for this date.' : 'Please select a date to view showtimes.'}
                </div>
              ) : (
                showtimes.map((cinemaData) => (
                  <div key={cinemaData.cinema._id} className="cinema-card">
                    <div className="cinema-header">
                      <div className="cinema-info">
                        <h3 className="cinema-name">{cinemaData.cinema.name}</h3>
                        <div className="cinema-meta">
                          <span className="location">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            {cinemaData.cinema.location} • {cinemaData.cinema.distance}
                          </span>
                          <div className="cinema-rating">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                            </svg>
                            {cinemaData.cinema.rating}
                          </div>
                        </div>
                        <div className="amenities">
                          {cinemaData.cinema.amenities.map((amenity, index) => (
                            <span key={index} className="amenity-tag">{amenity}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {Object.values(cinemaData.halls).map((hallData) => (
                      <div key={hallData.hall._id} className="class-section">
                        <div className="class-header">
                          <div className="class-info">
                            <h4 className="class-type">{hallData.hall.type}</h4>
                            <div className="class-details">
                              <span className="price">
                                Rs. {hallData.showtimes[0]?.price}
                                {hallData.showtimes[0]?.originalPrice && (
                                  <span className="original-price">Rs. {hallData.showtimes[0].originalPrice}</span>
                                )}
                              </span>
                              <span className="availability">
                                {hallData.showtimes[0]?.availableSeats}/{hallData.hall.totalSeats} seats available
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="time-slots">
                          {hallData.showtimes.map((showtime, timeIndex) => (
                            <button
                              key={timeIndex}
                              className={`time-slot ${
                                selectedCinema?._id === cinemaData.cinema._id && 
                                selectedClass?._id === hallData.hall._id && 
                                selectedTime === showtime.time ? 'selected' : ''
                              }`}
                              onClick={() => handleTimeSelect(cinemaData.cinema, hallData.hall, showtime)}
                            >
                              {showtime.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Summary Footer */}
      {selectedDate && selectedTime && selectedCinema && selectedClass && selectedShowtime && (
        <div className="booking-summary-footer">
          <div className="summary-content">
            <div className="summary-left">
              <div className="selected-movie">
                <img src={movie.image} alt={movie.title} className="summary-poster" />
                <div className="summary-details">
                  <h3 className="summary-title">{movie.title}</h3>
                  <p className="summary-info">
                    {selectedDate.dayName}, {selectedDate.day} {selectedDate.month} • {selectedTime} • {selectedClass.type}
                  </p>
                  <p className="summary-cinema">{selectedCinema.name}</p>
                </div>
              </div>
            </div>
            <div className="summary-right">
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Ticket Price</span>
                  <span>Rs. {selectedShowtime.price}</span>
                </div>
                <div className="price-total">
                  <span>Total</span>
                  <span>Rs. {selectedShowtime.price}</span>
                </div>
              </div>
              <button className="proceed-button" onClick={handleBuyTicket}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Proceed to Seat Selection
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* F&B Prompt Modal */}
      <FBPromptModal
        isOpen={showFBPrompt}
        onYes={handleFBYes}
        onNo={handleFBNo}
        ticketCount={seatData?.selectedSeats?.length || 1}
      />

      {/* Cinema Comparison Modal */}
      {showComparison && (
        <CinemaComparison
          movie={movie}
          selectedDate={selectedDate}
          selectedLocation={selectedLocation}
          showtimes={showtimes}
          onClose={() => setShowComparison(false)}
          onSelectShowtime={handleTimeSelect}
        />
      )}
    </div>
  );
}
