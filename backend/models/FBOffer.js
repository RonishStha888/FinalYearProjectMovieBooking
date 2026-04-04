import mongoose from 'mongoose';

const fbOfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
    uppercase: true,
    trim: true,
    sparse: true // Allow null but unique if present
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'free_item', 'combo_discount'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  applicableItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FBItem'
  }],
  applicableCategories: [{
    type: String,
    enum: ['popcorn', 'drinks', 'combos', 'snacks', 'candy']
  }],
  minTickets: {
    type: Number,
    min: 1
  },
  minAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  maxDiscount: {
    type: Number,
    min: 0 // Maximum discount amount for percentage offers
  },
  validDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  priority: {
    type: Number,
    default: 0 // Higher priority offers applied first
  },
  usageLimit: {
    type: Number,
    min: 0 // Total usage limit across all users
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    index: true // Optional: cinema-specific offers
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
fbOfferSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
fbOfferSchema.index({ cinemaId: 1, isActive: 1 });
fbOfferSchema.index({ priority: -1 });

// Method to check if offer is currently valid
fbOfferSchema.methods.isValid = function(bookingDate) {
  const now = new Date();
  const checkDate = bookingDate ? new Date(bookingDate) : now;
  
  // Check if offer is active
  if (!this.isActive) return false;
  
  // Check date range
  if (checkDate < this.validFrom || checkDate > this.validUntil) return false;
  
  // Check usage limit
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  
  // Check valid days
  if (this.validDays && this.validDays.length > 0) {
    const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (!this.validDays.includes(dayName)) return false;
  }
  
  return true;
};

// Method to check if offer applies to specific item
fbOfferSchema.methods.appliesTo = function(itemId, category) {
  // If no specific items or categories, offer applies to all
  if ((!this.applicableItems || this.applicableItems.length === 0) &&
      (!this.applicableCategories || this.applicableCategories.length === 0)) {
    return true;
  }
  
  // Check if item ID matches
  if (this.applicableItems && this.applicableItems.length > 0) {
    if (this.applicableItems.some(id => id.toString() === itemId.toString())) {
      return true;
    }
  }
  
  // Check if category matches
  if (this.applicableCategories && this.applicableCategories.length > 0) {
    if (this.applicableCategories.includes(category)) {
      return true;
    }
  }
  
  return false;
};

// Method to calculate discount amount
fbOfferSchema.methods.calculateDiscount = function(amount) {
  let discount = 0;
  
  switch (this.type) {
    case 'percentage':
      discount = (amount * this.value) / 100;
      if (this.maxDiscount) {
        discount = Math.min(discount, this.maxDiscount);
      }
      break;
      
    case 'fixed':
      discount = this.value;
      break;
      
    case 'free_item':
      discount = this.value; // Value represents the item price
      break;
      
    case 'combo_discount':
      discount = this.value;
      break;
      
    default:
      discount = 0;
  }
  
  // Ensure discount doesn't exceed amount
  return Math.min(discount, amount);
};

// Method to increment usage count
fbOfferSchema.methods.incrementUsage = async function() {
  this.usedCount += 1;
  await this.save();
};

export default mongoose.model('FBOffer', fbOfferSchema);
