import {
  calculateTotalPrice,
  calculateConvenienceFee,
  validateSeatSelection,
  generateBookingReference,
  isSeatAvailable
} from '../utils/bookingHelpers.js';

describe('Booking Module - Unit Tests', () => {
  
  describe('Price Calculation', () => {
    test('should calculate total for regular seats', () => {
      const seats = [
        { id: 'A1', isPremium: false },
        { id: 'A2', isPremium: false }
      ];
      const basePrice = 400;
      
      const total = calculateTotalPrice(seats, basePrice);
      expect(total).toBe(800);
    });

    test('should calculate total with premium seats', () => {
      const seats = [
        { id: 'A1', isPremium: false },
        { id: 'F5', isPremium: true }
      ];
      const basePrice = 400;
      
      const total = calculateTotalPrice(seats, basePrice);
      expect(total).toBe(900); // 400 + 500
    });

    test('should handle empty seats array', () => {
      const seats = [];
      const basePrice = 400;
      
      const total = calculateTotalPrice(seats, basePrice);
      expect(total).toBe(0);
    });
  });

  describe('Convenience Fee', () => {
    test('should return fixed convenience fee', () => {
      expect(calculateConvenienceFee(800)).toBe(25);
      expect(calculateConvenienceFee(1500)).toBe(25);
    });
  });

  describe('Seat Selection Validation', () => {
    test('should accept valid seat selection', () => {
      const seats = [{ id: 'A1' }, { id: 'A2' }];
      const result = validateSeatSelection(seats);
      
      expect(result.valid).toBe(true);
    });

    test('should reject empty seat selection', () => {
      const result = validateSeatSelection([]);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('At least one seat');
    });

    test('should reject more than 10 seats', () => {
      const seats = Array(11).fill({ id: 'A1' });
      const result = validateSeatSelection(seats);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Maximum 10 seats');
    });
  });

  describe('Booking Reference Generation', () => {
    test('should generate booking reference with RTX prefix', () => {
      const ref = generateBookingReference();
      
      expect(ref).toMatch(/^RTX\d{9}$/);
      expect(ref.startsWith('RTX')).toBe(true);
    });

    test('should generate unique references', () => {
      const ref1 = generateBookingReference();
      const ref2 = generateBookingReference();
      
      expect(ref1).not.toBe(ref2);
    });
  });

  describe('Seat Availability Check', () => {
    test('should return true for available seat', () => {
      const seat = { id: 'A1' };
      const occupiedSeats = ['B1', 'B2'];
      const heldSeats = [];
      
      const available = isSeatAvailable(seat, occupiedSeats, heldSeats);
      expect(available).toBe(true);
    });

    test('should return false for occupied seat', () => {
      const seat = { id: 'A1' };
      const occupiedSeats = ['A1', 'B2'];
      const heldSeats = [];
      
      const available = isSeatAvailable(seat, occupiedSeats, heldSeats);
      expect(available).toBe(false);
    });

    test('should return false for held seat', () => {
      const seat = { id: 'A1' };
      const occupiedSeats = [];
      const heldSeats = [
        { seatId: 'A1', expiresAt: new Date(Date.now() + 10000) }
      ];
      
      const available = isSeatAvailable(seat, occupiedSeats, heldSeats);
      expect(available).toBe(false);
    });

    test('should return true for expired hold', () => {
      const seat = { id: 'A1' };
      const occupiedSeats = [];
      const heldSeats = [
        { seatId: 'A1', expiresAt: new Date(Date.now() - 10000) }
      ];
      
      const available = isSeatAvailable(seat, occupiedSeats, heldSeats);
      expect(available).toBe(true);
    });
  });
});
