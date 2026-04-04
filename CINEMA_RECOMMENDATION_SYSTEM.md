# 🎬 Cinema Recommendation System Documentation

## Overview

An intelligent, hybrid recommendation system that suggests the best cinema option for users based on multiple factors including price, discounts, promotions, food offers, and personalization.

---

## 🏗️ System Architecture

### **Model Type: Hybrid Scoring System**

The system combines three approaches:

1. **Weighted Scoring Model (70%)** - Quantitative factors
2. **Rule-Based Bonuses (20%)** - Special conditions and offers  
3. **Personalization Layer (10%)** - User preferences and history

---

## 📊 Scoring Formula

### **Total Score Calculation**

```
Total Score = (Price Score × 35%) + 
              (Discount Score × 25%) + 
              (Promotion Score × 20%) + 
              (Food Offer Score × 15%) + 
              (Amenities Score × 5%) + 
              Personalization Bonus
```

### **Weight Distribution**

| Factor | Weight | Description |
|--------|--------|-------------|
| **Price** | 35% | Base ticket price competitiveness |
| **Discounts** | 25% | Day-based and membership discounts |
| **Promotions** | 20% | Active promotional campaigns |
| **Food Offers** | 15% | Food & beverage deals |
| **Amenities** | 5% | Cinema quality and features |

---

## 🎯 Scoring Components

### **1. Price Score (0-100 points)**

Price ranges and corresponding scores:

| Price Range (NPR) | Category | Score |
|-------------------|----------|-------|
| ≤ 400 | Budget | 100 |
| 401-600 | Affordable | 80 |
| 601-800 | Standard | 60 |
| 801-1000 | Premium | 40 |
| > 1000 | Luxury | 20 |

**Formula:**
```javascript
score = getPriceRangeScore(basePrice)
```

---

### **2. Discount Score (0-100 points)**

#### **Day-Based Discounts**

| Day | Discount Name | Discount % | Special Conditions |
|-----|---------------|------------|-------------------|
| Monday | Monday Madness | 20% | None |
| Tuesday | Student Tuesday | 25% | Requires student ID |
| Wednesday | Midweek Special | 15% | None |
| Thursday | Ladies Night | 20% | Female customers only |
| Friday | Weekend Kickoff | 10% | None |
| Saturday | Family Day | 15% | Min 3 tickets |
| Sunday | Sunday Funday | 10% | None |

#### **Membership Discounts**

| Membership Tier | Typical Discount |
|-----------------|------------------|
| Silver | 8-12% |
| Gold | 12-18% |
| Platinum | 18-25% |

#### **Early Bird Discount**

- **Condition**: Booking 3+ days in advance
- **Typical Discount**: 10-20%

**Scoring Logic:**
```javascript
if (dayDiscount && eligible) score = 100
if (membershipDiscount) score = max(score, 80)
if (earlyBirdDiscount) score = max(score, 60)
```

---

### **3. Promotion Score (0-100 points)**

#### **Promotion Types**

| Type | Score | Example |
|------|-------|---------|
| Percentage Off | 100 | 20% off all tickets |
| Fixed Amount Off | 90 | Rs. 100 off per ticket |
| BOGO (Buy One Get One) | 100 | Buy 1 Get 1 Free |
| Bundle Deal | 85 | Family pack discount |

**Scoring Logic:**
```javascript
if (promotion.type === 'percentage') score = 100
if (promotion.type === 'fixed') score = 90
if (promotion.type === 'bogo' && seats >= 2) score = 100
```

---

### **4. Food Offer Score (0-100 points)**

#### **Food Offer Types**

| Type | Score | Example |
|------|-------|---------|
| Free Item | 100 | Free popcorn with ticket |
| Combo Discount | 80 | Rs. 100 off combo meals |
| Percentage Off | 70 | 25% off all F&B |

**Value Calculation:**
```javascript
savings = offerValue × numberOfSeats
```

---

### **5. Amenities Score (0-100 points)**

#### **Feature Scoring**

