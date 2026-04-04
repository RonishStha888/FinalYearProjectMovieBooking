import mongoose from 'mongoose';

const seatHoldSchema = new mongoose.Schema({
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
    index: true
  },
  userId: {
    type: String, // Changed to String to support both ObjectId and 'guest'
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  seats: [{
    seatNumber: String,
    seatType: String
  }],
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'completed', 'cancelled'],
    default: 'active',
    index: true
  }
}, {
  timestamps: true
});

// Index for automatic cleanup
seatHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for efficient queries
seatHoldSchema.index({ showtimeId: 1, status: 1 });
seatHoldSchema.index({ userId: 1, status: 1 });

export default mongoose.model('SeatHold', seatHoldSchema);
