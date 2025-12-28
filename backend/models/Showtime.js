import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true // Format: "14:30"
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  bookedSeats: [{
    seatNumber: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bookedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
showtimeSchema.index({ movieId: 1, date: 1, cinemaId: 1 });
showtimeSchema.index({ cinemaId: 1, hallId: 1, date: 1 });
showtimeSchema.index({ date: 1, time: 1 });

// Virtual for datetime combination
showtimeSchema.virtual('datetime').get(function() {
  const dateStr = this.date.toISOString().split('T')[0];
  return new Date(`${dateStr}T${this.time}:00`);
});

// Method to check if showtime is in the past
showtimeSchema.methods.isPast = function() {
  return this.datetime < new Date();
};

// Method to calculate available seats
showtimeSchema.methods.getAvailableSeatsCount = function() {
  return this.availableSeats - this.bookedSeats.length;
};

export default mongoose.model('Showtime', showtimeSchema);