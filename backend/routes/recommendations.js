import express from 'express';
import recommendationService from '../services/recommendationService.js';
import Cinema from '../models/Cinema.js';
import Hall from '../models/Hall.js';
import Showtime from '../models/Showtime.js';
import Promotion from '../models/Promotion.js';
const router = express.Router();

/**
 * POST /api/recommendations/cinema-recommendations-enhanced
 * Get cinema recommendations with real promotion data from admin panel
 */
router.post('/cinema-recommendations-enhanced', async (req, res) => {
  try {
    const { cinemaIds, userContext, bookingContext } = req.body;

    if (!cinemaIds || !Array.isArray(cinemaIds) || cinemaIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of cinema IDs'
      });
    }

    // Fetch real cinema data from database
    const cinemas = await Cinema.find({ _id: { $in: cinemaIds }, isActive: true });
    
    // Fetch active promotions for these cinemas
    const now = new Date();
    const activePromotions = await Promotion.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { applicableCinemas: { $in: cinemaIds } },
        { applicableCinemas: { $size: 0 } } // Global promotions
      ]
    });

    // Fetch halls for each cinema
    const enrichedCinemas = await Promise.all(
      cinemas.map(async (cinema) => {
        const halls = await Hall.find({ cinemaId: cinema._id, isActive: true });
        
        // Get cinema-specific promotions
        const cinemaPromotions = activePromotions.filter(promo => 
          promo.applicableCinemas.length === 0 || 
          promo.applicableCinemas.some(id => id.toString() === cinema._id.toString())
        );

        // Determine cinema type based on amenities
        let cinemaType = 'standard';
        if (cinema.amenities?.includes('IMAX')) cinemaType = 'premium';
        else if (cinema.amenities?.includes('Dolby Atmos')) cinemaType = 'premium';
        
        // Calculate average pricing from halls
        const avgBasePrice = halls.length > 0 
          ? Math.round(halls.reduce((sum, h) => sum + h.pricing.basePrice, 0) / halls.length)
          : 500;
        
        const avgWeekendPrice = halls.length > 0
          ? Math.round(halls.reduce((sum, h) => sum + h.pricing.weekendPrice, 0) / halls.length)
          : 550;

        // Set up discount days (customize based on your business rules)
        const discountDays = ['monday', 'wednesday', 'friday'];
        
        // Set up food offers based on amenities
        const foodOffers = [];
        if (cinema.amenities?.includes('Food Court')) {
          foodOffers.push({
            active: true,
            type: 'free_item',
            item: 'Popcorn',
            value: 150,
            description: 'Free popcorn with ticket'
          });
        }

        // Format promotions for recommendation engine
        const formattedPromotions = cinemaPromotions.map(promo => ({
          name: promo.title,
          type: promo.type,
          value: promo.value,
          startDate: promo.validFrom,
          endDate: promo.validUntil,
          description: promo.description
        }));

        return {
          id: cinema._id,
          _id: cinema._id,
          name: cinema.name,
          location: cinema.location,
          type: cinemaType,
          pricing: {
            basePrice: avgBasePrice,
            weekendPrice: avgWeekendPrice
          },
          discounts: discountDays,
          membershipBenefits: {
            silver: 10,
            gold: 15,
            platinum: 20
          },
          earlyBirdDiscount: 15,
          activePromotions: formattedPromotions,
          foodOffers: foodOffers,
          features: cinema.amenities || [],
          rating: cinema.rating || 4.0,
          totalReviews: 100
        };
      })
    );

    // Get recommendations using the service
    const recommendations = await recommendationService.getRecommendations(
      enrichedCinemas,
      userContext || {},
      bookingContext || {}
    );

    res.json({
      success: true,
      recommendations: recommendations.recommendations,
      bestChoice: recommendations.bestChoice,
      comparisonMatrix: recommendations.comparisonMatrix,
      message: recommendationService.getRecommendationMessage(recommendations.bestChoice)
    });

  } catch (error) {
    console.error('Enhanced recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
});

/**
 * GET /api/recommendations
 * Get cinema recommendations based on user context and booking details
 */
router.post('/cinema-recommendations', async (req, res) => {
  try {
    const { cinemas, userContext, bookingContext } = req.body;

    if (!cinemas || !Array.isArray(cinemas) || cinemas.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of cinemas to compare'
      });
    }

    const recommendations = await recommendationService.getRecommendations(
      cinemas,
      userContext || {},
      bookingContext || {}
    );

    res.json({
      success: true,
      recommendations: recommendations.recommendations,
      bestChoice: recommendations.bestChoice,
      comparisonMatrix: recommendations.comparisonMatrix,
      message: recommendationService.getRecommendationMessage(recommendations.bestChoice)
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
});

/**
 * GET /api/recommendations/best-deal
 * Get the single best cinema deal
 */
router.post('/best-deal', async (req, res) => {
  try {
    const { cinemas, userContext, bookingContext } = req.body;

    const recommendations = await recommendationService.getRecommendations(
      cinemas,
      userContext || {},
      bookingContext || {}
    );

    res.json({
      success: true,
      bestDeal: recommendations.bestChoice,
      message: recommendationService.getRecommendationMessage(recommendations.bestChoice)
    });

  } catch (error) {
    console.error('Best deal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find best deal',
      error: error.message
    });
  }
});

export default router;
