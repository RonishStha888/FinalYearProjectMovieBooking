import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  year: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    required: true
  },
  cast: [{
    type: String
  }],
  director: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'English'
  },
  category: {
    type: String,
    enum: ['top-rated', 'action', 'coming-soon', 'drama', 'comedy', 'horror', 'sci-fi'],
    default: 'action'
  },
  releaseDate: {
    type: Date,
    required: true
  },
  comingSoon: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
movieSchema.index({ title: 'text', genre: 'text', cast: 'text' });
movieSchema.index({ category: 1, rating: -1 });
movieSchema.index({ releaseDate: 1 });

export default mongoose.model('Movie', movieSchema);