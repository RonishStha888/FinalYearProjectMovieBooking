# 🎯 Cinema Recommendation System - Admin Panel Integration

## ✅ Integration Complete

The recommendation system now uses **real cinema and showtime data** created by your admin panel instead of sample data.

---

## 🔄 How It Works

### **Data Flow:**

```
Admin Panel
    ↓
Creates: Movies, Cinemas, Halls, Showtimes
    ↓
Stored in MongoDB Database
    ↓
User Selects Movie & Date
    ↓
BookingPage fetches real showtimes
    ↓
CinemaRecommendations component receives data
    ↓
Extracts pricing, amenities, hall types
    ↓
Recommendation Engine analyzes
    ↓
Shows best cinema with reasons
```

---

## 📊 Data Sources from Admin Panel

### **1. Cinema Data** (`Cinema` Model)
- **Name**: Cinema name (e.g., "QFX Jai Nepal")
- **Location**: Cinema location/address
- **City**: City where cinema is located
- **Distance**: Distance from user
- **Rating**: Cinema rating (0-5)
- **Amenities**: Features like Parking, Food Court, AC, Dolby Atmos, IMAX, 3D

### **2. Hall Data** (`Hall` Model)
- **Type**: REGULAR 2D, GOLD CLASS 2D, PREMIUM 2D, 3D, IMAX
- **Total Seats**: Capacity of the hall
- **Pricing**: Base price and weekend price
- **Features**: Dolby Atmos, Recliner Seats, AC, Food Service

### **3. Showtime Data** (`Showtime` Model)
- **Date & Time**: When the movie is showing
- **Price**: Actual ticket price for this showtime
- **Original Price**: Original price (for discount calculation)
- **Available Seats**: Real-time seat availability

### **4. Promotion Data** (`Promotion` Model) - *Coming Soon*
- **Type**: percentage, fixed, bogo, free_seat
- **Value**: Discount amount or percentage
- **Valid Dates**: When promotion is active
- **Applicable Cinemas**: Which cinemas offer this promotion

---

## 🎨 What Gets Analyzed

### **Price Comparison (35% weight)**
- Uses **minimum price** from all showtimes at that cinema
- Compares across all available cinemas
- Considers weekend vs weekday pricing

### **Discount Availability (25% weight)**
- **Day-based discounts**: Monday, Wednesday, Friday
- **Student discounts**: Tuesday (if user is student)
- **Ladies Night**: Thursday (if user is female)
- **Family Day**: Saturday (for 3+ tickets)
- **Early Bird**: 15% off for bookings 3+ days in advance

### **Promotions (20% weight)**
- Active promotions from admin panel
- Cinema-specific offers
- Global promotions

### **Food Offers (15% weight)**
- Free popcorn if cinema has Food Court
- Combo discounts
- Beverage offers

### **Amenities (5% weight)**
- IMAX: +20 points
- Dolby Atmos: +15 points
- 4DX: +15 points
- Recliner Seats: +10 points
- VIP Lounge: +10 points
- Premium Parking: +5 points

---

## 🔧 How Data is Extracted

### **From BookingPage Showtime Data:**

```javascript
// Cinema structure received from BookingPage
{
  cinema: {
    _id: "cinema123",
    name: "QFX Jai Nepal",
    location: "Civil Mall",
    rating: 4.5,
    amenities: ["IMAX", "Food Court", "Parking", "Dolby Atmos"]
  },
  halls: {
    "hall1": {
      hall: {
        _id: "hall123",
        type: "GOLD CLASS 2D",
        totalSeats: 150
      },
      showtimes: [
        {
          time: "14:30",
          price: 500,
          originalPrice: 600,
          availableSeats: 120
        },
        {
          time: "18:00",
          price: 550,
          originalPrice: 600,
          availableSeats: 100
        }
      ]
    }
  }
}
```

### **Extracted for Recommendations:**

```javascript
{
  id: "cinema123",
  name: "QFX Jai Nepal",
  location: "Civil Mall",
  type: "premium", // Determined from IMAX amenity
  pricing: {
    basePrice: 500, // Minimum price from all showtimes
    weekendPrice: 550
  },
  features: ["IMAX", "Food Court", "Parking", "Dolby Atmos", "Gold Class"],
  rating: 4.5,
  availableSeats: 220, // Sum of all available seats
  totalShowtimes: 2
}
```

---

## 🎯 Recommendation Logic

### **Cinema Type Classification:**
- **Premium**: Has IMAX, Dolby Atmos, or Gold Class
- **Standard**: Regular amenities

### **Price Scoring:**
- Budget (< Rs. 400): 100 points
- Affordable (Rs. 400-600): 80 points
- Standard (Rs. 600-800): 60 points
- Premium (Rs. 800-1000): 40 points
- Luxury (> Rs. 1000): 20 points