| Feature | Points |
|---------|--------|
| IMAX | +20 |
| Dolby Atmos | +15 |
| 4DX | +15 |
| Recliner Seats | +10 |
| VIP Lounge | +10 |
| Premium Parking | +5 |
| Online Food Order | +5 |
| Butler Service | +10 |

**Base Score**: 50 points  
**Maximum Score**: 100 points (capped)

---

## 🎨 Personalization Layer

### **Personalization Bonuses**

| Factor | Bonus Multiplier | Condition |
|--------|------------------|-----------|
| Favorite Cinema | ×1.10 (10%) | Cinema in user's favorites |
| Loyalty Bonus | ×1.05 (5%) | 5+ previous visits |
| Preference Match | ×1.03 (3%) | Cinema type matches preference |

**Formula:**
```javascript
personalizedScore = baseScore × favoriteBonus × loyaltyBonus × preferenceBonus
```

---

## 🏆 Badge System

Cinemas receive badges based on their performance:

| Badge | Condition | Color |
|-------|-----------|-------|
| 🏆 Best Value | Savings ≥ Rs. 200 | Gold |
| 🎁 Most Offers | 3+ active offers | Purple |
| ⭐ Top Pick | Score ≥ 90 | Blue |
| 💰 Budget Friendly | Final price < Rs. 400 | Green |
| ✨ Recommended | Default | Gray |

---

## 📡 API Endpoints

### **1. Get Cinema Recommendations**

```http
POST /api/recommendations/cinema-recommendations
```

**Request Body:**
```json
{
  "cinemas": [
    {
      "id": "qfx-jai-nepal",
      "name": "QFX Jai Nepal",
      "pricing": {
        "basePrice": 550,
        "weekendPrice": 650
      },
      "discounts": ["monday", "tuesday"],
      "membershipBenefits": {
        "silver": 10,
        "gold": 15,
        "platinum": 20
      },
      "activePromotions": [...],
      "foodOffers": [...],
      "features": ["IMAX", "Dolby Atmos"]
    }
  ],
  "userContext": {
    "userId": "user123",
    "isStudent": false,
    "membership": "gold",
    "favoriteCinemas": ["qfx-jai-nepal"],
    "bookingHistory": [...]
  },
  "bookingContext": {
    "date": "2024-02-15",
    "time": "18:00",
    "seats": 2,
    "movie": "Inception"
  }
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "cinema": {...},
      "score": 92.5,
      "breakdown": {
        "price": 80,
        "discounts": 100,
        "promotions": 90,
        "foodOffers": 85,
        "amenities": 95
      },
      "reasons": [
        "Monday Madness: 20% off today!",
        "Free Popcorn with each ticket (worth Rs. 150)"
      ],
      "savings": 260,
      "finalPrice": 440,
      "badge": {
        "text": "🏆 Best Value",
        "color": "gold"
      }
    }
  ],
  "bestChoice": {...},
  "comparisonMatrix": [...],
  "message": "QFX Jai Nepal is your best choice! Save Rs. 260 with Monday Madness: 20% off today! and Free Popcorn with each ticket."
}
```

---

### **2. Get Best Deal Only**

```http
POST /api/recommendations/best-deal
```

Returns only the top-ranked cinema.

---

### **3. Test Recommendations (Demo)**

```http
GET /api/test/recommendations/demo?userType=studentUser&bookingType=coupleTickets
```

**Available User Types:**
- `regularUser` - Standard user with no special benefits
- `studentUser` - Student with student discounts
- `premiumUser` - Platinum member with loyalty history
- `familyUser` - Family user preferring group deals

**Available Booking Types:**
- `singleTicket` - 1 seat, 2 days advance
- `coupleTickets` - 2 seats, 5 days advance
- `familyTickets` - 4 seats, 7 days advance (Saturday)
- `groupTickets` - 6 seats, next day

---

## 🔧 Configuration

### **Adjusting Weights**

Modify weights in `recommendationService.js`:

```javascript
this.weights = {
  price: 35,        // Adjust based on business priorities
  discounts: 25,
  promotions: 20,
  foodOffers: 15,
  amenities: 5
};
```

