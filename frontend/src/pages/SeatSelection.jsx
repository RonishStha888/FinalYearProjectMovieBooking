import { useState, useEffect } from "react";
import "./SeatSelection.css";

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
  const [seatLayout, setSeatLayout] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // Simulate some booked seats (random for demo)
    const generateBookedSeats = () => {
      const booked = [];
      const totalSeats = layout.rows.length * Math.max(...layout.seatsPerRow);
      const bookedCount = Math.floor(totalSeats * 0.15); // 15% occupancy

      for (let i = 0; i < bookedCount; i++) {
        const randomRow = layout.rows[Math.floor(Math.random() * layout.rows.length)];
        const maxSeatsInRow = layout.seatsPerRow[layout.rows.indexOf(randomRow)];
        const randomSeat = Math.floor(Math.random() * maxSeatsInRow) + 1;
        const seatId = `${randomRow}${randomSeat}`;
        
        if (!booked.includes(seatId) && !layout.disabledSeats.includes(seatId)) {
          booked.push(seatId);
        }
      }
      return booked;
    };

    setBookedSeats(generateBookedSeats());
    setLoading(false);
  }, [selectedHall, selectedCinema]);

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId) || seatLayout.disabledSeats.includes(seatId)) {
      return; // Can't select booked or disabled seats
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
    } else {
      if (selectedSeats.length < 8) { // Max 8 seats per booking
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const getSeatClass = (seatId, rowIndex) => {
    let classes = ['seat'];
    
    if (seatLayout.disabledSeats.includes(seatId)) {
      classes.push('disabled');
    } else if (bookedSeats.includes(seatId)) {
      classes.push('booked');
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
    const basePrice = selectedHall?.pricing?.basePrice || 500;
    const isWeekend = selectedDate && (new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6);
    const price = isWeekend ? selectedHall?.pricing?.weekendPrice || basePrice + 50 : basePrice;
    
    // Premium seat surcharge
    const premiumSeats = selectedSeats.filter(seat => 
      seatLayout.premiumRows.includes(seat.charAt(0))
    ).length;
    
    const premiumSurcharge = premiumSeats * 100;
    return (selectedSeats.length * price) + premiumSurcharge;
  };

  if (loading) {
    return (
      <div className="seat-selection-page">
        <div className="loading-seats">Loading seat layout...</div>
      </div>
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
                        disabled={bookedSeats.includes(seatId) || seatLayout.disabledSeats.includes(seatId)}
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
                  <span>Rs. {selectedSeats.length * (selectedHall?.pricing?.basePrice || 500)}</span>
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
    </div>
  );
}