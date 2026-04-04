import express from 'express';
import User from '../models/User.js';
import { 
  calculatePointsEarned, 
  getRedemptionOptions, 
  getTierInfo,
  awardPointsForBooking,
  redeemPointsForDiscount
} from '../services/loyaltyService.js';

const router = express.Router();

/**
 * Get user's loyalty points and tier info
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('name loyaltyPoints pointsHistory');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const tierInfo = getTierInfo(user.loyaltyPoints.tier);
    const redemptionOptions = getRedemptionOptions(user.loyaltyPoints.available);

    res.json({
      success: true,
      loyaltyPoints: user.loyaltyPoints,
      tierInfo,
      redemptionOptions,
      recentHistory: user.pointsHistory.slice(-10).reverse()
    });

  } catch (error) {
    console.error('Get loyalty points error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * Calculate points for a potential booking
 */
router.post('/calculate', async (req, res) => {
  try {
    const { ticketAmount, bookingDate } = req.body;

    const date = bookingDate ? new Date(bookingDate) : new Date();
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;

    const result = calculatePointsEarned(ticketAmount, isWeekend);

    res.json({ success: true, ...result, isWeekend });
  } catch (error) {
    console.error('Calculate points error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * Award points for a booking
 */
router.post('/award', async (req, res) => {
  try {
    const { userId, bookingData } = req.body;
    // bookingData: { ticketAmount, bookingReference, bookingId, bookingDate }
    const result = await awardPointsForBooking(userId, bookingData);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Award points error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * Redeem points for discount
 */
router.post('/redeem', async (req, res) => {
  try {
    const { userId, points, bookingReference } = req.body;

    const result = await redeemPointsForDiscount(userId, points, bookingReference);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Redeem points error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * Get points history
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const user = await User.findById(userId).select('pointsHistory');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const history = user.pointsHistory
      .slice(-limit)
      .reverse();

    res.json({
      success: true,
      history
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * Get tier information
 */
router.get('/tiers', (req, res) => {
  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'].map(tier => getTierInfo(tier));
  
  res.json({
    success: true,
    tiers
  });
});

export default router;
