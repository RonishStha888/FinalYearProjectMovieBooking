# 🏗️ Cinema Recommendation System Architecture

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER REQUEST                              │
│  (Cinema list + User context + Booking details)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              RECOMMENDATION SERVICE                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           SCORING ENGINE (Hybrid Model)                   │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ Price Score  │  │Discount Score│  │Promotion Score│  │  │
│  │  │   (35%)      │  │   (25%)      │  │   (20%)       │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘  │  │
│  │         │                  │                  │           │  │
│  │  ┌──────▼───────┐  ┌──────▼───────┐                     │  │
│  │  │ Food Offers  │  │  Amenities   │                     │  │
│  │  │   (15%)      │  │    (5%)      │                     │  │
│  │  └──────┬───────┘  └──────┬───────┘                     │  │
│  │         │                  │                             │  │
│  │         └──────────┬───────┘                             │  │
│  │                    ▼                                      │  │
│  │         ┌─────────────────────┐                          │  │
│  │         │  WEIGHTED TOTAL     │                          │  │
│  │         │  (Base Score)       │                          │  │
│  │         └──────────┬──────────┘                          │  │
│  └────────────────────┼──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │         PERSONALIZATION LAYER                             │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │  Favorites   │  │   Loyalty    │  │ Preferences  │  │  │
│  │  │   (+10%)     │  │   (+5%)      │  │   (+3%)      │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘  │  │
│  │         └──────────┬───────┴──────────────────┘           │  │
│  │                    ▼                                       │  │
│  │         ┌─────────────────────┐                           │  │
│  │         │ PERSONALIZED SCORE  │                           │  │
│  │         └──────────┬──────────┘                           │  │
│  └────────────────────┼──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │              RANKING & BADGING                            │  │
│  │                                                            │  │
│  │  • Sort by score (highest first)                          │  │
│  │  • Assign badges (Best Value, Top Pick, etc.)            │  │
│  │  • Generate reasons and savings                           │  │
│  │  • Create comparison matrix                               │  │
│  └────────────────────┬──────────────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE OUTPUT                               │
│                                                                  │
│  • Ranked recommendations (all cinemas)                         │
│  • Best choice (top cinema)                                     │
│  • Comparison matrix (for UI tables)                            │
│  • Recommendation message                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────┐
│   Frontend   │
│  (React UI)  │
└──────┬───────┘
       │ POST /api/recommendations/cinema-recommendations
       │ {cinemas, userContext, bookingContext}
       ▼
┌──────────────────────────────────────────────────────────┐
│                    Backend API                            │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Recommendation Routes                             │  │
│  │  (routes/recommendations.js)                       │  │
│  └────────────┬───────────────────────────────────────┘  │
│               │                                           │
│               ▼                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Recommendation Service                            │  │
│  │  (services/recommendationService.js)               │  │
│  │                                                     │  │
│  │  • getRecommendations()                            │  │
│  │  • calculateCinemaScore()                          │  │
│  │  • calculatePriceScore()                           │  │
│  │  • calculateDiscountScore()                        │  │
│  │  • calculatePromotionScore()                       │  │
│  │  • calculateFoodOfferScore()                       │  │
│  │  • calculateAmenitiesScore()                       │  │
│  │  • applyPersonalization()                          │  │
│  │  • getBadge()                                      │  │
│  └────────────┬───────────────────────────────────────┘  │
│               │                                           │
│               ▼                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Sample Data (for testing)                         │  │
│  │  (data/sampleCinemaData.js)                        │  │
│  │                                                     │  │
│  │  • sampleCinemas                                   │  │
│  │  • sampleUserContexts                              │  │
│  │  • sampleBookingContexts                           │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────┘
                            │
                            │ JSON Response
                            ▼
