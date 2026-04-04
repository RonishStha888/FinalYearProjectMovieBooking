import { useState, useEffect } from 'react';
import './CinemaRecommendations.css';

export default function CinemaRecommendations({ 
  cinemas, 
  selectedDate, 
  user, 
  onCinemaSelect 
}) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (cinemas && cinemas.length > 0 && selectedDate) {
      fetchRecommendations();
    }
  }, [cinemas, selectedDate]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Prepare cinema data from actual admin panel showtime data
      const cinemaData = cinemas.map(c => {
        // Extract all showtimes across all halls for this cinema
        const allShowtimes = Object.values(c.halls || {}).flatMap(hall => hall.showtimes || []);
        
        // Calculate average and minimum prices from actual showtimes
        const prices = allShowtimes.map(s => s.price).filter(p => p > 0);
        const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 500;
        const minPrice = prices.length > 0 ? Math.min(...prices) : 500;
        
        // Determine cinema type based on amenities
        let cinemaType = 'standard';
        if (c.cinema.amenities?.includes('IMAX')) cinemaType = 'premium';
        else if (c.cinema.amenities?.includes('Dolby Atmos')) cinemaType = 'premium';
        else if (c.cinema.amenities?.includes('Gold Class')) cinemaType = 'premium';
        
        // Get day of week for discount rules
        const dayOfWeek = selectedDate.dayName.toLowerCase();
        
        // Set up discount days based on common cinema practices
        // You can customize this in your admin panel later
        const discountDays = ['monday', 'wednesday', 'friday'];
        
        // Set up food offers based on cinema amenities
        const foodOffers = [];
        if (c.cinema.amenities?.includes('Food Court')) {
          foodOffers.push({
            active: true,
            type: 'free_item',
            item: 'Popcorn',
            value: 150,
            description: 'Free popcorn with ticket'
          });
        }
        
        // Extract hall types to determine features
        const hallTypes = Object.values(c.halls || {}).map(h => h.hall?.type).filter(Boolean);
        const has3D = hallTypes.some(t => t?.includes('3D'));
        const hasIMAX = hallTypes.some(t => t?.includes('IMAX'));
        const hasGoldClass = hallTypes.some(t => t?.includes('GOLD'));
        
        // Combine cinema amenities with hall features
        const allFeatures = [...(c.cinema.amenities || [])];
        if (has3D && !allFeatures.includes('3D')) allFeatures.push('3D');
        if (hasIMAX && !allFeatures.includes('IMAX')) allFeatures.push('IMAX');
        if (hasGoldClass && !allFeatures.includes('Gold Class')) allFeatures.push('Gold Class');
        
        return {
          id: c.cinema._id,
          name: c.cinema.name,
          location: c.cinema.location,
          type: cinemaType,
          pricing: {
            basePrice: minPrice, // Use minimum price for better comparison
            weekendPrice: avgPrice + 50
          },
          discounts: discountDays,
          membershipBenefits: {
            silver: 10,
            gold: 15,
            platinum: 20
          },
          earlyBirdDiscount: 15,
          activePromotions: [], // Will be enhanced with real promotion data
          foodOffers: foodOffers,
          features: allFeatures,
          rating: c.cinema.rating || 4.0,
          totalReviews: 100,
          // Additional metadata for better recommendations
          availableSeats: allShowtimes.reduce((sum, s) => sum + (s.availableSeats || 0), 0),
          totalShowtimes: allShowtimes.length,
          distance: c.cinema.distance
        };
      });

      // Prepare user context
      const userContext = {
        userId: user?.id || 'guest',
        isStudent: user?.isStudent || false,
        gender: user?.gender || 'male',
        membership: user?.membership || null,
        favoriteCinemas: user?.favoriteCinemas || [],
        bookingHistory: user?.bookingHistory || [],
        preferences: {
          cinemaType: 'standard',
          priceRange: 'affordable'
        }
      };

      // Prepare booking context
      const bookingContext = {
        date: selectedDate.fullDate,
        time: '18:00',
        seats: 1,
        movie: 'Current Movie'
      };

      const response = await fetch('http://localhost:5000/api/recommendations/cinema-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cinemas: cinemaData,
          userContext,
          bookingContext
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recommendations-loading">
        <div className="loading-spinner"></div>
        <p>Finding best deals for you...</p>
      </div>
    );
  }

  if (!recommendations || !recommendations.bestChoice) {
    return null;
  }

  const bestChoice = recommendations.bestChoice;

  return (
    <div className="cinema-recommendations">
      {/* Best Deal Banner */}
      <div className="best-deal-banner">
        <div className="banner-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700"/>
          </svg>
        </div>
        <div className="banner-content">
          <div className="banner-badge">
            <span className={`badge badge-${bestChoice.badge.color}`}>
              {bestChoice.badge.text}
            </span>
          </div>
          <h3 className="banner-title">
            {bestChoice.cinema.name} - Best Choice for You!
          </h3>
          <p className="banner-message">{recommendations.message}</p>
          <div className="banner-highlights">
            {bestChoice.savings > 0 && (
              <div className="highlight savings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Save Rs. {bestChoice.savings}</span>
              </div>
            )}
            <div className="highlight price">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Rs. {bestChoice.finalPrice} per ticket</span>
            </div>
            <div className="highlight score">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Score: {bestChoice.score}/100</span>
            </div>
          </div>
          {bestChoice.reasons && bestChoice.reasons.length > 0 && (
            <div className="banner-reasons">
              {bestChoice.reasons.map((reason, index) => (
                <div key={index} className="reason-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="#4CAF50" strokeWidth="2"/>
                  </svg>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button 
          className="view-comparison-btn"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide' : 'Compare All'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d={showComparison ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"} stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      {/* Comparison Table */}
      {showComparison && (
        <div className="comparison-table-container">
          <h4 className="comparison-title">Cinema Comparison</h4>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Cinema</th>
                  <th>Score</th>
                  <th>Price</th>
                  <th>Savings</th>
                  <th>Top Offers</th>
                  <th>Badge</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.comparisonMatrix.map((cinema, index) => (
                  <tr key={index} className={index === 0 ? 'best-choice-row' : ''}>
                    <td className="cinema-name-cell">
                      {index === 0 && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" className="crown-icon">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                      )}
                      {cinema.name}
                    </td>
                    <td className="score-cell">
                      <div className="score-bar">
                        <div 
                          className="score-fill" 
                          style={{ width: `${cinema.score}%` }}
                        ></div>
                        <span className="score-text">{cinema.score}</span>
                      </div>
                    </td>
                    <td className="price-cell">Rs. {cinema.price}</td>
                    <td className="savings-cell">
                      {cinema.savings > 0 ? (
                        <span className="savings-amount">Rs. {cinema.savings}</span>
                      ) : (
                        <span className="no-savings">-</span>
                      )}
                    </td>
                    <td className="offers-cell">
                      {cinema.topReasons && cinema.topReasons.length > 0 ? (
                        <div className="offers-list">
                          {cinema.topReasons.map((reason, i) => (
                            <span key={i} className="offer-tag">{reason}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="no-offers">No special offers</span>
                      )}
                    </td>
                    <td className="badge-cell">
                      <span className={`table-badge badge-${cinema.badge.color}`}>
                        {cinema.badge.text}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
