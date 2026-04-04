import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FBItem from './models/FBItem.js';
import FBOffer from './models/FBOffer.js';
import User from './models/User.js';

dotenv.config();

const sampleItems = [
  // Combos
  {
    name: 'Family Combo',
    category: 'combos',
    description: 'Perfect for the whole family! Includes 2 large popcorns, 4 drinks, and nachos',
    image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400',
    basePrice: 1200,
    originalPrice: 1500,
    isCombo: true,
    comboItems: ['2x Large Popcorn', '4x Soft Drinks', '1x Nachos'],
    tags: ['popular'],
    displayOrder: 1
  },
  {
    name: 'Couple Combo',
    category: 'combos',
    description: 'Perfect for two! Large popcorn and 2 drinks',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400',
    basePrice: 500,
    originalPrice: 600,
    isCombo: true,
    comboItems: ['1x Large Popcorn', '2x Soft Drinks'],
    tags: ['popular'],
    displayOrder: 2
  },
  {
    name: 'Solo Snack Pack',
    category: 'combos',
    description: 'Just for you! Medium popcorn and a drink',
    image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400',
    basePrice: 300,
    originalPrice: 350,
    isCombo: true,
    comboItems: ['1x Medium Popcorn', '1x Soft Drink'],
    tags: ['new'],
    displayOrder: 3
  },
  
  // Popcorn
  {
    name: 'Classic Butter Popcorn',
    category: 'popcorn',
    description: 'Fresh, hot, and buttery popcorn',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400',
    basePrice: 200,
    sizes: [
      { name: 'Small', price: 150, calories: 300 },
      { name: 'Medium', price: 200, calories: 500 },
      { name: 'Large', price: 250, calories: 700 }
    ],
    tags: ['popular', 'vegetarian'],
    displayOrder: 10
  },
  {
    name: 'Caramel Popcorn',
    category: 'popcorn',
    description: 'Sweet and crunchy caramel-coated popcorn',
    image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400',
    basePrice: 220,
    sizes: [
      { name: 'Small', price: 170, calories: 350 },
      { name: 'Medium', price: 220, calories: 550 },
      { name: 'Large', price: 270, calories: 750 }
    ],
    tags: ['vegetarian'],
    displayOrder: 11
  },
  {
    name: 'Cheese Popcorn',
    category: 'popcorn',
    description: 'Savory cheese-flavored popcorn',
    image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400',
    basePrice: 220,
    sizes: [
      { name: 'Small', price: 170, calories: 320 },
      { name: 'Medium', price: 220, calories: 520 },
      { name: 'Large', price: 270, calories: 720 }
    ],
    tags: ['vegetarian'],
    displayOrder: 12
  },
  
  // Drinks
  {
    name: 'Coca-Cola',
    category: 'drinks',
    description: 'Ice-cold Coca-Cola',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    basePrice: 120,
    sizes: [
      { name: 'Small', price: 80, calories: 150 },
      { name: 'Medium', price: 120, calories: 250 },
      { name: 'Large', price: 150, calories: 350 }
    ],
    tags: ['popular'],
    displayOrder: 20
  },
  {
    name: 'Pepsi',
    category: 'drinks',
    description: 'Refreshing Pepsi',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
    basePrice: 120,
    sizes: [
      { name: 'Small', price: 80, calories: 150 },
      { name: 'Medium', price: 120, calories: 250 },
      { name: 'Large', price: 150, calories: 350 }
    ],
    tags: [],
    displayOrder: 21
  },
  {
    name: 'Sprite',
    category: 'drinks',
    description: 'Crisp lemon-lime soda',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
    basePrice: 120,
    sizes: [
      { name: 'Small', price: 80, calories: 140 },
      { name: 'Medium', price: 120, calories: 240 },
      { name: 'Large', price: 150, calories: 340 }
    ],
    tags: [],
    displayOrder: 22
  },
  {
    name: 'Mineral Water',
    category: 'drinks',
    description: 'Pure mineral water',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    basePrice: 50,
    sizes: [
      { name: 'Small', price: 50, calories: 0 },
      { name: 'Large', price: 80, calories: 0 }
    ],
    tags: [],
    displayOrder: 23
  },
  {
    name: 'Orange Juice',
    category: 'drinks',
    description: 'Fresh orange juice',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    basePrice: 150,
    sizes: [
      { name: 'Small', price: 120, calories: 110 },
      { name: 'Medium', price: 150, calories: 180 }
    ],
    tags: ['new'],
    displayOrder: 24
  },
  
  // Snacks
  {
    name: 'Nachos with Cheese',
    category: 'snacks',
    description: 'Crispy nachos with warm cheese dip',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
    basePrice: 200,
    tags: ['popular', 'vegetarian'],
    displayOrder: 30
  },
  {
    name: 'Hot Dog',
    category: 'snacks',
    description: 'Classic hot dog with your choice of toppings',
    image: 'https://images.unsplash.com/photo-1612392062798-2dbaa2c2c993?w=400',
    basePrice: 180,
    tags: [],
    displayOrder: 31
  },
  {
    name: 'French Fries',
    category: 'snacks',
    description: 'Crispy golden french fries',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    basePrice: 150,
    sizes: [
      { name: 'Regular', price: 150, calories: 300 },
      { name: 'Large', price: 200, calories: 450 }
    ],
    tags: ['vegetarian'],
    displayOrder: 32
  },
  {
    name: 'Chicken Nuggets',
    category: 'snacks',
    description: '6 pieces of crispy chicken nuggets',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
    basePrice: 220,
    tags: [],
    displayOrder: 33
  },
  
  // Candy
  {
    name: 'M&Ms',
    category: 'candy',
    description: 'Colorful chocolate candies',
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
    basePrice: 100,
    tags: [],
    displayOrder: 40
  },
  {
    name: 'Skittles',
    category: 'candy',
    description: 'Taste the rainbow',
    image: 'https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?w=400',
    basePrice: 100,
    tags: ['vegetarian'],
    displayOrder: 41
  },
  {
    name: 'Chocolate Bar',
    category: 'candy',
    description: 'Smooth milk chocolate',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
    basePrice: 80,
    tags: ['vegetarian'],
    displayOrder: 42
  }
];

