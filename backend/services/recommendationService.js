/**
 * Cinema Recommendation Service
 * Intelligent system to suggest the best cinema option based on multiple factors
 */

class CinemaRecommendationService {
  constructor() {
    // Configurable weights for different factors (total = 100)
    this.weights = {
      price: 35,              // Base ticket price importance
      discounts: 25,          // Discount availability
      promotions: 20,         // Active promotions
      foodOffers: 15,         // Food & beverage deals
      amenities: 5            // Cinema quality/features
    };

    // Day-based discount rules
    this.discountRules = {
      monday: { name: 'Monday Madness', discount: 20 },
      tuesday: { name: 'Student Tuesday', discount: 25, requiresStudent: true },
      wednesday: { name: 'Midweek Special', discount: 15 },
      thursday: { name: 'Ladies Night', discount: 20, requiresGender: 'female' },
      friday: { name: 'Weekend Kickoff', discount: 10 },
      saturday: { name: 'Family Day', discount: 15, requiresMultipleTickets: 3 },
      sunday: { name: 'Sunday Funday', discount: 10 }
    };
  }

  /**
   * Main recommendation function
   * @param {Array} cinemas - List of available cinemas with their details
   * @param {Object} userContext - User information and preferences
   * @param {Object} bookingContext - Booking details (date, time, seats)
   * @returns {Object} Ranked recommendations with scores and reasons
   */
  async getRecommendations(cinemas, userContext = {}, bookingContext = {}) {
    const scoredCinemas = [];

    for (const cinema of cinemas) {
      const score = await this.calculateCinemaScore(cinema, userContext, bookingContext, cinemas);
      scoredCinemas.push({
        cinema,
        score: score.totalScore,
        breakdown: score.breakdown,
        reasons: score.reasons,
        savings: score.savings,
        finalPrice: score.finalPrice,
        basePrice: score.basePrice,
        badge: this.getBadge(score)
      });
    }

    // Sort by score (highest first)
    scoredCinemas.sort((a, b) => b.score - a.score);

    return {
      recommendations: scoredCinemas,
      bestChoice: scoredCinemas[0],
      comparisonMatrix: this.generateComparisonMatrix(scoredCinemas)
    };
  }

  /**
   * Calculate comprehensive score for a cinema
   */
  async calculateCinemaScore(cinema, userContext, bookingContext, allCinemas = []) {
    const breakdown = {};
    const reasons = [];
    let totalSavings = 0;

    // 1. Price Score (35 points) - now uses relative comparison
    const priceScore = this.calculatePriceScore(cinema, bookingContext, allCinemas);
    breakdown.price = priceScore;

    // 2. Discount Score (25 points)
    const discountScore = this.calculateDiscountScore(cinema, userContext, bookingContext);
    breakdown.discounts = discountScore.score;
    totalSavings += discountScore.savings;
    if (discountScore.reason) reasons.push(discountScore.reason);

    // 3. Promotion Score (20 points)
    const promotionScore = this.calculatePromotionScore(cinema, bookingContext);
    breakdown.promotions = promotionScore.score;
    totalSavings += promotionScore.savings;
    if (promotionScore.reason) reasons.push(promotionScore.reason);

    // 4. Food Offer Score (15 points)
    const foodScore = this.calculateFoodOfferScore(cinema, bookingContext);
    breakdown.foodOffers = foodScore.score;
    totalSavings += foodScore.savings;
    if (foodScore.reason) reasons.push(foodScore.reason);

    // 5. Amenities Score (5 points)
    const amenitiesScore = this.calculateAmenitiesScore(cinema);
    breakdown.amenities = amenitiesScore;

    // Calculate total score
    const totalScore = 
      (priceScore.score * this.weights.price / 100) +
      (discountScore.score * this.weights.discounts / 100) +
      (promotionScore.score * this.weights.promotions / 100) +
      (foodScore.score * this.weights.foodOffers / 100) +
      (amenitiesScore * this.weights.amenities / 100);

    // Apply personalization bonus
    const personalizedScore = this.applyPersonalization(
      totalScore, 
      cinema, 
      userContext
    );

    // Calculate final price after all discounts
    const basePrice = cinema.pricing?.basePrice || 500;
    const finalPrice = Math.max(0, basePrice - totalSavings);

    return {
      totalScore: Math.round(personalizedScore * 10) / 10,
      breakdown,
      reasons,
      savings: totalSavings,
      finalPrice,
      basePrice
    };
  }

