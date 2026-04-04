# 🍿 Admin F&B Management - Quick Guide

## 🚀 Getting Started

### Step 1: Access Admin Panel
1. Navigate to `http://localhost:5173/admin`
2. Login with your admin credentials
3. Click on **"🍿 Food & Beverages"** in the left sidebar

---

## 📝 Managing Menu Items

### Add a New Item:

1. **Click "🍿 Menu Items" tab** (if not already selected)

2. **Fill in the form:**
   - **Item Name:** e.g., "Large Butter Popcorn"
   - **Category:** Choose from dropdown (🍿 Popcorn, 🥤 Drinks, 🎁 Combos, 🍕 Snacks, 🍬 Candy)
   - **Description:** Brief description of the item
   - **Image URL:** Paste image URL (use Unsplash for free images)
   - **Base Price:** Price in NPR

3. **Optional Settings:**
   - ✅ **Is this a combo?** - Check if it's a combo deal
   - **Original Price** - For showing savings (if combo)
   - **Combo Items** - List items included (e.g., "1x Large Popcorn, 2x Drinks")
   - **Cinema** - Select specific cinema or leave empty for all
   - **Stock** - Set inventory limit or leave empty for unlimited
   - **Preparation Time** - Minutes to prepare (default: 5)
   - **Display Order** - Custom ordering (0 = default)
   - **Tags** - Select applicable tags (vegetarian, vegan, popular, new, spicy, gluten-free)
   - ✅ **Active** - Check to show on menu

4. **Click "Add Item"**

### Edit an Item:
- Click **"✏️ Edit"** button on any item card
- Modify the fields
- Click **"Update Item"**

### Delete an Item:
- Click **"🗑️ Delete"** button on any item card
- Confirm deletion
- Item will be soft-deleted (hidden from menu but kept in database)

---

## 🎁 Managing Offers

### Add a New Offer:

1. **Click "🎁 Offers" tab**

2. **Fill in the form:**
   - **Offer Title:** e.g., "Weekend Special"
   - **Promo Code:** Optional code (e.g., "WEEKEND20")
   - **Description:** Explain the offer
   - **Offer Type:** Choose from:
     - Percentage Discount (e.g., 20% off)
     - Fixed Amount Off (e.g., NPR 100 off)
     - Free Item
     - Combo Discount
   - **Value:** Discount amount or percentage
   - **Valid From/Until:** Date range

3. **Optional Conditions:**
   - **Min Tickets:** Minimum tickets required (e.g., 4 for group discount)
   - **Min Amount:** Minimum purchase amount in NPR
   - **Max Discount:** Cap for percentage discounts
   - **Priority:** Higher number = applied first (default: 0)
   - **Usage Limit:** Total times offer can be used
   - **Applicable Categories:** Select which categories (leave empty for all)
   - **Valid Days:** Select specific days of week (leave empty for all days)
   - **Cinema:** Select specific cinema or leave empty for all
   - ✅ **Active** - Check to enable offer

4. **Click "Add Offer"**

### Edit an Offer:
- Click **"✏️ Edit"** button on any offer
- Modify the fields
- Click **"Update Offer"**

### Delete an Offer:
- Click **"🗑️ Delete"** button on any offer
- Confirm deletion
- Offer will be permanently removed

---

## 💡 Quick Examples

### Example 1: Add a Simple Item
```
Name: Chocolate Bar
Category: Candy
Description: Smooth milk chocolate
Image: https://images.unsplash.com/photo-1511381939415-e44015466834?w=400
Base Price: 80
Tags: vegetarian
Active: ✓
```

### Example 2: Add a Combo
```
Name: Movie Night Combo
Category: Combos
Description: Perfect combo for movie night!
Base Price: 600
Original Price: 750
Is Combo: ✓
Combo Items: 1x Large Popcorn, 2x Soft Drinks, 1x Nachos
Tags: popular
Active: ✓
```

### Example 3: Weekend Offer
```
Title: Weekend Special
Description: 20% off all items on weekends!
Type: Percentage Discount
Value: 20
Valid Days: Saturday, Sunday
Valid From: 2024-01-01
Valid Until: 2025-12-31
Active: ✓
```