### **Discount Scoring:**
- Day matches discount day: 100 points + savings calculated
- Membership discount: 80 points + savings
- Early bird (3+ days advance): 60 points + savings

### **Food Offer Scoring:**
- Free item (e.g., popcorn): 100 points + value saved
- Combo discount: 80 points + discount amount
- Percentage off: 70 points

---

## 📈 Example Calculation

### **Scenario: Monday Booking**

**Cinema A: QFX Jai Nepal**
- Base Price: Rs. 500
- Has IMAX: +20 amenity points
- Has Food Court: Free popcorn (Rs. 150 value)
- Monday discount: 20% off (Rs. 100 saved)
- **Total Score: 92.5/100**
- **Final Price: Rs. 400**
- **Savings: Rs. 250**

**Cinema B: FCube Labim**
- Base Price: Rs. 450
- Standard amenities: +10 points
- No food offers
- Monday discount: 20% off (Rs. 90 saved)
- **Total Score: 85.0/100**
- **Final Price: Rs. 360**
- **Savings: Rs. 90**

**Cinema C: Big Movies**
- Base Price: Rs. 350
- Basic amenities: +5 points
- No special offers
- **Total Score: 78.0/100**
- **Final Price: Rs. 350**
- **Savings: Rs. 0**

**Winner: Cinema A** (Best overall value despite higher base price)

---

## 🚀 Admin Panel Integration Points

### **What Admins Can Control:**

1. **Cinema Amenities**
   - Add/remove amenities in Cinema management
   - Affects amenity scoring

2. **Hall Types**
   - Create GOLD CLASS, IMAX, 3D halls
   - Affects cinema type classification

3. **Showtime Pricing**
   - Set different prices for different times
   - System uses minimum price for comparison

4. **Promotions** (Future Enhancement)
   - Create promotions in admin panel
   - Automatically included in recommendations

---

## 🔮 Future Enhancements

### **Phase 1: Real Promotion Integration** (Next)
- Fetch active promotions from database
- Apply cinema-specific promotions
- Show promotion codes in recommendations

### **Phase 2: Dynamic Discount Rules**
- Admin can configure discount days
- Custom discount percentages
- User group-based discounts

### **Phase 3: Advanced Personalization**
- User booking history
- Favorite cinemas
- Preferred cinema types
- Location-based recommendations

### **Phase 4: Machine Learning**
- Learn from user choices
- Predict best recommendations
- Optimize weights automatically

---

## 🎬 Testing the Integration

### **1. Add Cinema in Admin Panel**
```
Name: Test Cinema
Location: Test Location
Amenities: IMAX, Food Court, Parking
Rating: 4.5
```

### **2. Add Hall**
```
Type: GOLD CLASS 2D
Total Seats: 150
Base Price: Rs. 500
Weekend Price: Rs. 550
```

### **3. Add Showtime**
```
Movie: Any active movie
Date: Today or tomorrow
Time: 14:30
Price: Rs. 500
```

### **4. Test on Website**
1. Go to http://localhost:5173/
2. Select the movie
3. Select the date
4. **See recommendation banner appear!**
5. Check if price matches your showtime price
6. Verify amenities are shown correctly

---

## 📊 Recommendation Display

### **Best Deal Banner Shows:**
- ⭐ Cinema name
- 💰 Savings amount (if any)
- 🎫 Final price per ticket
- 📊 Overall score (0-100)
- ✅ Reasons (discounts, offers, features)

### **Comparison Table Shows:**
- All cinemas ranked by score
- Price comparison
- Savings comparison
- Top offers for each cinema
- Badge (Best Value, Top Pick, Budget Friendly, etc.)

---

## 🐛 Troubleshooting

### **Issue: Recommendations not showing**
**Check:**
- Are there cinemas with showtimes for selected date?
- Is the date selected?
- Check browser console for errors

### **Issue: Prices don't match**
**Check:**
- Verify showtime prices in admin panel
- System uses minimum price from all showtimes
- Check if discounts are being applied

### **Issue: Wrong amenities shown**
**Check:**
- Cinema amenities in admin panel
- Hall types (IMAX, Gold Class, etc.)
- Features are combined from cinema + halls

---

## 📝 Summary

✅ **Recommendation system now uses:**
- Real cinema data from admin panel
- Actual showtime prices
- Real amenities and features
- Live seat availability
- Hall types and classifications

✅ **Admins can control:**
- Cinema information and amenities
- Hall types and pricing
- Showtime prices
- (Soon) Promotions and discounts

✅ **Users see:**
- Best cinema recommendation
- Real savings calculations
- Actual prices from admin panel
- Transparent comparison

---

**Status**: ✅ Fully Integrated with Admin Panel  
**Version**: 2.0.0  
**Last Updated**: February 2024
