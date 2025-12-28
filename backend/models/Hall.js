import mongoose from 'mongoose';

const hallSchema = new mongoose.Schema({
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  hallNumber: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true // e.g., "Hall 1", "Premium Hall A"
  },
  type: {
    type: String,
    enum: ['REGULAR 2D', 'GOLD CLASS 2D', 'PREMIUM 2D', 'STANDARD 2D', '3D', 'IMAX'],
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  seatLayout: {
    rows: {
      type: Number,
      required: true
    },
    seatsPerRow: {
      type: Number,
      required: true
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    weekendPrice: {
      type: Number,
      required: true
    }
  },
  features: [{
    type: String,
    enum: ['Dolby Atmos', 'Premium Sound', 'Recliner Seats', 'AC', 'Food Service']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for cinema and hall lookup
hallSchema.index({ cinemaId: 1, hallNumber: 1 }, { unique: true });
hallSchema.index({ type: 1 });

export default mongoose.model('Hall', hallSchema);