  /**
   * Calculate price competitiveness score
   * Now uses relative pricing - compares against other cinemas
   */
  calculatePriceScore(cinema, bookingContext, allCinemas = []) {
    const basePrice = cinema.pricing?.basePrice || 500;
    const seats = bookingContext.seats || 1;
    
    // If we have multiple cinemas, use relative pricing
    if (allCinemas.length > 1) {
      const allPrices = allCinemas.map(c => c.pricing?.basePrice || 500);
      const minPrice = Math.min(...allPrices);
      const maxPrice = Math.max(...allPrices);
      const priceRange = maxPrice - minPrice;
      
      // If all prices are the same, give everyone a good score
      if (priceRange === 0) {
        return {
          score: 80,
          basePrice,
          totalPrice: basePrice * seats
        };
      }
      
      // Calculate relative score (cheaper = higher score)
      // Cheapest gets 100, most expensive gets 20
      const relativePosition = (basePrice - minPrice) / priceRange;
      const score = Math.round(100 - (relativePosition * 80));
      
      return {
        score,
        basePrice,
        totalPrice: basePrice * seats
      };
    }
    
    // Fallback to absolute price ranges if only one cinema
    const priceRanges = {
      budget: { max: 400, score: 100 },
      affordable: { max: 600, score: 80 },
      standard: { max: 800, score: 60 },
      premium: { max: 1000, score: 40 },
      luxury: { max: Infinity, score: 20 }
    };

    let score = 20; // Default for luxury
    for (const [range, config] of Object.entries(priceRanges)) {
      if (basePrice <= config.max) {
        score = config.score;
        break;
      }
    }

    return {
      score,
      basePrice,
      totalPrice: basePrice * seats
    };
  }

  /**
   * Calculate discount availability score
   */
  calculateDiscountScore(cinema, userContext, bookingContext) {
    let score = 0;
    let savings = 0;
    let reason = null;

    const bookingDate = new Date(bookingContext.date || Date.now());
    const dayName = bookingDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Check day-based discounts
    const dayDiscount = this.discountRules[dayName];
    if (dayDiscount && cinema.discounts?.includes(dayName)) {
      // Validate special conditions
      let eligible = true;
      
      if (dayDiscount.requiresStudent && !userContext.isStudent) {
        eligible = false;
      }
      if (dayDiscount.requiresGender && userContext.gender !== dayDiscount.requiresGender) {
        eligible = false;
      }
      if (dayDiscount.requiresMultipleTickets && 
          (bookingContext.seats || 1) < dayDiscount.requiresMultipleTickets) {
        eligible = false;
      }

      if (eligible) {
        score = 100;
        const basePrice = cinema.pricing?.basePrice || 500;
        savings = (basePrice * dayDiscount.discount / 100) * (bookingContext.seats || 1);
        reason = `${dayDiscount.name}: ${dayDiscount.discount}% off today!`;
      }
    }

    // Check membership discounts
    if (userContext.membership && cinema.membershipBenefits) {
      const memberDiscount = cinema.membershipBenefits[userContext.membership];
      if (memberDiscount) {
        score = Math.max(score, 80);
        const basePrice = cinema.pricing?.basePrice || 500;
        const memberSavings = (basePrice * memberDiscount / 100) * (bookingContext.seats || 1);
        savings += memberSavings;
        reason = reason 
          ? `${reason} + ${userContext.membership} member discount`
          : `${userContext.membership} member: ${memberDiscount}% off`;
      }
    }

    // Check early bird discounts
    if (cinema.earlyBirdDiscount && this.isEarlyBooking(bookingContext)) {
      score = Math.max(score, 60);
      const basePrice = cinema.pricing?.basePrice || 500;
      const earlyBirdSavings = (basePrice * cinema.earlyBirdDiscount / 100) * (bookingContext.seats || 1);
      savings += earlyBirdSavings;
      reason = reason 
        ? `${reason} + Early bird bonus`
        : `Early bird: ${cinema.earlyBirdDiscount}% off`;
    }

    return { score, savings, reason };
  }