const sampleOffers = [
  {
    title: 'Monday Madness',
    description: '20% off all snacks every Monday!',
    type: 'percentage',
    value: 20,
    applicableCategories: ['snacks'],
    validDays: ['monday'],
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    isActive: true,
    priority: 10
  },
  {
    title: 'Free Drink Tuesday',
    description: 'Get a free small drink with any combo purchase on Tuesdays',
    type: 'free_item',
    value: 80,
    applicableCategories: ['combos'],
    validDays: ['tuesday'],
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    isActive: true,
    priority: 9
  },
  {
    title: 'Midweek Special',
    description: '15% off all F&B on Wednesdays',
    type: 'percentage',
    value: 15,
    applicableCategories: [],
    validDays: ['wednesday'],
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    isActive: true,
    priority: 8
  },
  {
    title: 'Weekend Family Deal',
    description: 'Rs. 100 off on Family Combo',
    type: 'fixed',
    value: 100,
    applicableCategories: ['combos'],
    minTickets: 3,
    validDays: ['saturday', 'sunday'],
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    isActive: true,
    priority: 7
  },
  {
    title: 'Popcorn Lovers',
    description: '10% off all popcorn',
    type: 'percentage',
    value: 10,
    applicableCategories: ['popcorn'],
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
    isActive: true,
    priority: 5
  }
];

async function seedFBData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await FBItem.deleteMany({});
    await FBOffer.deleteMany({});
    console.log('🗑️  Cleared existing F&B data');
    
    // Insert items
    const items = await FBItem.insertMany(sampleItems);
    console.log(`✅ Inserted ${items.length} F&B items`);
    
    // Get admin user for offers
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('⚠️  No admin user found. Creating offers without createdBy reference.');
    }
    
    // Add createdBy to offers
    const offersWithCreator = sampleOffers.map(offer => ({
      ...offer,
      createdBy: admin ? admin._id : new mongoose.Types.ObjectId()
    }));
    
    // Insert offers
    const offers = await FBOffer.insertMany(offersWithCreator);
    console.log(`✅ Inserted ${offers.length} F&B offers`);
    
    console.log('\n🎉 Sample F&B data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Combos: ${items.filter(i => i.category === 'combos').length}`);
    console.log(`   - Popcorn: ${items.filter(i => i.category === 'popcorn').length}`);
    console.log(`   - Drinks: ${items.filter(i => i.category === 'drinks').length}`);
    console.log(`   - Snacks: ${items.filter(i => i.category === 'snacks').length}`);
    console.log(`   - Candy: ${items.filter(i => i.category === 'candy').length}`);
    console.log(`   - Offers: ${offers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding F&B data:', error);
    process.exit(1);
  }
}

seedFBData();
