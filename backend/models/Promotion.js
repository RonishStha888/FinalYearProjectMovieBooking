import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
    unique: true,
    uppercase: true,
    required: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'bogo', 'free_seat'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  minAmount: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  applicableMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  applicableCinemas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema'
  }],
  userRestrictions: {
    newUsersOnly: {
      type: Boolean,
      default: false
    },
    maxUsagePerUser: {
      type: Number,
      default: 1
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

// Check if promotion is currently valid
promotionSchema.methods.isValid = function() {
  const now = new Date();
  return this.isActive && 
         now >= this.validFrom && 
         now <= this.validUntil &&
         (this.usageLimit === null || this.usedCount < this.usageLimit);
};

export default mongoose.model('Promotion', promotionSchema);