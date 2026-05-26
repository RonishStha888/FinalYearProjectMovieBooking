// Calculate total price for booking
export function calculateTotalPrice(seats, basePrice, premiumSurcharge = 100) {
  let total = 0;
  
  seats.forEach(seat => {
    if (seat.isPremium) {
      total += basePrice + premiumSurcharge;
    } else {
      total += basePrice;
    }
  });
  
  return total;
}

// Calculate convenience fee
export function calculateConvenienceFee(totalAmount) {
  return 25; // Fixed Rs. 25 convenience fee
}

// Validate seat selection
export function validateSeatSelection(seats) {
  if (!Array.isArray(seats) || seats.length === 0) {
    return { valid: false, message: 'At least one seat must be selected' };
  }
  
  if (seats.length > 10) {
    return { valid: false, message: 'Maximum 10 seats per booking' };
  }
  
  return { valid: true, message: 'Valid seat selection' };
}

// Generate booking reference
export function generateBookingReference() {
  const prefix = 'RTX';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

// Check if seat is available
export function isSeatAvailable(seat, occupiedSeats, heldSeats) {
  const isOccupied = occupiedSeats.includes(seat.id);
  const isHeld = heldSeats.some(hold => 
    hold.seatId === seat.id && new Date(hold.expiresAt) > new Date()
  );
  
  return !isOccupied && !isHeld;
}
