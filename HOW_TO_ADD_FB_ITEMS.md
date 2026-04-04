# 📖 How to Add Food & Beverage Items

This guide shows you how to add new F&B items and offers to your cinema booking system.

---

## 🎯 Quick Start

### **Method 1: Using the Add Item Script (Easiest)**

1. **Edit the script:**
   ```bash
   # Open backend/addFBItem.js
   # Modify the newItem object with your item details
   ```

2. **Run the script:**
   ```bash
   cd backend
   node addFBItem.js
   ```

3. **Done!** Your item is now in the database and will appear on the F&B menu.

---

## 📝 Adding Different Types of Items

### **1. Simple Item (No Sizes)**

```javascript
const newItem = {
  name: 'Chocolate Bar',
  category: 'candy',
  description: 'Smooth milk chocolate',
  image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
  basePrice: 80,
  tags: ['vegetarian'],
  isActive: true
};
```

### **2. Item with Multiple Sizes**

```javascript
const newItem = {
  name: 'Coca-Cola',
  category: 'drinks',
  description: 'Ice-cold Coca-Cola',
  image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
  basePrice: 120, // Medium price
  sizes: [
    { name: 'Small', price: 80, calories: 150 },
    { name: 'Medium', price: 120, calories: 250 },
    { name: 'Large', price: 150, calories: 350 }
  ],
  tags: ['popular'],
  isActive: true
};
```

### **3. Combo Item**

```javascript
const newItem = {
  name: 'Movie Night Combo',
  category: 'combos',
  description: 'Perfect combo for movie night!',
  image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400',
  basePrice: 600,
  originalPrice: 750, // Show savings
  isCombo: true,
  comboItems: [
    '1x Large Popcorn',
    '2x Soft Drinks',
    '1x Nachos'
  ],
  tags: ['popular'],
  isActive: true
};
```

### **4. Cinema-Specific Item**

```javascript
const newItem = {
  name: 'QFX Special Burger',
  category: 'snacks',
  description: 'Exclusive to QFX Cinemas',
  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  basePrice: 250,
  cinemaId: '6789...', // Your cinema's MongoDB ID
  tags: ['new'],
  isActive: true
};
```

---

## 🎁 Adding Offers

### **1. Percentage Discount**

```javascript
const newOffer = {
  title: 'Student Discount',
  description: '20% off for students',
  type: 'percentage',
  value: 20,
  applicableCategories: [], // Empty = all items
  validDays: ['tuesday'],
  validFrom: new Date('2024-01-01'),
  validUntil: new Date('2025-12-31'),
  isActive: true,
  priority: 10,
  createdBy: adminId
};
```

### **2. Fixed Amount Discount**

```javascript
const newOffer = {
  title: 'Rs. 100 Off',
  description: 'Get Rs. 100 off on orders above Rs. 500',
  type: 'fixed',
  value: 100,
  minAmount: 500,
  validFrom: new Date('2024-01-01'),
  validUntil: new Date('2025-12-31'),
  isActive: true,
  priority: 8,
  createdBy: adminId
};
```

### **3. Free Item Offer**

```javascript
const newOffer = {
  title: 'Free Drink',
  description: 'Get a free small drink with any combo',
  type: 'free_item',
  value: 80, // Value of the free item
  applicableCategories: ['combos'],
  validDays: ['saturday', 'sunday'],
  validFrom: new Date('2024-01-01'),
  validUntil: new Date('2025-12-31'),
  isActive: true,
  priority: 9,
  createdBy: adminId
};
```

### **4. Ticket-Based Offer**

```javascript
const newOffer = {
  title: 'Group Discount',
  description: '15% off for groups of 4 or more',
  type: 'percentage',
  value: 15,
  minTickets: 4, // Requires 4+ tickets
  validFrom: new Date('2024-01-01'),
  validUntil: new Date('2025-12-31'),
  isActive: true,
  priority: 7,
  createdBy: adminId
};
```

---

## 📋 Field Reference

### **F&B Item Fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ Yes | Item name (e.g., "Large Popcorn") |
| `category` | String | ✅ Yes | 'popcorn', 'drinks', 'combos', 'snacks', 'candy' |
| `description` | String | ✅ Yes | Short description |
| `image` | String | ✅ Yes | Image URL (use Unsplash or your own) |
| `basePrice` | Number | ✅ Yes | Price in Rs. |
| `sizes` | Array | ❌ No | Array of {name, price, calories} |
| `isCombo` | Boolean | ❌ No | Is this a combo? (default: false) |
| `comboItems` | Array | ❌ No | List of items in combo |
| `originalPrice` | Number | ❌ No | Original price (for showing savings) |
| `tags` | Array | ❌ No | 'vegetarian', 'vegan', 'popular', 'new', 'spicy', 'gluten-free' |
| `cinemaId` | ObjectId | ❌ No | Make item cinema-specific |
| `isActive` | Boolean | ❌ No | Show on menu? (default: true) |
| `stock` | Number | ❌ No | Inventory count |
| `preparationTime` | Number | ❌ No | Minutes to prepare |
| `displayOrder` | Number | ❌ No | Custom ordering (default: 0) |

