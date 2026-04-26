import { useState, useEffect } from "react";
import "./CinemaComparison.css";

export default function CinemaComparison({ 
  movie, 
  selectedDate, 
  selectedLocation,
  showtimes,
  onClose,
  onSelectShowtime 
}) {
  const [selectedCinemas, setSelectedCinemas] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [bestOption, setBestOption] = useState(null);

  useEffect(() => {
    if (selectedCinemas.length > 0) {
      calculateComparison();
    }
  }, [selectedCinemas]);

  const toggleCinemaSelection = (cinema, hall, showtime) => {
    const cinemaKey = `${cinema.name}-${hall.name}-${showtime.time}`;
    const existing = selectedCinemas.find(c => c.key === cinemaKey);

    if (existing) {
      setSelectedCinemas(selectedCinemas.filter(c => c.key !== cinemaKey));
    } else {
      if (selectedCinemas.length >= 4) {
        alert('You can compare up to 4 cinema options at a time');
        return;
      }
      setSelectedCinemas([...selectedCinemas, {
        key: cinemaKey,
        cinema,
        hall,
        showtime
      }]);
    }
  };

  const calculateComparison = () => {
    const comparison = selectedCinemas.map(item => {
      const basePrice = item.showtime.price || 0;
      const discount = item.showtime.discount || 0;
      const finalPrice = basePrice - discount;
      
      // Calculate value score (lower price = higher score)
      const priceScore = selectedCinemas.length > 0 
        ? Math.max(0, 100 - ((finalPrice / Math.max(...selectedCinemas.map(c => (c.showtime.price || 0) - (c.showtime.discount || 0)))) * 100))
        : 0;
      
      // Calculate features score
      const features = [];
      if (item.hall.type === 'IMAX' || item.hall.type === 'Dolby Atmos') features.push('Premium Audio/Visual');
      if (item.hall.isRecliners) features.push('Recliner Seats');
      if (item.cinema.amenities?.includes('parking')) features.push('Parking Available');
      if (item.cinema.amenities?.includes('food-court')) features.push('Food Court');
      if (discount > 0) features.push(`${discount} NPR Discount`);
      
      const featureScore = (features.length / 5) * 100;
      
      // Calculate distance score (mock - in real app, use geolocation)
      const distanceScore = Math.random() * 30 + 70; // Mock score 70-100
      
      // Calculate availability score
      const availabilityScore = ((item.showtime.availableSeats || 0) / (item.hall.totalSeats || 100)) * 100;
      
      // Overall score (weighted average)
      const overallScore = (
        priceScore * 0.4 +
        featureScore * 0.3 +
        distanceScore * 0.2 +
        availabilityScore * 0.1
      );

      return {
        ...item,
        basePrice,
        discount,
        finalPrice,
        features,
        scores: {
          price: priceScore,
          features: featureScore,
          distance: distanceScore,
          availability: availabilityScore,
          overall: overallScore
        }
      };
    });

    // Sort by overall score
    comparison.sort((a, b) => b.scores.overall - a.scores.overall);
    
    setComparisonData(comparison);
    setBestOption(comparison[0]);
  };

  const isSelected = (cinema, hall, showtime) => {
    const cinemaKey = `${cinema.name}-${hall.name}-${showtime.time}`;
    return selectedCinemas.some(c => c.key === cinemaKey);
  };

  const handleSelectBest = () => {
    if (bestOption) {
      onSelectShowtime(bestOption.cinema, bestOption.hall, bestOption.showtime);
      onClose();
    }
  };

  return (
    <div className="cinema-comparison-overlay">
      <div className="cinema-comparison-modal">
        <div className="comparison-header">
          <h2>🎯 Compare Cinema Options</h2>
          <button className="close-comparison-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="comparison-content">
          {/* Selection Panel */}
          <div className="selection-panel">
            <h3>Select Cinema Options to Compare (Max 4)</h3>
            <p className="selection-hint">
              Selected: {selectedCinemas.length}/4
            </p>

            <div className="cinema-selection-list">
              {showtimes.map((cinema) => (
                <div key={cinema._id} className="cinema-group">
                  <h4 className="cinema-name">{cinema.name}</h4>
                  {cinema.halls.map((hall) => (
                    <div key={hall._id} className="hall-group">
                      <div className="hall-header">
                        <span className="hall-name">{hall.name}</span>
                        <span className="hall-type">{hall.type}</span>
                      </div>
                      <div className="showtime-options">
                        {hall.showtimes.map((showtime) => (
                          <button
                            key={showtime._id}
                            className={`showtime-option ${isSelected(cinema, hall, showtime) ? 'selected' : ''}`}
                            onClick={() => toggleCinemaSelection(cinema, hall, showtime)}
                          >
                            <span className="time">{showtime.time}</span>
                            <span className="price">NPR {showtime.price}</span>
                            {showtime.discount > 0 && (
                              <span className="discount">-{showtime.discount}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          {comparisonData.length > 0 && (
            <div className="comparison-table-panel">
              <h3>📊 Comparison Results</h3>
              
              {bestOption && (
                <div className="best-option-banner">
                  <div className="best-badge">🏆 Best Option</div>
                  <div className="best-details">
                    <h4>{bestOption.cinema.name} - {bestOption.hall.name}</h4>
                    <p>{bestOption.showtime.time} • NPR {bestOption.finalPrice}</p>
                  </div>
                  <button className="select-best-btn" onClick={handleSelectBest}>
                    Select This Option
                  </button>
                </div>
              )}

              <div className="comparison-table">
                <table>
                  <thead>
                    <tr>
                      <th>Cinema & Hall</th>
                      {comparisonData.map((item, index) => (
                        <th key={index} className={index === 0 ? 'best-column' : ''}>
                          {index === 0 && <span className="best-label">BEST</span>}
                          <div className="cinema-header">
                            <strong>{item.cinema.name}</strong>
                            <span>{item.hall.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="label-cell">Showtime</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className={index === 0 ? 'best-column' : ''}>
                          <strong>{item.showtime.time}</strong>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="label-cell">Base Price</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className={index === 0 ? 'best-column' : ''}>
                          NPR {item.basePrice}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="label-cell">Discount</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className={index === 0 ? 'best-column' : ''}>
                          {item.discount > 0 ? (
                            <span className="discount-value">-NPR {item.discount}</span>
                          ) : (
                            <span className="no-discount">No discount</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="highlight-row">
                      <td className="label-cell">Final Price</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className={index === 0 ? 'best-column' : ''}>
                          <strong className="final-price">NPR {item.finalPrice}</strong>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="label-cell">Hall Type</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className={index === 0 ? 'best-column' : ''}>
                          {item.hall.type}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="label-cell">Available Seats</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className={index === 0 ? 'best-column' : ''}>
                          {item.showtime.availableSeats || 0} / {item.hall.totalSeats || 0}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="label-cell">Features</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className={index === 0 ? 'best-column' : ''}>
                          <ul className="features-list">
                            {item.features.map((feature, fIndex) => (
                              <li key={fIndex}>{feature}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr className="score-row">
                      <td className="label-cell">Value Score</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className={index === 0 ? 'best-column' : ''}>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ width: `${item.scores.price}%` }}
                            ></div>
                            <span className="score-text">{Math.round(item.scores.price)}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="score-row">
                      <td className="label-cell">Feature Score</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className={index === 0 ? 'best-column' : ''}>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ width: `${item.scores.features}%` }}
                            ></div>
                            <span className="score-text">{Math.round(item.scores.features)}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="score-row highlight-row">
                      <td className="label-cell">Overall Score</td>
                      {comparisonData.map((item, index) => (
                        <td key={index} className={index === 0 ? 'best-column' : ''}>
                          <div className="score-bar overall">
                            <div 
                              className="score-fill" 
                              style={{ width: `${item.scores.overall}%` }}
                            ></div>
                            <span className="score-text">
                              <strong>{Math.round(item.scores.overall)}</strong>
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="comparison-actions">
                {comparisonData.map((item, index) => (
                  <button
                    key={index}
                    className={`select-option-btn ${index === 0 ? 'best' : ''}`}
                    onClick={() => {
                      onSelectShowtime(item.cinema, item.hall, item.showtime);
                      onClose();
                    }}
                  >
                    {index === 0 ? '🏆 Select Best Option' : 'Select This'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {comparisonData.length === 0 && (
            <div className="no-comparison">
              <p>👆 Select at least 2 cinema options to compare</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
