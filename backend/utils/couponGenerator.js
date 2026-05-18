import ParkingCoupon from '../models/ParkingCoupon.js';

/**
 * Generate a unique parking coupon code in format PARK-XXXX-DDMM
 * @param {Date} date - The date to use for the DDMM portion
 * @returns {Promise<string>} - The generated unique coupon code
 */
export async function generateCouponCode(date = new Date()) {
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    // Generate 4 random alphanumeric characters (uppercase)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Format date as DDMM
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const datePart = `${day}${month}`;

    // Combine: PARK-XXXX-DDMM
    const code = `PARK-${randomPart}-${datePart}`;

    // Check if code already exists in database
    const existingCoupon = await ParkingCoupon.findOne({ code });
    
    if (!existingCoupon) {
      return code;
    }

    attempts++;
  }

  // If we couldn't generate a unique code after max attempts, throw error
  throw new Error('Unable to generate unique coupon code after maximum attempts');
}

/**
 * Calculate expiration timestamp for a parking coupon
 * Sets expiration to 11:59:59 PM on the booking day
 * @param {Date} bookingDate - The date of the movie booking
 * @returns {Date} - The expiration timestamp
 */
export function calculateExpiration(bookingDate) {
  // Create a new date object to avoid mutating the input
  const expiration = new Date(bookingDate);
  
  // Set to end of day: 11:59:59 PM and 999 milliseconds
  expiration.setHours(23, 59, 59, 999);
  
  return expiration;
}
