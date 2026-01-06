import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  totalSeats: {
    type: Number,
    required: true
  },
  occupiedSeats: {
    type: Number,
    default: 0
  },
  revenue: {
    gross: {
      type: Number,
      default: 0
    },
    net: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discounts: {
      type: Number,
      default: 0
    },
    refunds: {
      type: Number,
      default: 0
    }
  },
  paymentMethods: {
    card: {
      type: Number,
      default: 0
    },
    esewa: {
      type: Number,
      default: 0
    },
    khalti: {
      type: Number,
      default: 0
    },
    cash: {
      type: Number,
      default: 0
    }
  },
  occupancyRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate occupancy rate
revenueSchema.pre('save', function(next) {
  if (this.totalSeats > 0) {
    this.occupancyRate = (this.occupiedSeats / this.totalSeats) * 100;
  }
  next();
});

// Compound indexes for efficient queries
revenueSchema.index({ date: 1, cinemaId: 1 });
revenueSchema.index({ movieId: 1, date: 1 });
revenueSchema.index({ cinemaId: 1, date: 1 });

export default mongoose.model('Revenue', revenueSchema);