  /**
   * Calculate active promotions score
   */
  calculatePromotionScore(cinema, bookingContext) {
    let score = 0;
    let savings = 0;
    let reason = null;

    if (!cinema.activePromotions || cinema.activePromotions.length === 0) {
      return { score: 0, savings: 0, reason: null };
    }

    const currentDate = new Date();
    const basePrice = cinema.pricing?.basePrice || 500;
    const seats = bookingContext.seats || 1;

    for (const promo of cinema.activePromotions) {
      const promoStart = new Date(promo.startDate);
      const promoEnd = new Date(promo.endDate);

      // Check if promotion is active
      if (currentDate >= promoStart && currentDate <= promoEnd) {
        if (promo.type === 'percentage') {
          score = Math.max(score, 100);
          savings += (basePrice * promo.value / 100) * seats;
          reason = `${promo.name}: ${promo.value}% off`;
        } else if (promo.type === 'fixed') {
          score = Math.max(score, 90);
          savings += promo.value * seats;
          reason = `${promo.name}: Rs. ${promo.value} off per ticket`;
        } else if (promo.type === 'bogo') {
          if (seats >= 2) {
            score = Math.max(score, 100);
            savings += basePrice * Math.floor(seats / 2);
            reason = `${promo.name}: Buy 1 Get 1 Free!`;
          }
        }
      }
    }

    return { score, savings, reason };
  }

  /**
   * Calculate food & beverage offers score
   */
  calculateFoodOfferScore(cinema, bookingContext) {
    let score = 0;
    let savings = 0;
    let reason = null;

    if (!cinema.foodOffers || cinema.foodOffers.length === 0) {
      return { score: 0, savings: 0, reason: null };
    }

    const seats = bookingContext.seats || 1;

    for (const offer of cinema.foodOffers) {
      if (offer.active) {
        if (offer.type === 'free_item') {
          score = Math.max(score, 100);
          savings += offer.value * seats;
          reason = `Free ${offer.item} with each ticket (worth Rs. ${offer.value})`;
        } else if (offer.type === 'combo_discount') {
          score = Math.max(score, 80);
          savings += offer.discount * seats;
          reason = `${offer.name}: Rs. ${offer.discount} off combo`;
        } else if (offer.type === 'percentage_off') {
          score = Math.max(score, 70);
          reason = `${offer.percentage}% off all food & beverages`;
        }
      }
    }

    return { score, savings, reason };
  }

