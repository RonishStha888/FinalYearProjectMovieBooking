import express from 'express';
import ParkingCoupon from '../models/ParkingCoupon.js';
import { generateCouponCode, calculateExpiration } from '../utils/couponGenerator.js';

const router = express.Router();

/**
 * POST /api/parking/claim-coupon
 * Generate or retrieve a parking coupon for a booking
 */
router.post('/claim-coupon', async (req, res) => {
  try {
    const { bookingId, userId } = req.body;

    // Validate request parameters
    if (!bookingId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters. bookingId and userId are required.'
      });
    }

    console.log('🚗 Parking coupon claim request:', { bookingId, userId });

    // Check if coupon already exists for this booking
    const existingCoupon = await ParkingCoupon.findOne({ bookingId });

    if (existingCoupon) {
      console.log('✅ Returning existing coupon:', existingCoupon.code);
      return res.json({
        success: true,
        coupon: {
          code: existingCoupon.code,
          discountPercent: existingCoupon.discountPercent,
          expiresAt: existingCoupon.expiresAt.toISOString()
        }
      });
    }

    // Generate new unique coupon code
    const code = await generateCouponCode(new Date());
    
    // Calculate expiration (end of today)
    const expiresAt = calculateExpiration(new Date());

    // Create new coupon
    const newCoupon = await ParkingCoupon.create({
      bookingId,
      userId,
      code,
      discountPercent: 50,
      isUsed: false,
      expiresAt
    });

    console.log('✅ New parking coupon created:', newCoupon.code);

    res.json({
      success: true,
      coupon: {
        code: newCoupon.code,
        discountPercent: newCoupon.discountPercent,
        expiresAt: newCoupon.expiresAt.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Claim coupon error:', error);
    
    // Handle specific error cases
    if (error.message.includes('Unable to generate unique coupon code')) {
      return res.status(500).json({
        success: false,
        error: 'Unable to generate coupon. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Service temporarily unavailable. Please try again later.'
    });
  }
});

/**
 * GET /api/parking/verify-coupon
 * Verify and redeem a parking coupon
 */
router.get('/verify-coupon', async (req, res) => {
  try {
    const { code } = req.query;

    // Validate code parameter
    if (!code) {
      return res.json({
        valid: false,
        message: 'Coupon code is required'
      });
    }

    // Validate code format
    const codeFormatRegex = /^PARK-[A-Z0-9]{4}-\d{4}$/;
    if (!codeFormatRegex.test(code)) {
      return res.json({
        valid: false,
        message: 'Invalid coupon code format'
      });
    }

    console.log('🔍 Verifying parking coupon:', code);

    // Query database for coupon
    const coupon = await ParkingCoupon.findOne({ code });

    // Check if coupon exists
    if (!coupon) {
      console.log('❌ Coupon not found');
      return res.json({
        valid: false,
        message: 'Coupon code not found'
      });
    }

    // Check if coupon is expired
    const now = new Date();
    if (coupon.expiresAt < now) {
      console.log('❌ Coupon expired');
      return res.json({
        valid: false,
        message: 'Coupon has expired',
        discountPercent: coupon.discountPercent,
        bookingId: coupon.bookingId,
        isUsed: coupon.isUsed
      });
    }

    // Check if coupon is already used
    if (coupon.isUsed) {
      console.log('❌ Coupon already used');
      return res.json({
        valid: false,
        message: 'Coupon has already been used',
        discountPercent: coupon.discountPercent,
        bookingId: coupon.bookingId,
        isUsed: true
      });
    }

    // Coupon is valid - mark as used
    coupon.isUsed = true;
    await coupon.save();

    console.log('✅ Coupon verified and marked as used');

    res.json({
      valid: true,
      discountPercent: coupon.discountPercent,
      bookingId: coupon.bookingId,
      isUsed: true,
      message: 'Coupon verified successfully'
    });

  } catch (error) {
    console.error('❌ Verify coupon error:', error);
    res.status(500).json({
      valid: false,
      message: 'Service temporarily unavailable'
    });
  }
});

export default router;
