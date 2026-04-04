import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FBOffer from './models/FBOffer.js';
import User from './models/User.js';

dotenv.config();

// Example: Add a new F&B offer
async function addFBOffer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get admin user for createdBy field
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('⚠️  No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    
    // Define your new offer here
    const newOffer = {
      title: 'Friday Night Special',
      description: '25% off all combos on Friday nights!',
      code: 'FRIDAY25', // Optional: promo code
      type: 'percentage', // Options: 'percentage', 'fixed', 'free_item', 'combo_discount'
      value: 25, // 25% or Rs. 25 depending on type
      
      // Optional: Limit to specific items or categories
      applicableItems: [], // Array of item IDs
      applicableCategories: ['combos'], // Options: 'popcorn', 'drinks', 'combos', 'snacks', 'candy'
      
      // Optional: Conditions
      minTickets: 2, // Minimum tickets required
      minAmount: 0, // Minimum purchase amount
      maxDiscount: 200, // Maximum discount amount (for percentage offers)
      
      // Valid days (optional)
      validDays: ['friday'], // Options: 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
      
      // Date range
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2025-12-31'),
      
      isActive: true,
      priority: 10, // Higher priority = applied first
      usageLimit: null, // null = unlimited, or set a number
      usedCount: 0,
      
      // Optional: Make it cinema-specific
      // cinemaId: 'your-cinema-id-here',
      
      createdBy: admin._id
    };
    
    const offer = new FBOffer(newOffer);
    await offer.save();
    
    console.log('✅ Offer added successfully!');
    console.log(offer);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding offer:', error);
    process.exit(1);
  }
}

addFBOffer();
