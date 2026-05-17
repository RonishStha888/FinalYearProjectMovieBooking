import './ComparisonTable.css';

/**
 * ComparisonTable Component
 * Desktop side-by-side comparison table
 * 
 * @param {Object} props
 * @param {Array} props.cinemas - Array of cinema comparison data with scores
 * @param {string} props.bestPickId - ID of the best cinema
 */
export default function ComparisonTable({ cinemas, bestPickId }) {
  if (!cinemas || cinemas.length === 0) {
    return null;
  }

  return (
    <div className="comparison-table-container">
      <div className="comparison-table-scroll">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="attribute-column">Attribute</th>
              {cinemas.map((cinema) => (
                <th key={cinema.cinema._id} className={cinema.cinema._id === bestPickId ? 'best-pick-column' : ''}>
                  {cinema.cinema.name}
                  {cinema.cinema._id === bestPickId && (
                    <span className="best-pick-indicator">★ Best Pick</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="attribute-label">Score</td>
              {cinemas.map((cinema) => (
                <td key={cinema.cinema._id} className={cinema.cinema._id === bestPickId ? 'best-pick-column' : ''}>
                  <div className="score-display">
                    <span className="score-value">{cinema.recommendationScore}/100</span>
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="attribute-label">Location</td>
              {cinemas.map((cinema) => (
                <td key={cinema.cinema._id} className={cinema.cinema._id === bestPickId ? 'best-pick-column' : ''}>
                  {cinema.cinema.location}
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="attribute-label">Distance</td>
              {cinemas.map((cinema) => (
                <td key={cinema.cinema._id} className={cinema.cinema._id === bestPickId ? 'best-pick-column' : ''}>
                  {cinema.cinema.distance}
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="attribute-label">Ticket Price</td>
              {cinemas.map((cinema) => (
                <td key={cinema.cinema._id} className={cinema.cinema._id === bestPickId ? 'best-pick-column' : ''}>
                  <div className="price-display">
                    {cinema.ticketPrice.discounted ? (
                      <>
                        <span className="discounted-price">Rs. {cinema.ticketPrice.discounted}</span>
                        <span className="original-price">Rs. {cinema.ticketPrice.original}</span>
                      </>
                    ) : (
                      <span className="current-price">Rs. {cinema.ticketPrice.original}</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="attribute-label">Rating</td>
              {cinemas.map((cinema) => (
                <td key={cinema.cinema._id} className={cinema.cinema._id === bestPickId ? 'best-pick-column' : ''}>
                  <div className="rating-display">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    <span>{cinema.cinema.rating}</span>
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="attribute-label">Formats</td>
              {cinemas.map((cinema) => (
                <td key={cinema.cinema._id} className={cinema.cinema._id === bestPickId ? 'best-pick-column' : ''}>
                  <div className="formats-list">
                    {cinema.formats && cinema.formats.length > 0 ? (
                      cinema.formats.map((format, idx) => (
                        <span key={idx} className="format-tag">{format}</span>
                      ))
                    ) : (
                      <span className="no-data">Standard</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="attribute-label">Amenities</td>
              {cinemas.map((cinema) => (
                <td key={cinema.cinema._id} className={cinema.cinema._id === bestPickId ? 'best-pick-column' : ''}>
                  <div className="amenities-list">
                    {cinema.cinema.amenities && cinema.cinema.amenities.length > 0 ? (
                      cinema.cinema.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="amenity-tag">{amenity}</span>
                      ))
                    ) : (
                      <span className="no-data">Basic</span>
                    )}
                    {cinema.cinema.amenities && cinema.cinema.amenities.length > 3 && (
                      <span className="more-count">+{cinema.cinema.amenities.length - 3} more</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="attribute-label">Seat Availability</td>
              {cinemas.map((cinema) => (
                <td key={cinema.cinema._id} className={cinema.cinema._id === bestPickId ? 'best-pick-column' : ''}>
                  {cinema.seatAvailability ? (
                    <span>{cinema.seatAvailability.available}/{cinema.seatAvailability.total} seats</span>
                  ) : (
                    <span className="no-data">Check showtimes</span>
                  )}
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="attribute-label">Active Offers</td>
              {cinemas.map((cinema) => (
                <td key={cinema.cinema._id} className={cinema.cinema._id === bestPickId ? 'best-pick-column' : ''}>
                  <div className="offers-list">
                    {cinema.activeOffers && cinema.activeOffers.length > 0 ? (
                      cinema.activeOffers.map((offer, idx) => (
                        <div key={idx} className="offer-item">{offer.description}</div>
                      ))
                    ) : (
                      <span className="no-data">No special offers</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
