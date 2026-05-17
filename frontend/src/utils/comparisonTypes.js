/**
 * Cinema Comparison Data Types
 * Type definitions for the cinema comparison feature
 */

/**
 * @typedef {Object} Cinema
 * @property {string} _id - Cinema ID
 * @property {string} name - Cinema name
 * @property {string} location - Cinema location
 * @property {string} distance - Distance from user (e.g., "2.5 km")
 * @property {number} rating - Star rating
 * @property {string[]} amenities - List of amenities
 */

/**
 * @typedef {Object} TicketPrice
 * @property {number} original - Original ticket price
 * @property {number} [discounted] - Discounted price (optional)
 */

/**
 * @typedef {Object} SeatAvailability
 * @property {number} available - Number of available seats
 * @property {number} total - Total number of seats
 */

/**
 * @typedef {Object} Offer
 * @property {string} id - Offer ID
 * @property {string} description - Offer description (e.g., "Free popcorn with ticket")
 * @property {'discount'|'freebie'|'upgrade'} type - Type of offer
 */

/**
 * @typedef {Object} CinemaComparisonData
 * @property {Cinema} cinema - Cinema information
 * @property {string[]} formats - Available formats (2D, 3D, IMAX, Dolby Atmos)
 * @property {TicketPrice} ticketPrice - Ticket pricing information
 * @property {SeatAvailability} seatAvailability - Seat availability
 * @property {Offer[]} activeOffers - Active offers and perks
 * @property {number} distanceKm - Parsed numeric distance for scoring
 * @property {number} amenitiesCount - Number of amenities
 * @property {number} recommendationScore - Calculated recommendation score
 */

/**
 * @typedef {Object} BestPick
 * @property {string} cinemaId - ID of the best cinema
 * @property {number} score - Recommendation score
 * @property {'Best Value'|'Closest'|'Top Rated'} badge - Badge type
 * @property {string} explanation - Human-readable explanation
 * @property {string[]} reasons - List of reasons for recommendation
 */

/**
 * @typedef {Object} RecommendationResult
 * @property {BestPick} bestPick - Best cinema recommendation
 * @property {CinemaComparisonData[]} rankings - Ranked list of cinemas
 */

/**
 * @typedef {Object} WeightedScoreFactors
 * @property {number} priceWeight - Weight for price (0.40)
 * @property {number} ratingWeight - Weight for rating (0.25)
 * @property {number} distanceWeight - Weight for distance (0.20)
 * @property {number} amenitiesWeight - Weight for amenities (0.15)
 */

export const SCORE_WEIGHTS = {
  priceWeight: 0.40,
  ratingWeight: 0.25,
  distanceWeight: 0.20,
  amenitiesWeight: 0.15
};

export const BADGE_TYPES = {
  BEST_VALUE: 'Best Value',
  CLOSEST: 'Closest',
  TOP_RATED: 'Top Rated'
};
