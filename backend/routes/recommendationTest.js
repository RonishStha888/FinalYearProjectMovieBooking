import express from 'express';
import recommendationService from '../services/recommendationService.js';
import sampleData from '../data/sampleCinemaData.js';
const { sampleCinemas, sampleUserContexts, sampleBookingContexts } = sampleData;
const router = express.Router();

/**
 * GET /api/test/recommendations
 * Test the recommendation system with sample data
 */
router.get('/demo', async (req, res) => {
  try {
    const { userType, bookingType } = req.query;

    // Select user context
    const userContext = userType 
      ? sampleUserContexts[userType] 
      : sampleUserContexts.regularUser;

    // Select booking context
    const bookingContext = bookingType
      ? sampleBookingContexts[bookingType]
      : sampleBookingContexts.singleTicket;

    // Get recommendations
    const recommendations = await recommendationService.getRecommendations(
      sampleCinemas,
      userContext,
      bookingContext
    );

    res.json({
      success: true,
      testScenario: {
        userType: userType || 'regularUser',
        bookingType: bookingType || 'singleTicket',
        userContext,
        bookingContext
      },
      recommendations: recommendations.recommendations,
      bestChoice: recommendations.bestChoice,
      comparisonMatrix: recommendations.comparisonMatrix,
      message: recommendationService.getRecommendationMessage(recommendations.bestChoice)
    });

  } catch (error) {
    console.error('Test recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate test recommendations',
      error: error.message
    });
  }
});

/**
 * GET /api/test/recommendations/scenarios
 * Get all available test scenarios
 */
router.get('/scenarios', (req, res) => {
  res.json({
    success: true,
    availableScenarios: {
      userTypes: Object.keys(sampleUserContexts),
      bookingTypes: Object.keys(sampleBookingContexts)
    },
    exampleUsage: '/api/test/recommendations/demo?userType=studentUser&bookingType=coupleTickets'
  });
});

/**
 * POST /api/test/recommendations/custom
 * Test with custom cinema data
 */
router.post('/custom', async (req, res) => {
  try {
    const { cinemas, userContext, bookingContext } = req.body;

    const recommendations = await recommendationService.getRecommendations(
      cinemas || sampleCinemas,
      userContext || sampleUserContexts.regularUser,
      bookingContext || sampleBookingContexts.singleTicket
    );

    res.json({
      success: true,
      recommendations: recommendations.recommendations,
      bestChoice: recommendations.bestChoice,
      comparisonMatrix: recommendations.comparisonMatrix,
      message: recommendationService.getRecommendationMessage(recommendations.bestChoice)
    });

  } catch (error) {
    console.error('Custom recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate custom recommendations',
      error: error.message
    });
  }
});

export default router;
