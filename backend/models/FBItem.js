import mongoose from 'mongoose';

const fbItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['popcorn', 'drinks', 'combos', 'snacks', 'candy'],
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  sizes: [{
    name: {
      type: String,
      required: true // 'Small', 'Medium', 'Large'
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    calories: {
      type: Number
    }
  }],
  isCombo: {
    type: Boolean,
    default: false
  },
  comboItems: [{
    type: String // Item names included in combo
  }],
  originalPrice: {
    type: Number, // For showing savings on combos
    min: 0
  },
  tags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'popular', 'new', 'spicy', 'gluten-free']
  }],
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    index: true // Optional: cinema-specific items
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  stock: {
    type: Number,
    min: 0 // Optional: inventory management
  },
  preparationTime: {
    type: Number, // Minutes
    default: 5
  },
  displayOrder: {
    type: Number,
    default: 0 // For custom ordering in menu
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
fbItemSchema.index({ category: 1, isActive: 1 });
fbItemSchema.index({ cinemaId: 1, isActive: 1 });
fbItemSchema.index({ isCombo: 1, isActive: 1 });

// Virtual for checking if item is in stock
fbItemSchema.virtual('inStock').get(function() {
  return this.stock === undefined || this.stock > 0;
});

// Method to get price for specific size
fbItemSchema.methods.getPriceForSize = function(sizeName) {
  if (!this.sizes || this.sizes.length === 0) {
    return this.basePrice;
  }
  
  const size = this.sizes.find(s => s.name === sizeName);
  return size ? size.price : this.basePrice;
};

// Method to calculate savings for combo
fbItemSchema.methods.getSavings = function() {
  if (this.isCombo && this.originalPrice) {
    return this.originalPrice - this.basePrice;
  }
  return 0;
};

export default mongoose.model('FBItem', fbItemSchema);
