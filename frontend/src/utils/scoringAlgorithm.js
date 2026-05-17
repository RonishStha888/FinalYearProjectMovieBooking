import { SCORE_WEIGHTS } from './comparisonTypes';

/**
 * Parse distance string to numeric kilometers
 * @param {string} distanceStr - Distance string (e.g., "2.5 km", "500 m")
 * @returns {number} Distance in kilometers
 */
export function parseDistance(distanceStr) {
  if (!distanceStr || typeof distanceStr !== 'string') {
    return 999; // Default to large distance if invalid
  }

  const cleaned = distanceStr.toLowerCase().trim();
  
  // Handle kilometers
  if (cleaned.includes('km')) {
    const match = cleaned.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 999;
  }
  
  // Handle meters
  if (cleaned.includes('m')) {
    const match = cleaned.match(/(\d+)/);
    return match ? parseFloat(match[1]) / 1000 : 999;
  }
  
  return 999; // Default if format not recognized
}

/**
 * Normalize a value to 0-100 scale
 * @param {number} value - Value to normalize
 * @param {number} min - Minimum value in dataset
 * @param {number} max - Maximum value in dataset
 * @param {boolean} inverse - If true, lower values get higher scores
 * @returns {number} Normalized score (0-100)
 */
function normalize(value, min, max, inverse = false) {
  if (max === min) return 50; // If all values are the same, return middle score
  
  const normalized = ((value - min) / (max - min)) * 100;
  return inverse ? 100 - normalized : normalized;
}

/**
 * Calculate price component score (40% weight, lower is better)
 * @param {number} price - Cinema ticket price
 * @param {number} minPrice - Minimum price in dataset
 * @param {number} maxPrice - Maximum price in dataset
 * @returns {number} Price score (0-100)
 */
function calculatePriceScore(price, minPrice, maxPrice) {
  return normalize(price, minPrice, maxPrice, true); // Inverse: lower price = higher score
}

/**
 * Calculate rating component score (25% weight, higher is better)
 * @param {number} rating - Cinema rating
 * @param {number} minRating - Minimum rating in dataset
 * @param {number} maxRating - Maximum rating in dataset
 * @returns {number} Rating score (0-100)
 */
function calculateRatingScore(rating, minRating, maxRating) {
  return normalize(rating, minRating, maxRating, false); // Higher rating = higher score
}

/**
 * Calculate distance component score (20% weight, closer is better)
 * @param {number} distance - Distance in km
 * @param {number} minDistance - Minimum distance in dataset
 * @param {number} maxDistance - Maximum distance in dataset
 * @returns {number} Distance score (0-100)
 */
function calculateDistanceScore(distance, minDistance, maxDistance) {
  return normalize(distance, minDistance, maxDistance, true); // Inverse: closer = higher score
}

/**
 * Calculate amenities component score (15% weight, more is better)
 * @param {number} amenitiesCount - Number of amenities
 * @param {number} minAmenities - Minimum amenities in dataset
 * @param {number} maxAmenities - Maximum amenities in dataset
 * @returns {number} Amenities score (0-100)
 */
function calculateAmenitiesScore(amenitiesCount, minAmenities, maxAmenities) {
  return normalize(amenitiesCount, minAmenities, maxAmenities, false); // More amenities = higher score
}

/**
 * Calculate weighted recommendation score for a cinema
 * @param {Object} cinema - Cinema data
 * @param {Object} ranges - Min/max ranges for normalization
 * @returns {Object} Score breakdown and total
 */
export function calculateRecommendationScore(cinema, ranges) {
  const priceScore = calculatePriceScore(
    cinema.ticketPrice.discounted || cinema.ticketPrice.original,
    ranges.minPrice,
    ranges.maxPrice
  );
  
  const ratingScore = calculateRatingScore(
    cinema.cinema.rating,
    ranges.minRating,
    ranges.maxRating
  );
  
  const distanceScore = calculateDistanceScore(
    cinema.distanceKm,
    ranges.minDistance,
    ranges.maxDistance
  );
  
  const amenitiesScore = calculateAmenitiesScore(
    cinema.amenitiesCount,
    ranges.minAmenities,
    ranges.maxAmenities
  );
  
  // Calculate weighted total
  const totalScore = Math.round(
    (priceScore * SCORE_WEIGHTS.priceWeight) +
    (ratingScore * SCORE_WEIGHTS.ratingWeight) +
    (distanceScore * SCORE_WEIGHTS.distanceWeight) +
    (amenitiesScore * SCORE_WEIGHTS.amenitiesWeight)
  );
  
  // Clamp score to 0-100 range
  const clampedScore = Math.max(0, Math.min(100, totalScore));
  
  return {
    priceScore,
    ratingScore,
    distanceScore,
    amenitiesScore,
    totalScore: clampedScore,
    breakdown: {
      price: priceScore * SCORE_WEIGHTS.priceWeight,
      rating: ratingScore * SCORE_WEIGHTS.ratingWeight,
      distance: distanceScore * SCORE_WEIGHTS.distanceWeight,
      amenities: amenitiesScore * SCORE_WEIGHTS.amenitiesWeight
    }
  };
}

/**
 * Calculate scores for all cinemas in comparison
 * @param {Array} cinemas - Array of cinema comparison data
 * @returns {Array} Cinemas with calculated scores
 */
export function calculateAllScores(cinemas) {
  if (!cinemas || cinemas.length === 0) {
    return [];
  }
  
  // Calculate ranges for normalization
  const prices = cinemas.map(c => c.ticketPrice.discounted || c.ticketPrice.original);
  const ratings = cinemas.map(c => c.cinema.rating);
  const distances = cinemas.map(c => c.distanceKm);
  const amenitiesCounts = cinemas.map(c => c.amenitiesCount);
  
  const ranges = {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    minRating: Math.min(...ratings),
    maxRating: Math.max(...ratings),
    minDistance: Math.min(...distances),
    maxDistance: Math.max(...distances),
    minAmenities: Math.min(...amenitiesCounts),
    maxAmenities: Math.max(...amenitiesCounts)
  };
  
  // Calculate scores for each cinema
  return cinemas.map(cinema => {
    const scoreData = calculateRecommendationScore(cinema, ranges);
    return {
      ...cinema,
      recommendationScore: scoreData.totalScore,
      scoreBreakdown: scoreData.breakdown,
      componentScores: {
        price: scoreData.priceScore,
        rating: scoreData.ratingScore,
        distance: scoreData.distanceScore,
        amenities: scoreData.amenitiesScore
      }
    };
  });
}
