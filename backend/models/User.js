import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.authMethod === 'email';
    }
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String
  },
  googleId: {
    type: String,
    sparse: true
  },
  authMethod: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: null
  },
  verificationTokenExpires: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Loyalty Points System
  loyaltyPoints: {
    total: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    },
    lifetime: {
      type: Number,
      default: 0
    },
    tier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze'
    },
    tierProgress: {
      type: Number,
      default: 0
    }
  },
  pointsHistory: [{
    type: {
      type: String,
      enum: ['earned', 'redeemed', 'expired', 'bonus'],
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    bookingId: {
      type: String,
      default: null
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Loyalty Points Methods
userSchema.methods.calculateTier = function() {
  const points = this.loyaltyPoints.lifetime;
  if (points >= 2000) return 'Platinum';
  if (points >= 1000) return 'Gold';
  if (points >= 500) return 'Silver';
  return 'Bronze';
};

userSchema.methods.getTierBonus = function() {
  switch (this.loyaltyPoints.tier) {
    case 'Platinum': return 0.15; // 15% bonus
    case 'Gold': return 0.10; // 10% bonus
    case 'Silver': return 0.05; // 5% bonus
    default: return 0; // No bonus
  }
};

userSchema.methods.addPoints = async function(points, description, bookingId = null, type = 'earned') {
  this.loyaltyPoints.total += points;
  this.loyaltyPoints.available += points;
  this.loyaltyPoints.lifetime += points;
  
  // Update tier
  this.loyaltyPoints.tier = this.calculateTier();
  
  // Add to history
  this.pointsHistory.push({
    type,
    points,
    description,
    bookingId,
    date: new Date()
  });
  
  await this.save();
  return this.loyaltyPoints;
};

userSchema.methods.redeemPoints = async function(points, description, bookingId = null) {
  if (this.loyaltyPoints.available < points) {
    throw new Error('Insufficient points');
  }
  
  this.loyaltyPoints.available -= points;
  
  // Add to history
  this.pointsHistory.push({
    type: 'redeemed',
    points: -points,
    description,
    bookingId,
    date: new Date()
  });
  
  await this.save();
  return this.loyaltyPoints;
};

userSchema.methods.getPointsValue = function(points) {
  // 1 point = Rs. 5
  return points * 5;
};

const User = mongoose.model('User', userSchema);

export default User;