  /**
   * Calculate amenities and quality score
   */
  calculateAmenitiesScore(cinema) {
    let score = 50; // Base score

    // Premium features
    if (cinema.features?.includes('IMAX')) score += 20;
    if (cinema.features?.includes('Dolby Atmos')) score += 15;
    if (cinema.features?.includes('4DX')) score += 15;
    if (cinema.features?.includes('Recliner Seats')) score += 10;
    if (cinema.features?.includes('VIP Lounge')) score += 10;
    if (cinema.features?.includes('Premium Parking')) score += 5;
    if (cinema.features?.includes('Online Food Order')) score += 5;

    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Apply personalization based on user history
   */
  applyPersonalization(baseScore, cinema, userContext) {
    let personalizedScore = baseScore;
    const bonusMultiplier = 1.1; // 10% bonus

    // Favorite cinema bonus
    if (userContext.favoriteCinemas?.includes(cinema._id || cinema.id)) {
      personalizedScore *= bonusMultiplier;
    }

    // Frequently visited cinema
    if (userContext.bookingHistory) {
      const visitCount = userContext.bookingHistory.filter(
        b => b.cinemaId === (cinema._id || cinema.id)
      ).length;
      
      if (visitCount >= 5) {
        personalizedScore *= 1.05; // 5% loyalty bonus
      }
    }

    // Preferred cinema type
    if (userContext.preferences?.cinemaType === cinema.type) {
      personalizedScore *= 1.03; // 3% preference bonus
    }

    return personalizedScore;
  }

  /**
   * Determine badge for cinema
   */
  getBadge(score) {
    if (score.savings >= 200) return { text: 'Best Value', color: 'gold' };
    if (score.reasons.length >= 3) return { text: 'Most Offers', color: 'purple' };
    if (score.totalScore >= 90) return { text: 'Top Pick', color: 'blue' };
    if (score.finalPrice < 400) return { text: 'Budget Friendly', color: 'green' };
    return { text: 'Recommended', color: 'gray' };
  }

  /**
   * Check if booking qualifies for early bird discount
   */
  isEarlyBooking(bookingContext) {
    if (!bookingContext.date) return false;
    
    const bookingDate = new Date(bookingContext.date);
    const today = new Date();
    const daysInAdvance = Math.floor((bookingDate - today) / (1000 * 60 * 60 * 24));
    
    return daysInAdvance >= 3; // 3+ days in advance
  }

  /**
   * Generate comprehensive comparison matrix for UI display
   */
  generateComparisonMatrix(scoredCinemas) {
    // Calculate relative metrics for better comparison
    const allPrices = scoredCinemas.map(sc => sc.finalPrice);
    const allSavings = scoredCinemas.map(sc => sc.savings);
    const minPrice = Math.min(...allPrices);
    const maxSavings = Math.max(...allSavings);

    return scoredCinemas.map((sc, index) => {
      // Calculate value rating (combination of price and savings)
      const priceRating = minPrice === sc.finalPrice ? 100 : Math.round((minPrice / sc.finalPrice) * 100);
      const savingsRating = maxSavings === 0 ? 0 : Math.round((sc.savings / maxSavings) * 100);
      const valueRating = Math.round((priceRating + savingsRating) / 2);

      // Determine if this is the best in specific categories
      const isCheapest = sc.finalPrice === minPrice;
      const hasMostSavings = sc.savings === maxSavings;
      const isTopRated = index === 0;

      return {
        name: sc.cinema.name,
        score: sc.score,
        price: sc.finalPrice,
        basePrice: sc.basePrice,
        savings: sc.savings,
        savingsPercentage: sc.basePrice > 0 ? Math.round((sc.savings / sc.basePrice) * 100) : 0,
        topReasons: sc.reasons.slice(0, 2),
        allReasons: sc.reasons,
        badge: sc.badge,
        breakdown: sc.breakdown,
        // Comparison metrics
        priceRating,
        savingsRating,
        valueRating,
        isCheapest,
        hasMostSavings,
        isTopRated,
        // Additional details
        features: sc.cinema.features || [],
        location: sc.cinema.location,
        type: sc.cinema.type,
        rank: index + 1
      };
    });
  }

  /**
   * Get personalized recommendation message
   */
  getRecommendationMessage(recommendation) {
    const { cinema, reasons, savings, finalPrice } = recommendation;
    
    let message = `${cinema.name} is your best choice! `;
    
    if (savings > 0) {
      message += `Save Rs. ${savings} `;
    }
    
    if (reasons.length > 0) {
      message += `with ${reasons.join(' and ')}.`;
    } else {
      message += `Great value at Rs. ${finalPrice} per ticket.`;
    }
    
    return message;
  }
}

export default new CinemaRecommendationService();
