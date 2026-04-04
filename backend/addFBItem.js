import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FBItem from './models/FBItem.js';

dotenv.config();

// Example: Add a new F&B item
async function addFBItem() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Define your new item here
    const newItem = {
      name: 'Pizza Slice',
      category: 'snacks', // Options: 'popcorn', 'drinks', 'combos', 'snacks', 'candy'
      description: 'Delicious cheese pizza slice',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      basePrice: 180,
      // Optional: Add sizes if item has multiple sizes
      sizes: [
        { name: 'Regular', price: 180, calories: 250 },
        { name: 'Large', price: 250, calories: 400 }
      ],
      // Optional: For combos
      isCombo: false,
      comboItems: [], // e.g., ['1x Pizza', '1x Drink']
      originalPrice: null, // Set if there's a discount
      tags: ['new'], // Options: 'vegetarian', 'vegan', 'popular', 'new', 'spicy', 'gluten-free'
      // Optional: Make it cinema-specific
      // cinemaId: 'your-cinema-id-here',
      isActive: true,
      stock: 100, // Optional: for inventory
      preparationTime: 10, // Minutes
      displayOrder: 0
    };
    
    const item = new FBItem(newItem);
    await item.save();
    
    console.log('✅ Item added successfully!');
    console.log(item);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding item:', error);
    process.exit(1);
  }
}

addFBItem();
