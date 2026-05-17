import { BADGE_TYPES } from './comparisonTypes';

/**
 * Determine which badge to display based on score breakdown
 * @param {Object} scoreBreakdown - Breakdown of score components
 * @param {number} scoreBreakdown.price - Price component contribution
 * @param {number} scoreBreakdown.rating - Rating component contribution
 * @param {number} scoreBreakdown.distance - Distance component contribution
 * @param {number} scoreBreakdown.amenities - Amenities component contribution
 * @returns {string} Badge type
 */
export function determineBadgeType(scoreBreakdown) {
  if (!scoreBreakdown) {
    return BADGE_TYPES.BEST_VALUE; // Default
  }
  
  const { price, rating, distance, amenities } = scoreBreakdown;
  
  // Find which component contributed most to the score
  const contributions = {
    price: price || 0,
    rating: rating || 0,
    distance: distance || 0,
    amenities: amenities || 0
  };
  
  const maxContribution = Math.max(...Object.values(contributions));
  
  // Determine badge based on dominant factor
  if (contributions.price === maxContribution) {
    return BADGE_TYPES.BEST_VALUE;
  } else if (contributions.distance === maxContribution) {
    return BADGE_TYPES.CLOSEST;
  } else if (contributions.rating === maxContribution) {
    return BADGE_TYPES.TOP_RATED;
  }
  
  // Default to Best Value if tie or unclear
  return BADGE_TYPES.BEST_VALUE;
}

/**
 * Get badge color class based on badge type
 * @param {string} badgeType - Badge type
 * @returns {string} CSS class name
 */
export function getBadgeColorClass(badgeType) {
  switch (badgeType) {
    case BADGE_TYPES.BEST_VALUE:
      return 'badge-gold';
    case BADGE_TYPES.CLOSEST:
      return 'badge-blue';
    case BADGE_TYPES.TOP_RATED:
      return 'badge-green';
    default:
      return 'badge-gold';
  }
}