### Example 4: Group Discount
```
Title: Group Discount
Description: 15% off for groups of 4 or more
Type: Percentage Discount
Value: 15
Min Tickets: 4
Valid From: 2024-01-01
Valid Until: 2025-12-31
Active: ✓
```

### Example 5: Cinema-Specific Item
```
Name: QFX Special Burger
Category: Snacks
Description: Exclusive to QFX Cinemas
Cinema: QFX Cinemas
Base Price: 250
Tags: new
Active: ✓
```

---

## 🎨 Finding Images

### Free Image Sources:

**Unsplash (Recommended):**
1. Go to https://unsplash.com/
2. Search for your item (e.g., "popcorn", "pizza", "soda")
3. Right-click image → Copy image address
4. Paste URL in Image field

**Example URLs:**
- Popcorn: `https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400`
- Drinks: `https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400`
- Pizza: `https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400`
- Nachos: `https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400`

---

## 📊 Understanding the Display

### Menu Items Grid:
- **Card Layout:** Each item shown as a card with image
- **Category Icon:** Visual indicator (🍿🥤🎁🍕🍬)
- **Price Display:** Shows current price and savings
- **Badges:** 
  - Green "Combo" badge for combo items
  - Gray "Inactive" badge for disabled items
- **Cinema Tag:** Shows if item is cinema-specific
- **Tags:** Small pills showing item attributes

### Offers List:
- **Offer Title:** Main heading
- **Promo Code:** Red badge if code exists
- **Value:** Green text showing discount
- **Dates:** Valid date range
- **Conditions:** Min tickets, min amount displayed
- **Usage:** Shows used/limit if usage limit set
- **Status:** Gray "Inactive" badge if disabled

---

## ✅ Best Practices

### For Menu Items:
1. **Use clear, descriptive names** - "Large Butter Popcorn" not "Popcorn 1"
2. **Write appetizing descriptions** - "Fresh, hot, and buttery" not just "Popcorn"
3. **Use high-quality images** - At least 400px wide
4. **Set realistic prices** - Check competitor pricing
5. **Tag popular items** - Helps customers find favorites
6. **Use combos wisely** - Show clear savings

### For Offers:
1. **Clear titles** - "Weekend Special" not "Offer 1"
2. **Explain the benefit** - "20% off all items on weekends!"
3. **Set realistic dates** - Don't make offers too short or too long
4. **Use priority** - Higher priority offers apply first
5. **Test conditions** - Make sure min tickets/amount make sense
6. **Monitor usage** - Set limits to control costs

---

## 🔍 Troubleshooting

### Item not showing on customer menu?
- ✅ Check "Active" is checked
- ✅ Verify category is correct
- ✅ Refresh the customer page
- ✅ Check browser console for errors

### Offer not applying?
- ✅ Check date range (Valid From/Until)
- ✅ Verify Valid Days includes current day
- ✅ Check Min Tickets/Min Amount requirements
- ✅ Ensure "Active" is checked
- ✅ Check if usage limit reached

### Image not loading?
- ✅ Verify URL is accessible
- ✅ Use HTTPS (not HTTP)
- ✅ Try a different image URL
- ✅ Use Unsplash for reliable hosting

---

## 📞 Need Help?

If you need to:
- **Add many items at once** - Use the bulk import script (see HOW_TO_ADD_FB_ITEMS.md)
- **Update prices** - Edit items individually or use database script
- **View analytics** - Check the Analytics section (coming soon)
- **Export data** - Use MongoDB Compass or database export

---

## 🎯 Quick Checklist

Before adding an item:
- [ ] Have a good image URL
- [ ] Decided on category
- [ ] Set appropriate price
- [ ] Written clear description
- [ ] Added relevant tags
- [ ] Checked "Active" if ready to show

Before adding an offer:
- [ ] Defined offer type
- [ ] Set date range
- [ ] Configured conditions
- [ ] Set priority if needed
- [ ] Checked "Active" if ready to use

---

**Happy Managing! 🍿🥤🎁**

For detailed technical documentation, see: `ADMIN_FB_MANAGEMENT_COMPLETE.md`
For adding items via script, see: `HOW_TO_ADD_FB_ITEMS.md`
