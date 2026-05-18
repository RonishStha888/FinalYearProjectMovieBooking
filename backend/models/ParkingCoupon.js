import mongoose from 'mongoose';

const parkingCouponSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: /^PARK-[A-Z0-9]{4}-\d{4}$/
  },
  discountPercent: {
    type: Number,
    required: true,
    default: 50,
    min: 0,
    max: 100
  },
  isUsed: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
parkingCouponSchema.index({ bookingId: 1 });
parkingCouponSchema.index({ code: 1 });
parkingCouponSchema.index({ userId: 1, createdAt: -1 });
parkingCouponSchema.index({ expiresAt: 1, isUsed: 1 });

export default mongoose.model('ParkingCoupon', parkingCouponSchema);