┌──────────────────────────────────────────────────────────┐
│                    Frontend UI                            │
│                                                           │
│  • Display ranked cinemas                                │
│  • Show badges and scores                                │
│  • Highlight savings                                     │
│  • Display reasons                                       │
│  • Comparison table                                      │
└──────────────────────────────────────────────────────────┘
```

---

## Scoring Algorithm Flow

```
FOR EACH Cinema:
  
  1. PRICE SCORING (35%)
     ├─ Get base price
     ├─ Determine price range
     ├─ Assign score (100-20)
     └─ Calculate total price × seats
  
  2. DISCOUNT SCORING (25%)
     ├─ Check day-based discounts
     │  ├─ Validate special conditions
     │  │  ├─ Student ID required?
     │  │  ├─ Gender requirement?
     │  │  └─ Minimum tickets?
     │  └─ Calculate savings
     ├─ Check membership discounts
     │  └─ Apply tier-based discount
     ├─ Check early bird discount
     │  └─ Verify booking advance days
     └─ Sum all applicable discounts
  
  3. PROMOTION SCORING (20%)
     ├─ Check active promotions
     │  ├─ Verify date range
     │  ├─ Check promotion type
     │  │  ├─ Percentage off
     │  │  ├─ Fixed amount
     │  │  └─ BOGO
     │  └─ Calculate savings
     └─ Select best promotion
  
  4. FOOD OFFER SCORING (15%)
     ├─ Check active food offers
     │  ├─ Free items
     │  ├─ Combo discounts
     │  └─ Percentage off F&B
     └─ Calculate value × seats
  
  5. AMENITIES SCORING (5%)
     ├─ Start with base score (50)
     ├─ Add points for features
     │  ├─ IMAX (+20)
     │  ├─ Dolby Atmos (+15)
     │  ├─ 4DX (+15)
     │  ├─ Recliners (+10)
     │  └─ Other features
     └─ Cap at 100
  
  6. CALCULATE WEIGHTED TOTAL
     Total = (Price × 0.35) + 
             (Discount × 0.25) + 
             (Promotion × 0.20) + 
             (Food × 0.15) + 
             (Amenities × 0.05)
  
  7. APPLY PERSONALIZATION
     ├─ Favorite cinema? × 1.10
     ├─ Frequent visitor? × 1.05
     └─ Preference match? × 1.03
  
  8. ASSIGN BADGE
     ├─ Savings ≥ 200? → Best Value
     ├─ Offers ≥ 3? → Most Offers
     ├─ Score ≥ 90? → Top Pick
     ├─ Price < 400? → Budget Friendly
     └─ Default → Recommended
  
  9. GENERATE REASONS
     ├─ List all discounts
     ├─ List all promotions
     └─ List all food offers

SORT Cinemas by score (descending)
RETURN Ranked list
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                               │
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │ Cinema List  │      │ Booking Form │                    │
│  │  Component   │      │  Component   │                    │
│  └──────┬───────┘      └──────┬───────┘                    │
│         │                     │                             │
│         └──────────┬──────────┘                             │
│                    │                                         │
│                    ▼                                         │
│         ┌─────────────────────┐                             │
│         │ Recommendation Hook │                             │
│         │ useRecommendations()│                             │
│         └──────────┬──────────┘                             │
│                    │                                         │
└────────────────────┼─────────────────────────────────────────┘
                     │ HTTP POST
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                  SERVER SIDE                                  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Express Router                                        │  │
│  │  /api/recommendations/cinema-recommendations          │  │
│  └────────────┬───────────────────────────────────────────┘  │
│               │                                               │
│               ▼                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Recommendation Service                                │  │
│  │  • Scoring algorithms                                  │  │
│  │  • Personalization logic                               │  │
│  │  • Ranking system                                      │  │
│  └────────────┬───────────────────────────────────────────┘  │
│               │                                               │
│               ▼                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Data Layer                                            │  │
│  │  • Cinema data                                         │  │
│  │  • User preferences                                    │  │
│  │  • Booking history                                     │  │
│  └────────────┬───────────────────────────────────────────┘  │
│               │                                               │
└───────────────┼───────────────────────────────────────────────┘
                │ JSON Response
                │
┌───────────────▼───────────────────────────────────────────────┐
│                    CLIENT SIDE                                 │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  UI Components                                         │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │   │
│  │  │ Cinema Cards │  │ Badge Display│  │ Comparison  │ │   │
│  │  │ with Scores  │  │ & Reasons    │  │   Table     │ │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Future Enhancement)

