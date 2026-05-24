import { useState, useEffect } from "react";
import "./SeatSelection.css";
import ARSeatView from "../components/ARSeatView";

export default function SeatSelection({ 
  movie, 
  selectedShowtime, 
  selectedCinema, 
  selectedHall, 
  selectedDate, 
  onBack, 
  onProceed 
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [heldSeats, setHeldSeats] = useState([]); // Seats held by other users
  const [seatLayout, setSeatLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showARView, setShowARView] = useState(false);
  const [holdId, setHoldId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [sessionId] = useState(() => {
    // Check if sessionId already exists in sessionStorage
    let existingSessionId = sessionStorage.getItem('sessionId');
    if (!existingSessionId) {
      existingSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', existingSessionId);
    }
    return existingSessionId;
  });

  // Realistic seat layouts based on actual cinema configurations
  const getRealisticSeatLayout = (hallType, cinemaName) => {
    const layouts = {
      // QFX Cinema Jai Nepal - Realistic layouts
      'QFX_REGULAR': {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
        seatsPerRow: [10, 12, 14, 14, 16, 16, 16, 16, 14, 14, 12, 10],
        aisles: [3, 7], // Aisle positions
        premiumRows: ['F', 'G', 'H'], // Best viewing rows
        disabledSeats: ['A1', 'A10', 'L1', 'L10'], // Corner seats often blocked
      },
      'QFX_GOLD': {
        rows: ['A', 'B', 'C', 'D', 'E', 'F'],
        seatsPerRow: [6, 8, 8, 8, 8, 6],
        aisles: [2, 6],
        premiumRows: ['C', 'D', 'E'],
        disabledSeats: [],
        isRecliners: true
      },
      // FCube Cinema - Modern layout
      'FCUBE_STANDARD': {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        seatsPerRow: [8, 10, 12, 12, 14, 14, 12, 12, 10, 8],
        aisles: [3, 8],
        premiumRows: ['E', 'F', 'G'],
        disabledSeats: ['A1', 'A8', 'J1', 'J8'],
      },
      'FCUBE_PREMIUM': {
        rows: ['A', 'B', 'C', 'D', 'E', 'F'],
        seatsPerRow: [8, 10, 10, 10, 10, 8],
        aisles: [3, 7],
        premiumRows: ['C', 'D', 'E'],
        disabledSeats: [],
        isRecliners: true
      },
      // Big Movies - Traditional layout
      'BIG_REGULAR': {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
        seatsPerRow: [8, 8, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 8],
        aisles: [3, 7],
        premiumRows: ['G', 'H', 'I', 'J'],
        disabledSeats: ['A1', 'A8', 'N1', 'N8'],
      }
    };

    // Determine layout key based on cinema and hall type
    let layoutKey = 'QFX_REGULAR';
    
    if (cinemaName?.includes('QFX')) {
      layoutKey = hallType?.includes('GOLD') ? 'QFX_GOLD' : 'QFX_REGULAR';
    } else if (cinemaName?.includes('FCube')) {
      layoutKey = hallType?.includes('PREMIUM') ? 'FCUBE_PREMIUM' : 'FCUBE_STANDARD';
    } else if (cinemaName?.includes('Big Movies')) {
      layoutKey = 'BIG_REGULAR';
    }

    return layouts[layoutKey];
  };

  useEffect(() => {
    // Generate realistic seat layout
    const layout = getRealisticSeatLayout(selectedHall?.type, selectedCinema?.name);
    setSeatLayout(layout);

    // Fetch held seats from server
    fetchHeldSeats();

    // Fetch permanently booked seats from database
    fetchBookedSeats();

    setLoading(false);

    // Poll for held seats and booked seats every 5 seconds
    const pollInterval = setInterval(() => {
      fetchHeldSeats();
      fetchBookedSeats();
    }, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(pollInterval);
      releaseSeats();
    };
  }, [selectedHall, selectedCinema]);

  // Timer countdown effect
  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time expired
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive]);

  const fetchHeldSeats = async () => {
    try {
      // Use a mock showtime ID if not available
      const showtimeId = selectedShowtime?._id || `showtime_${selectedCinema?._id}_${selectedDate}_${selectedShowtime?.time}`;
      
      const response = await fetch(`http://localhost:5000/api/seat-hold/showtime/${showtimeId}`);
      const data = await response.json();
      
      if (data.success) {
        setHeldSeats(data.heldSeats || []);
      }
    } catch (error) {
      console.error('Error fetching held seats:', error);
    }
  };

  const fetchBookedSeats = async () => {
    try {
      // Use a mock showtime ID if not available
      const showtimeId = selectedShowtime?._id || `showtime_${selectedCinema?._id}_${selectedDate}_${selectedShowtime?.time}`;
      
      const response = await fetch(`http://localhost:5000/api/seat-hold/booked/${showtimeId}`);
      const data = await response.json();
      
      if (data.success) {
        setBookedSeats(data.bookedSeats || []);
      }
    } catch (error) {
      console.error('Error fetching booked seats:', error);
      // Fallback to empty array if API fails
      setBookedSeats([]);
    }
  };

  const holdSeats = async (seats) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Use a mock showtime ID if not available
      const showtimeId = selectedShowtime?._id || `showtime_${selectedCinema?._id}_${selectedDate}_${selectedShowtime?.time}`;
      
      const response = await fetch('http://localhost:5000/api/seat-hold/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showtimeId: showtimeId,
          userId: user._id || 'guest',
          sessionId: sessionId,
          seats: seats.map(seat => ({
            seatNumber: seat,
            seatType: seatLayout.premiumRows.includes(seat.charAt(0)) ? 'premium' : 'regular'
          }))
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setHoldId(data.holdId);
        setTimeRemaining(data.expiresIn);
        setTimerActive(true);
        console.log('🔒 Seats held successfully');
      } else {
        alert(data.message || 'Failed to hold seats');
        // Refresh held seats
        fetchHeldSeats();
      }
    } catch (error) {
      console.error('Error holding seats:', error);
      alert('Failed to hold seats. Please try again.');
    }
  };

  const releaseSeats = async () => {
    if (!holdId) return;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      await fetch('http://localhost:5000/api/seat-hold/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id || 'guest',
          sessionId: sessionId
        })
      });

      console.log('🔓 Seats released');
      setHoldId(null);
      setTimerActive(false);
    } catch (error) {
      console.error('Error releasing seats:', error);
    }
  };

  const handleTimeExpired = () => {
    alert('Your seat selection has expired. Please select seats again.');
    setSelectedSeats([]);
    setHoldId(null);
    setTimerActive(false);
    fetchHeldSeats();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId) || seatLayout.disabledSeats.includes(seatId) || heldSeats.includes(seatId)) {
      return; // Can't select booked, disabled, or held seats
    }

    if (selectedSeats.includes(seatId)) {
      const newSeats = selectedSeats.filter(seat => seat !== seatId);
      setSelectedSeats(newSeats);
      
      // If no seats selected, release hold
      if (newSeats.length === 0) {
        releaseSeats();
      } else {
        // Update hold with new seats
        holdSeats(newSeats);
      }
    } else {
      if (selectedSeats.length < 8) { // Max 8 seats per booking
        const newSeats = [...selectedSeats, seatId];
        setSelectedSeats(newSeats);
        
        // Hold the seats
        holdSeats(newSeats);
      }
    }
  };

  const getSeatClass = (seatId, rowIndex) => {
    let classes = ['seat'];
    
    if (seatLayout.disabledSeats.includes(seatId)) {
      classes.push('disabled');
    } else if (bookedSeats.includes(seatId)) {
      classes.push('booked');
    } else if (heldSeats.includes(seatId) && !selectedSeats.includes(seatId)) {
      classes.push('held'); // Held by another user
    } else if (selectedSeats.includes(seatId)) {
      classes.push('selected');
    } else {
      classes.push('available');
    }

    // Premium seats styling
    const row = seatId.charAt(0);
    if (seatLayout.premiumRows.includes(row)) {
      classes.push('premium');
    }

    // Recliner seats
    if (seatLayout.isRecliners) {
      classes.push('recliner');
    }

    return classes.join(' ');
  };

  const calculateTotal = () => {
    // Use the actual showtime price selected by user
    const ticketPrice = selectedShowtime?.price || 500;
    
    // Premium seat surcharge
    const premiumSeats = selectedSeats.filter(seat => 
      seatLayout.premiumRows.includes(seat.charAt(0))
    ).length;
    
    const premiumSurcharge = premiumSeats * 100;
    return (selectedSeats.length * ticketPrice) + premiumSurcharge;
  };

  if (loading) {
    return (
      <div className="seat-selection-page">
        <div className="loading-seats">Loading seat layout...</div>
      </div>
    );
  }

  // Show AR View if active
  if (showARView) {
    return (
      <ARSeatView
        seatLayout={seatLayout}
        selectedSeats={selectedSeats}
        bookedSeats={bookedSeats}
        onSeatClick={handleSeatClick}
        onClose={() => setShowARView(false)}
        selectedHall={selectedHall}
      />
    );
  }

  return (
    <div className="seat-selection-page">
      {/* Header */}
      <header className="seat-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <div className="movie-info">
            <h2>{movie?.title}</h2>
            <p>{selectedCinema?.name} - {selectedHall?.name}</p>
            <p>{selectedDate} • {selectedShowtime?.time}</p>
          </div>
        </div>
        <div className="header-right">
          {timerActive && (
            <div className={`timer-display ${timeRemaining <= 60 ? 'warning' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Time Remaining: {formatTime(timeRemaining)}</span>
            </div>
          )}
          <button 
            className="ar-view-btn"
            onClick={() => setShowARView(true)}
            title="View in AR"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 4H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            AR Cinema View
          </button>
          <div className="seat-counter">
            Selected: {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="seat-main">
        {/* Screen */}
        <div className="screen-container">
          <div className="screen">SCREEN</div>
          <div className="screen-curve"></div>
        </div>

        {/* Seat Map */}
        <div className="seat-map">
          {seatLayout.rows.map((row, rowIndex) => (
            <div key={row} className="seat-row">
              <div className="row-label">{row}</div>
              <div className="seats">
                {Array.from({ length: seatLayout.seatsPerRow[rowIndex] }, (_, seatIndex) => {
                  const seatNumber = seatIndex + 1;
                  const seatId = `${row}${seatNumber}`;
                  
                  return (
                    <div key={seatId} className="seat-container">
                      <button
                        className={getSeatClass(seatId, rowIndex)}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={bookedSeats.includes(seatId) || seatLayout.disabledSeats.includes(seatId) || (heldSeats.includes(seatId) && !selectedSeats.includes(seatId))}
                      >
                        {seatNumber}
                      </button>
                      {/* Add aisle space */}
                      {seatLayout.aisles.includes(seatNumber) && (
                        <div className="aisle-space"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="seat-legend">
          <div className="legend-item">
            <div className="seat available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="seat selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="seat booked"></div>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <div className="seat held"></div>
            <span>Being Held</span>
          </div>
          <div className="legend-item">
            <div className="seat premium available"></div>
            <span>Premium (+Rs. 100)</span>
          </div>
          {seatLayout.isRecliners && (
            <div className="legend-item">
              <div className="seat recliner available"></div>
              <span>Recliner Seats</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {selectedSeats.length > 0 && (
        <div className="seat-footer">
          <div className="booking-summary">
            <div className="selected-seats">
              <h3>Selected Seats</h3>
              <div className="seat-list">
                {selectedSeats.map(seat => (
                  <span key={seat} className="seat-tag">
                    {seat}
                    <button 
                      className="remove-seat"
                      onClick={() => handleSeatClick(seat)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="price-summary">
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Seats ({selectedSeats.length})</span>
                  <span>Rs. {selectedSeats.length * (selectedShowtime?.price || 500)}</span>
                </div>
                {selectedSeats.filter(seat => seatLayout.premiumRows.includes(seat.charAt(0))).length > 0 && (
                  <div className="price-item">
                    <span>Premium Surcharge</span>
                    <span>Rs. {selectedSeats.filter(seat => seatLayout.premiumRows.includes(seat.charAt(0))).length * 100}</span>
                  </div>
                )}
                <div className="price-total">
                  <span>Total</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
              </div>
              <button 
                className="proceed-button"
                onClick={() => onProceed({ 
                  seats: selectedSeats, 
                  total: calculateTotal(),
                  ticketPrice: selectedShowtime?.price || 500,
                  seatDetails: selectedSeats.map(seat => ({
                    id: seat,
                    row: seat.charAt(0),
                    number: seat.slice(1),
                    isPremium: seatLayout.premiumRows.includes(seat.charAt(0))
                  }))
                })}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AR View */}
      {showARView && (
        <ARSeatView
          seatLayout={seatLayout}
          selectedSeats={selectedSeats}
          bookedSeats={bookedSeats}
          onSeatClick={handleSeatClick}
          onClose={() => setShowARView(false)}
          cinemaName={selectedCinema?.name}
          hallType={selectedHall?.type}
        />
      )}
    </div>
  );
}