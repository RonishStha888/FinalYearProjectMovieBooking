import { useState, useEffect } from 'react';
import './ComparisonModal.css';
import BestPickCard from './BestPickCard';
import ComparisonTable from './ComparisonTable';
import MobileComparisonCards from './MobileComparisonCards';
import { parseDistance, calculateAllScores } from '../utils/scoringAlgorithm';
import { determineBadgeType } from '../utils/badgeLogic';
import { generateExplanation, generateReasons } from '../utils/explanationGenerator';

/**
 * ComparisonModal Component
 * Full-screen modal displaying cinema comparison with recommendations
 * 
 * @param {Object} props
 * @param {Array} props.cinemas - Array of cinema data from showtimes
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 */
export default function ComparisonModal({ cinemas, isOpen, onClose }) {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && cinemas && cinemas.length >= 2) {
      calculateComparison();
    }
  }, [isOpen, cinemas]);

  const calculateComparison = () => {
    setLoading(true);
    
    try {
      // Transform cinema data for comparison
      const transformedCinemas = cinemas.map(cinemaData => {
        // Extract all showtimes across all halls
        const allShowtimes = Object.values(cinemaData.halls || {}).flatMap(hall => hall.showtimes || []);
        
        // Get prices
        const prices = allShowtimes.map(s => s.price).filter(p => p > 0);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 500;
        const originalPrice = allShowtimes[0]?.originalPrice || minPrice;
        
        // Get formats from hall types
        const hallTypes = Object.values(cinemaData.halls || {}).map(h => h.hall?.type).filter(Boolean);
        const formats = [...new Set(hallTypes)]; // Unique formats
        
        // Get seat availability
        const totalAvailable = allShowtimes.reduce((sum, s) => sum + (s.availableSeats || 0), 0);
        const totalSeats = Object.values(cinemaData.halls || {}).reduce((sum, h) => sum + (h.hall?.totalSeats || 0), 0);
        
        return {
          cinema: cinemaData.cinema,
          formats: formats,
          ticketPrice: {
            original: originalPrice,
            discounted: minPrice < originalPrice ? minPrice : null
          },
          seatAvailability: {
            available: totalAvailable,
            total: totalSeats
          },
          activeOffers: [], // Can be enhanced with real offer data
          distanceKm: parseDistance(cinemaData.cinema.distance),
          amenitiesCount: cinemaData.cinema.amenities?.length || 0
        };
      });
      
      // Calculate scores for all cinemas
      const cinemasWithScores = calculateAllScores(transformedCinemas);
      
      // Sort by score (highest first)
      const sortedCinemas = [...cinemasWithScores].sort((a, b) => b.recommendationScore - a.recommendationScore);
      
      // Get best pick
      const bestPick = sortedCinemas[0];
      const badgeType = determineBadgeType(bestPick.scoreBreakdown);
      const explanation = generateExplanation(bestPick, badgeType);
      const reasons = generateReasons(bestPick, bestPick.componentScores);
      
      setComparisonData({
        cinemas: sortedCinemas,
        bestPick: {
          cinema: bestPick,
          score: bestPick.recommendationScore,
          badge: badgeType,
          explanation: explanation,
          reasons: reasons
        }
      });
    } catch (error) {
      console.error('Error calculating comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="comparison-modal-overlay" onClick={onClose}>
      <div className="comparison-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-modal-header">
          <h2 className="comparison-modal-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Cinema Comparison
          </h2>
          <button className="comparison-modal-close" onClick={onClose} aria-label="Close comparison">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="comparison-modal-body">
          {loading ? (
            <div className="comparison-loading">
              <div className="loading-spinner"></div>
              <p>Analyzing cinemas...</p>
            </div>
          ) : comparisonData ? (
            <>
              <BestPickCard
                cinema={comparisonData.bestPick.cinema}
                score={comparisonData.bestPick.score}
                badge={comparisonData.bestPick.badge}
                explanation={comparisonData.bestPick.explanation}
                reasons={comparisonData.bestPick.reasons}
              />
              
              <div className="comparison-results-section">
                <h3 className="results-section-title">Detailed Comparison</h3>
                
                {/* Desktop Table */}
                <div className="desktop-comparison">
                  <ComparisonTable
                    cinemas={comparisonData.cinemas}
                    bestPickId={comparisonData.bestPick.cinema.cinema._id}
                  />
                </div>
                
                {/* Mobile Cards */}
                <div className="mobile-comparison">
                  <MobileComparisonCards
                    cinemas={comparisonData.cinemas}
                    bestPickId={comparisonData.bestPick.cinema.cinema._id}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="comparison-error">
              <p>Unable to compare cinemas. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
