import { BADGE_TYPES } from './comparisonTypes';

/**
 * Generate human-readable explanation for why a cinema was recommended
 * @param {Object} cinema - Cinema comparison data with scores
 * @param {string} badgeType - Badge type assigned
 * @returns {string} Human-readable explanation
 */
export function generateExplanation(cinema, badgeType) {
  if (!cinema || !cinema.cinema) {
    return 'This cinema offers a great overall experience.';
  }
  
  const name = cinema.cinema.name;
  const price = cinema.ticketPrice.discounted || cinema.ticketPrice.original;
  const rating = cinema.cinema.rating;
  const distance = cinema.cinema.distance;
  
  let explanation = `${name} is the best pick`;
  
  // Add specific reason based on badge type
  switch (badgeType) {
    case BADGE_TYPES.BEST_VALUE:
      explanation += ` — lowest price at Rs. ${price}`;
      if (rating >= 4.0) {
        explanation += ` with a ${rating} rating`;
      }
      break;
      
    case BADGE_TYPES.CLOSEST:
      explanation += ` — closest location at ${distance}`;
      if (rating >= 4.0) {
        explanation += ` with a ${rating} rating`;
      }
      break;
      
    case BADGE_TYPES.TOP_RATED:
      explanation += ` — highest rating at ${rating} stars`;
      if (price) {
        explanation += ` for Rs. ${price}`;
      }
      break;
      
    default:
      explanation += ` — great overall value`;
  }
  
  return explanation;
}

/**
 * Generate list of reasons for recommendation
 * @param {Object} cinema - Cinema comparison data with scores
 * @param {Object} componentScores - Individual component scores
 * @returns {string[]} Array of reason strings
 */
export function generateReasons(cinema, componentScores) {
  if (!cinema || !componentScores) {
    return [];
  }
  
  const reasons = [];
  const price = cinema.ticketPrice.discounted || cinema.ticketPrice.original;
  
  // Add reasons based on high component scores (above 70)
  if (componentScores.price > 70) {
    if (cinema.ticketPrice.discounted) {
      const savings = cinema.ticketPrice.original - cinema.ticketPrice.discounted;
      reasons.push(`Save Rs. ${savings} with discounted price`);
    } else {
      reasons.push(`Competitive pricing at Rs. ${price}`);
    }
  }
  
  if (componentScores.rating > 70 && cinema.cinema.rating >= 4.0) {
    reasons.push(`Highly rated at ${cinema.cinema.rating} stars`);
  }
  
  if (componentScores.distance > 70) {
    reasons.push(`Conveniently located at ${cinema.cinema.distance}`);
  }
  
  if (componentScores.amenities > 70 && cinema.amenitiesCount > 0) {
    reasons.push(`${cinema.amenitiesCount} premium amenities available`);
  }
  
  // Add format-specific reasons
  if (cinema.formats && cinema.formats.length > 0) {
    const premiumFormats = cinema.formats.filter(f => 
      f.includes('IMAX') || f.includes('Dolby') || f.includes('3D')
    );
    if (premiumFormats.length > 0) {
      reasons.push(`${premiumFormats.join(', ')} available`);
    }
  }
  
  // Add offer-specific reasons
  if (cinema.activeOffers && cinema.activeOffers.length > 0) {
    cinema.activeOffers.slice(0, 2).forEach(offer => {
      reasons.push(offer.description);
    });
  }
  
  return reasons.slice(0, 5); // Limit to top 5 reasons
}
