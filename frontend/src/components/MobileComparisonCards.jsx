import './MobileComparisonCards.css';

/**
 * MobileComparisonCards Component
 * Mobile-optimized vertically stacked cards for comparison
 * 
 * @param {Object} props
 * @param {Array} props.cinemas - Array of cinema comparison data with scores
 * @param {string} props.bestPickId - ID of the best cinema
 */
export default function MobileComparisonCards({ cinemas, bestPickId }) {
  if (!cinemas || cinemas.length === 0) {
    return null;
  }

  return (
    <div className="mobile-comparison-cards">
      {cinemas.map((cinema, index) => (
        <div 
          key={cinema.cinema._id} 
          className={`mobile-cinema-card ${cinema.cinema._id === bestPickId ? 'best-pick' : ''}`}
        >
          {cinema.cinema._id === bestPickId && (
            <div className="best-pick-badge-mobile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD700">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span>Best Pick</span>
            </div>
          )}
          
          <div className="mobile-card-header">
            <h3 className="mobile-cinema-name">{cinema.cinema.name}</h3>
            <div className="mobile-score">
              <span className="mobile-score-value">{cinema.recommendationScore}</span>
              <span className="mobile-score-label">/100</span>
            </div>
          </div>
          
          <div className="mobile-card-content">
            <div className="mobile-attribute">
              <span className="mobile-attr-label">Location:</span>
              <span className="mobile-attr-value">{cinema.cinema.location}</span>
            </div>
            
            <div className="mobile-attribute">
              <span className="mobile-attr-label">Distance:</span>
              <span className="mobile-attr-value">{cinema.cinema.distance}</span>
            </div>
            
            <div className="mobile-attribute">
              <span className="mobile-attr-label">Price:</span>
              <span className="mobile-attr-value">
                {cinema.ticketPrice.discounted ? (
                  <>
                    <span className="mobile-discounted">Rs. {cinema.ticketPrice.discounted}</span>
                    <span className="mobile-original">Rs. {cinema.ticketPrice.original}</span>
                  </>
                ) : (
                  <span>Rs. {cinema.ticketPrice.original}</span>
                )}
              </span>
            </div>
            
            <div className="mobile-attribute">
              <span className="mobile-attr-label">Rating:</span>
              <span className="mobile-attr-value">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                {cinema.cinema.rating}
              </span>
            </div>
            
            {cinema.formats && cinema.formats.length > 0 && (
              <div className="mobile-attribute">
                <span className="mobile-attr-label">Formats:</span>
                <div className="mobile-tags">
                  {cinema.formats.map((format, idx) => (
                    <span key={idx} className="mobile-format-tag">{format}</span>
                  ))}
                </div>
              </div>
            )}
            
            {cinema.cinema.amenities && cinema.cinema.amenities.length > 0 && (
              <div className="mobile-attribute">
                <span className="mobile-attr-label">Amenities:</span>
                <div className="mobile-tags">
                  {cinema.cinema.amenities.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} className="mobile-amenity-tag">{amenity}</span>
                  ))}
                  {cinema.cinema.amenities.length > 4 && (
                    <span className="mobile-more">+{cinema.cinema.amenities.length - 4}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {index < cinemas.length - 1 && <div className="mobile-card-divider"></div>}
        </div>
      ))}
    </div>
  );
}