### **Adding New Discount Rules**

```javascript
this.discountRules = {
  newDay: {
    name: 'Special Day',
    discount: 30,
    requiresCustomCondition: true
  }
};
```

---

## 📈 Example Scenarios

### **Scenario 1: Budget-Conscious Student**

**Input:**
- User: Student with no membership
- Booking: 1 ticket, Tuesday
- Cinemas: All available

**Expected Output:**
- **Winner**: Cinema with highest student discount on Tuesday
- **Reasons**: Student Tuesday discount + Low base price
- **Badge**: 💰 Budget Friendly

---

### **Scenario 2: Premium Experience Seeker**

**Input:**
- User: Platinum member
- Booking: 2 tickets, Friday evening
- Cinemas: All available

**Expected Output:**
- **Winner**: Premium cinema with best amenities
- **Reasons**: Platinum discount + Premium features
- **Badge**: ⭐ Top Pick

---

### **Scenario 3: Family Weekend**

**Input:**
- User: Gold member
- Booking: 4 tickets, Saturday afternoon
- Cinemas: All available

**Expected Output:**
- **Winner**: Cinema with family day discount
- **Reasons**: Family Day: 15% off + Free items
- **Badge**: 🏆 Best Value

---

## 🚀 Future Enhancements

### **Phase 2: Machine Learning Integration**

1. **Collaborative Filtering**
   - Recommend based on similar users' preferences
   - "Users like you also enjoyed..."

2. **Time-Based Patterns**
   - Learn peak/off-peak preferences
   - Predict user's preferred showtimes

3. **Dynamic Pricing Prediction**
   - Forecast price changes
   - Suggest optimal booking times

### **Phase 3: Advanced Features**

1. **Location-Based Scoring**
   - Factor in distance from user
   - Traffic and travel time consideration

2. **Weather Integration**
   - Adjust recommendations based on weather
   - Indoor vs outdoor cinema preferences

3. **Social Integration**
   - Group booking recommendations
   - Friend preferences influence

4. **A/B Testing Framework**
   - Test different weight configurations
   - Optimize conversion rates

---

## 🧪 Testing

### **Unit Tests**

```bash
npm test -- recommendationService.test.js
```

### **Integration Tests**

```bash
npm test -- recommendations.integration.test.js
```

### **Manual Testing**

Use the demo endpoint:
```bash
curl http://localhost:5000/api/test/recommendations/demo?userType=studentUser&bookingType=familyTickets
```

---

## 📊 Performance Metrics

### **Key Metrics to Track**

1. **Recommendation Accuracy**
   - % of users who book recommended cinema
   - Average score difference between top 2 choices

2. **User Satisfaction**
   - Post-booking ratings
   - Repeat booking rate

3. **Business Impact**
   - Revenue per recommendation
   - Conversion rate improvement

4. **System Performance**
   - Response time (target: < 100ms)
   - Cache hit rate

---

## 🔐 Security Considerations

1. **Input Validation**
   - Sanitize all user inputs
   - Validate cinema data structure

2. **Rate Limiting**
   - Prevent recommendation API abuse
   - Implement per-user limits

3. **Data Privacy**
   - Anonymize user booking history
   - GDPR compliance for EU users

---

## 📝 Maintenance

### **Regular Updates Required**

1. **Weekly**: Update promotional offers
2. **Monthly**: Review and adjust weights based on metrics
3. **Quarterly**: Add new cinemas and features
4. **Annually**: Major algorithm improvements

---

## 🤝 Contributing

To add new features or improve the recommendation logic:

1. Update `recommendationService.js`
2. Add corresponding tests
3. Update this documentation
4. Submit pull request with performance metrics

---

## 📞 Support

For questions or issues:
- Email: dev@rtxcinema.com
- Slack: #recommendation-system
- Documentation: https://docs.rtxcinema.com/recommendations

---

**Last Updated**: February 2024  
**Version**: 1.0.0  
**Author**: RTX Cinema Development Team