### **F&B Offer Fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | ✅ Yes | Offer name |
| `description` | String | ✅ Yes | Offer description |
| `type` | String | ✅ Yes | 'percentage', 'fixed', 'free_item', 'combo_discount' |
| `value` | Number | ✅ Yes | Discount amount or percentage |
| `code` | String | ❌ No | Promo code (optional) |
| `applicableItems` | Array | ❌ No | Specific item IDs |
| `applicableCategories` | Array | ❌ No | Categories this applies to |
| `minTickets` | Number | ❌ No | Minimum tickets required |
| `minAmount` | Number | ❌ No | Minimum purchase amount |
| `maxDiscount` | Number | ❌ No | Maximum discount (for percentage) |
| `validDays` | Array | ❌ No | Days of week (e.g., ['monday', 'friday']) |
| `validFrom` | Date | ✅ Yes | Start date |
| `validUntil` | Date | ✅ Yes | End date |
| `isActive` | Boolean | ❌ No | Is offer active? (default: true) |
| `priority` | Number | ❌ No | Higher = applied first (default: 0) |
| `usageLimit` | Number | ❌ No | Total usage limit (null = unlimited) |
| `cinemaId` | ObjectId | ❌ No | Make offer cinema-specific |
| `createdBy` | ObjectId | ✅ Yes | Admin user ID |

---

## 🖼️ Finding Images

### **Free Image Sources:**

1. **Unsplash** (Recommended)
   - Go to https://unsplash.com/
   - Search for your item (e.g., "popcorn", "pizza", "soda")
   - Right-click image → Copy image address
   - Use URL like: `https://images.unsplash.com/photo-xxxxx?w=400`

2. **Pexels**
   - Go to https://www.pexels.com/
   - Search and download
   - Upload to your server or use direct URL

3. **Your Own Images**
   - Upload to your server
   - Use relative path: `/images/popcorn.jpg`

---

## 🚀 Quick Examples

### **Add a New Snack:**

```bash
cd backend
# Edit addFBItem.js with:
{
  name: 'Loaded Nachos',
  category: 'snacks',
  description: 'Crispy nachos with cheese, jalapeños, and salsa',
  image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
  basePrice: 220,
  tags: ['popular', 'spicy'],
  isActive: true
}

# Run:
node addFBItem.js
```

### **Add a Weekend Offer:**

```bash
cd backend
# Edit addFBOffer.js with:
{
  title: 'Weekend Special',
  description: '20% off all items on weekends!',
  type: 'percentage',
  value: 20,
  validDays: ['saturday', 'sunday'],
  validFrom: new Date('2024-01-01'),
  validUntil: new Date('2025-12-31'),
  isActive: true,
  priority: 10,
  createdBy: adminId
}

# Run:
node addFBOffer.js
```

---

## 🔄 Updating Items

### **Method 1: Using MongoDB Compass**
1. Open MongoDB Compass
2. Connect to your database
3. Find `fbitems` collection
4. Edit the item directly
5. Save

### **Method 2: Using Script**

```javascript
// updateFBItem.js
import mongoose from 'mongoose';
import FBItem from './models/FBItem.js';

async function updateItem() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Find and update
  await FBItem.findOneAndUpdate(
    { name: 'Large Popcorn' }, // Find by name
    { basePrice: 280 }, // Update price
    { new: true }
  );
  
  console.log('✅ Item updated!');
  process.exit(0);
}

updateItem();
```

---

## 🗑️ Deactivating Items

Instead of deleting, set `isActive: false`:

```javascript
await FBItem.findOneAndUpdate(
  { name: 'Old Item' },
  { isActive: false }
);
```

This keeps the item in database but hides it from the menu.

---

## 📊 Viewing All Items

### **Method 1: MongoDB Compass**
- Open `fbitems` collection
- View all items

### **Method 2: Script**

```javascript
// listFBItems.js
import mongoose from 'mongoose';
import FBItem from './models/FBItem.js';

async function listItems() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const items = await FBItem.find({ isActive: true });
  console.log(`Found ${items.length} active items:`);
  items.forEach(item => {
    console.log(`- ${item.name} (${item.category}): Rs. ${item.basePrice}`);
  });
  
  process.exit(0);
}

listItems();
```

---

## 🎯 Best Practices

### **1. Item Names**
- ✅ Clear and descriptive: "Large Butter Popcorn"
- ❌ Vague: "Popcorn 1"

### **2. Descriptions**
- ✅ Appetizing: "Fresh, hot, and buttery popcorn"
- ❌ Boring: "Popcorn"

### **3. Pricing**
- Use consistent pricing tiers
- Small: Rs. 80-150
- Medium: Rs. 150-250
- Large: Rs. 250-350

### **4. Images**
- Use high-quality images (at least 400px wide)
- Consistent style across all items
- Show the actual product

### **5. Categories**
- Keep items in correct categories
- Use combos for bundled items
- Tag popular items

### **6. Offers**
- Don't stack too many offers
- Use priority to control order
- Set realistic date ranges
- Test offers before activating

---

## 🐛 Troubleshooting

### **Item not showing on menu?**
- Check `isActive: true`
- Verify category is correct
- Refresh the page
- Check browser console for errors

### **Offer not applying?**
- Check date range (validFrom/validUntil)
- Verify validDays includes current day
- Check minTickets/minAmount requirements
- Ensure `isActive: true`

### **Image not loading?**
- Verify URL is accessible
- Check for HTTPS (not HTTP)
- Try a different image URL
- Use Unsplash for reliable hosting

---

## 📞 Need Help?

If you need to add many items at once, you can:
1. Create a JSON file with all items
2. Use a bulk import script
3. Or wait for the admin panel (coming soon!)

---

## ✅ Quick Checklist

Before adding an item:
- [ ] Have a good image URL
- [ ] Decided on category
- [ ] Set appropriate price
- [ ] Written clear description
- [ ] Added relevant tags
- [ ] Tested the script

Before adding an offer:
- [ ] Defined offer type
- [ ] Set date range
- [ ] Configured conditions
- [ ] Set priority
- [ ] Tested calculation

---

**Happy adding! 🍿🥤🍕**