```
┌─────────────────────────────────────────────────────────────┐
│                      CINEMAS                                 │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                               │
│ name: String                                                │
│ location: String                                            │
│ type: String (premium, standard, luxury)                    │
│ pricing: {                                                  │
│   basePrice: Number                                         │
│   weekendPrice: Number                                      │
│   premiumSeatSurcharge: Number                             │
│ }                                                           │
│ discounts: [String] (days of week)                         │
│ membershipBenefits: {                                       │
│   silver: Number                                            │
│   gold: Number                                              │
│   platinum: Number                                          │
│ }                                                           │
│ activePromotions: [{                                        │
│   name: String                                              │
│   type: String                                              │
│   value: Number                                             │
│   startDate: Date                                           │
│   endDate: Date                                             │
│ }]                                                          │
│ foodOffers: [{                                              │
│   active: Boolean                                           │
│   type: String                                              │
│   item: String                                              │
│   value: Number                                             │
│ }]                                                          │
│ features: [String]                                          │
│ rating: Number                                              │
│ totalReviews: Number                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      USERS                                   │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                               │
│ name: String                                                │
│ email: String                                               │
│ isStudent: Boolean                                          │
│ gender: String                                              │
│ membership: String (silver, gold, platinum)                 │
│ favoriteCinemas: [ObjectId] → CINEMAS                      │
│ preferences: {                                              │
│   cinemaType: String                                        │
│   priceRange: String                                        │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   BOOKING_HISTORY                            │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                               │
│ userId: ObjectId → USERS                                    │
│ cinemaId: ObjectId → CINEMAS                                │
│ movieId: ObjectId → MOVIES                                  │
│ date: Date                                                  │
│ seats: Number                                               │
│ totalPrice: Number                                          │
│ discountsApplied: [String]                                  │
│ savingsAmount: Number                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              RECOMMENDATION_ANALYTICS                        │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                               │
│ userId: ObjectId → USERS                                    │
│ recommendedCinemaId: ObjectId → CINEMAS                     │
│ bookedCinemaId: ObjectId → CINEMAS                          │
│ recommendationScore: Number                                 │
│ wasAccepted: Boolean                                        │
│ timestamp: Date                                             │
│ context: {                                                  │
│   bookingDate: Date                                         │
│   seats: Number                                             │
│   movieId: ObjectId                                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## API Request/Response Flow

```
REQUEST:
POST /api/recommendations/cinema-recommendations
{
  "cinemas": [...],
  "userContext": {
    "userId": "user123",
    "isStudent": false,
    "membership": "gold",
    "favoriteCinemas": ["cinema1"],
    "bookingHistory": [...]
  },
  "bookingContext": {
    "date": "2024-02-15",
    "time": "18:00",
    "seats": 2,
    "movie": "Inception"
  }
}

        ↓

PROCESSING:
1. Validate input data
2. For each cinema:
   - Calculate price score
   - Calculate discount score
   - Calculate promotion score
   - Calculate food offer score
   - Calculate amenities score
   - Apply personalization
3. Rank cinemas by total score
4. Assign badges
5. Generate reasons
6. Calculate savings

        ↓

RESPONSE:
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
        "Free Popcorn with each ticket"
      ],
      "savings": 260,
      "finalPrice": 440,
      "badge": {
        "text": "🏆 Best Value",
        "color": "gold"
      }
    },
    ...
  ],
  "bestChoice": {...},
  "comparisonMatrix": [...],
  "message": "QFX Jai Nepal is your best choice! Save Rs. 260..."
}
```

---

## Scalability Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                    CURRENT SYSTEM                            │
│  • In-memory calculations                                   │
│  • Synchronous processing                                   │
│  • Single server                                            │
│  • Response time: ~50-100ms                                 │
│  • Handles: ~100 requests/second                            │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   SCALING PHASE 1                            │
│  • Add Redis caching                                        │
│  • Cache cinema data (TTL: 1 hour)                          │
│  • Cache user preferences (TTL: 24 hours)                   │
│  • Response time: ~10-20ms (cached)                         │
│  • Handles: ~500 requests/second                            │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   SCALING PHASE 2                            │
│  • Horizontal scaling (multiple servers)                    │
│  • Load balancer                                            │
│  • Distributed caching                                      │
│  • Async processing for analytics                           │
│  • Handles: ~2000 requests/second                           │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   SCALING PHASE 3                            │
│  • Microservices architecture                               │
│  • Dedicated recommendation service                         │
│  • Machine learning models                                  │
│  • Real-time personalization                                │
│  • Handles: ~10,000+ requests/second                        │
└─────────────────────────────────────────────────────────────┘
```

---

**This architecture is designed to be:**
- ✅ Modular and maintainable
- ✅ Scalable for growth
- ✅ Easy to test and debug
- ✅ Flexible for customization
- ✅ Production-ready

---

**Last Updated**: February 2024  
**Version**: 1.0.0
