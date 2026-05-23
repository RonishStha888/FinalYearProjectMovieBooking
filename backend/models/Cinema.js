import mongoose from 'mongoose';

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    default: 'Kathmandu'
  },
  distance: {
    type: String, // e.g., "2.5 km"
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.0
  },
  amenities: [{
    type: String,
    enum: ['Parking', 'Food Court', 'AC', 'Dolby Atmos', 'Premium Sound', 'Mall', '3D', 'IMAX']
  }],
  phone: {
    type: String
  },
  email: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for location-based searches
cinemaSchema.index({ city: 1, location: 1 });
cinemaSchema.index({ rating: -1 });

export default mongoose.model('Cinema', cinemaSchema);