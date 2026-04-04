import User from '../models/User.js';

// Rules: 1 point per Rs.100 spent, 1 point = Rs.5 discount
// Min redemption: 20 pts, Max: 100 pts per booking
export const POINTS_PER_100 = 1;
export const DISCOUNT_PER_POINT = 5;
export const MIN_REDEEM = 20;
export const MAX_REDEEM = 100;
export const WELCOME_BONUS = 10;

/**
 * Calculate points earned from a booking
 * @param {number} ticketAmount - Ticket total (not F&B)
 * @param {boolean} isWeekend - Is booking on weekend
 * @returns {Object} Points breakdown
 */
export const calculatePointsEarned = (ticketAmount, isWeekend = false) => {
  const breakdown = [];

  // Base: 1 point per Rs.100 spent on tickets
  const basePoints = Math.floor(ticketAmount / 100) * POINTS_PER_100;
  breakdown.push({
    source: 'Ticket Purchase',
    description: `Rs. ${ticketAmount} spent (1 pt per Rs.100)`,
    points: basePoints
  });

  let totalPoints = basePoints;

  return { totalPoints, breakdown };
};

/**
 * Get redemption options based on available points
 */
export const getRedemptionOptions = (availablePoints) => {
  if (availablePoints < MIN_REDEEM) return [];

  const options = [];
  const steps = [20, 40, 60, 80, 100];
  for (const pts of steps) {
    if (availablePoints >= pts) {
      options.push({
        points: pts,
        discount: pts * DISCOUNT_PER_POINT,
        label: `Rs. ${pts * DISCOUNT_PER_POINT} OFF`
      });
    }
  }
  return options;
};

/**
 * Get tier information
 * @param {string} tier - Current tier
 * @returns {Object} Tier details
 */
export const getTierInfo = (tier) => {
  const tiers = {
    Bronze: {
      name: 'Bronze',
      color: '#CD7F32',
      icon: '🥉',
      bonus: '0%',
      nextTier: 'Silver',
      pointsNeeded: 500,
      benefits: ['Earn points on bookings', 'Redeem points for discounts']
    },
    Silver: {
      name: 'Silver',
      color: '#C0C0C0',
      icon: '🥈',
      bonus: '5%',
      nextTier: 'Gold',
      pointsNeeded: 1000,
      benefits: ['5% bonus points', 'Priority customer support', 'Early access to offers']
    },
    Gold: {
      name: 'Gold',
      color: '#FFD700',
      icon: '🥇',
      bonus: '10%',
      nextTier: 'Platinum',
      pointsNeeded: 2000,
      benefits: ['10% bonus points', 'Priority booking', 'Exclusive movie previews', 'Birthday rewards']
    },
    Platinum: {
      name: 'Platinum',
      color: '#E5E4E2',
      icon: '💎',
      bonus: '15%',
      nextTier: null,
      pointsNeeded: null,
      benefits: ['15% bonus points', 'VIP lounge access', 'Free F&B upgrades', 'Complimentary tickets', 'Concierge service']
    }
  };

  return tiers[tier] || tiers.Bronze;
};

/**
 * Award points to user for a booking
 */
export const awardPointsForBooking = async (userId, bookingData) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const { totalPoints, breakdown } = calculatePointsEarned(bookingData.ticketAmount);

    if (totalPoints <= 0) {
      return { success: true, pointsEarned: 0, breakdown, newBalance: user.loyaltyPoints.available };
    }

    const description = `Movie ticket purchase - ${bookingData.bookingReference || 'N/A'}`;
    const updatedPoints = await user.addPoints(totalPoints, description, bookingData.bookingId || null, 'earned');

    console.log(`✅ Awarded ${totalPoints} points to user ${userId}. New balance: ${updatedPoints.available}`);
    return {
      success: true,
      pointsEarned: totalPoints,
      breakdown,
      newBalance: updatedPoints.available,
      tier: updatedPoints.tier
    };
  } catch (error) {
    console.error('Error awarding points:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Redeem points for discount
 */
export const redeemPointsForDiscount = async (userId, points, bookingReference) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (points < MIN_REDEEM) throw new Error(`Minimum redemption is ${MIN_REDEEM} points`);
    if (points > MAX_REDEEM) throw new Error(`Maximum redemption is ${MAX_REDEEM} points per booking`);

    const discount = points * DISCOUNT_PER_POINT;
    const description = `Redeemed ${points} pts for Rs. ${discount} discount - ${bookingReference}`;
    const updatedPoints = await user.redeemPoints(points, description);

    return {
      success: true,
      pointsRedeemed: points,
      discountAmount: discount,
      newBalance: updatedPoints.available
    };
  } catch (error) {
    console.error('Error redeeming points:', error);
    return { success: false, error: error.message };
  }
};
