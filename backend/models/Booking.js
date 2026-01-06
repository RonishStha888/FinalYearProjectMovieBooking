import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: true
  },
  seats: [{
    seatNumber: String,
    seatType: {
      type: String,
      enum: ['regular', 'premium', 'vip'],
      default: 'regular'
    },
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  customerInfo: {
    name: String,
    email: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'esewa', 'khalti', 'cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  showDate: {
    type: Date,
    required: true
  },
  showTime: {
    type: String,
    required: true
  },
  discountApplied: {
    code: String,
    amount: Number,
    percentage: Number
  },
  refundInfo: {
    refundAmount: Number,
    refundDate: Date,
    refundReason: String,
    refundMethod: String
  }
}, {
  timestamps: true
});

// Generate booking reference
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = 'RTX' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

// Indexes for efficient queries
bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ showtimeId: 1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ bookingStatus: 1 });

export default mongoose.model('Booking', bookingSchema);