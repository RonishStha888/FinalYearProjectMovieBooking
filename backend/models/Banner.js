import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  imageUrl: {
    type: String,
    required: true
  },
  linkUrl: {
    type: String
  },
  linkText: {
    type: String,
    default: 'Learn More'
  },
  position: {
    type: String,
    enum: ['hero', 'sidebar', 'footer', 'popup'],
    default: 'hero'
  },
  priority: {
    type: Number,
    default: 0
  },
  targetAudience: {
    type: String,
    enum: ['all', 'new_users', 'returning_users', 'premium_users'],
    default: 'all'
  },
  displayConditions: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    maxImpressions: {
      type: Number
    },
    currentImpressions: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Check if banner should be displayed
bannerSchema.methods.shouldDisplay = function() {
  const now = new Date();
  return this.isActive &&
         now >= this.displayConditions.startDate &&
         now <= this.displayConditions.endDate &&
         (!this.displayConditions.maxImpressions || 
          this.displayConditions.currentImpressions < this.displayConditions.maxImpressions);
};

export default mongoose.model('Banner', bannerSchema);