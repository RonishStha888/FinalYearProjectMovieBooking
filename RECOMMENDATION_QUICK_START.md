# 🚀 Cinema Recommendation System - Quick Start Guide

## Installation

The recommendation system is already integrated into your RTX Cinema backend. No additional installation required!

---

## Testing the System

### **1. Start Your Servers**

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

---

### **2. Test with Sample Data**

#### **Basic Test**
```bash
curl http://localhost:5000/api/test/recommendations/demo
```

#### **Student User Test**
```bash
curl "http://localhost:5000/api/test/recommendations/demo?userType=studentUser&bookingType=coupleTickets"
```

#### **Premium User Test**
```bash
curl "http://localhost:5000/api/test/recommendations/demo?userType=premiumUser&bookingType=singleTicket"
```

#### **Family Booking Test**
```bash
curl "http://localhost:5000/api/test/recommendations/demo?userType=familyUser&bookingType=familyTickets"
```

---

### **3. View Available Test Scenarios**

```bash
curl http://localhost:5000/api/test/recommendations/scenarios
```

**Response:**
```json
{
  "success": true,
  "availableScenarios": {
    "userTypes": ["regularUser", "studentUser", "premiumUser", "familyUser"],
    "bookingTypes": ["singleTicket", "coupleTickets", "familyTickets", "groupTickets"]
  }
}
```

---

## Understanding the Response

### **Sample Response Structure**

```json
{
  "success": true,
  "recommendations": [
    {
      "cinema": {
        "name": "QFX Jai Nepal",
        "location": "Chabahil, Kathmandu"
      },
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
  "message": "QFX Jai Nepal is your best choice! Save Rs. 260..."
}
```

### **Key Fields Explained**

| Field | Description |
|-------|-------------|
| `score` | Overall recommendation score (0-100) |
| `breakdown` | Individual component scores |
| `reasons` | Human-readable reasons for recommendation |
| `savings` | Total amount saved (NPR) |
| `finalPrice` | Price after all discounts |
| `badge` | Visual badge for UI display |

---

## Integration Examples

### **Example 1: Get Recommendations in Your Booking Flow**

```javascript
// In your booking component
const getRecommendations = async (cinemas, user, booking) => {
  const response = await fetch('http://localhost:5000/api/recommendations/cinema-recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cinemas: cinemas,
      userContext: {
        userId: user.id,
        isStudent: user.isStudent,
        membership: user.membershipTier,
        favoriteCinemas: user.favorites
      },
      bookingContext: {
        date: booking.date,
        time: booking.time,
        seats: booking.numberOfSeats,
        movie: booking.movieTitle
      }
    })
  });
  
  const data = await response.json();
  return data.recommendations;
};
```

---

### **Example 2: Display Best Deal Badge**

```javascript
// Show the best deal to users
const BestDealBadge = ({ cinema }) => {
  return (
    <div className={`badge badge-${cinema.badge.color}`}>
      {cinema.badge.text}
    </div>
  );
};
```

---

### **Example 3: Show Savings Information**

```javascript
// Display savings prominently
const SavingsDisplay = ({ recommendation }) => {
  if (recommendation.savings > 0) {
    return (
      <div className="savings-banner">
        <span className="savings-amount">
          Save Rs. {recommendation.savings}
        </span>
        <span className="original-price">
          Was Rs. {recommendation.basePrice}
        </span>
        <span className="final-price">
          Now Rs. {recommendation.finalPrice}
        </span>
      </div>
    );
  }
  return null;
};
```

---

## Common Use Cases

### **Use Case 1: Cinema Selection Page**

Show all cinemas ranked by recommendation score:

```javascript
const CinemaList = ({ recommendations }) => {
  return (
    <div className="cinema-list">
      {recommendations.map((rec, index) => (
        <CinemaCard 
          key={rec.cinema.id}
          cinema={rec.cinema}
          rank={index + 1}
          score={rec.score}
          badge={rec.badge}
          savings={rec.savings}
          reasons={rec.reasons}
        />
      ))}
    </div>
  );
};
```

---

### **Use Case 2: Quick Booking with Best Deal**

Auto-select the best cinema for quick bookings:

```javascript
const QuickBook = async (movie, user) => {
  const cinemas = await fetchAvailableCinemas(movie);
  const recommendations = await getRecommendations(cinemas, user, {
    date: new Date(),
    seats: 1
  });
  
  // Auto-select best choice
  const bestCinema = recommendations.bestChoice;
  navigateToBooking(bestCinema);
};
```

---

### **Use Case 3: Comparison View**

Show side-by-side comparison:

```javascript
const ComparisonTable = ({ comparisonMatrix }) => {
  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th>Cinema</th>
          <th>Score</th>
          <th>Price</th>
          <th>Savings</th>
          <th>Top Offers</th>
        </tr>
      </thead>
      <tbody>
        {comparisonMatrix.map(cinema => (
          <tr key={cinema.name}>
            <td>{cinema.name}</td>
            <td>{cinema.score}</td>
            <td>Rs. {cinema.price}</td>
            <td className="savings">Rs. {cinema.savings}</td>
            <td>{cinema.topReasons.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

## Customization

### **Adjust Recommendation Weights**

Edit `backend/services/recommendationService.js`:

```javascript
this.weights = {
  price: 40,        // Increase if price is most important
  discounts: 20,    // Decrease if less important
  promotions: 20,
  foodOffers: 15,
  amenities: 5
};
```

### **Add New Discount Days**

```javascript
this.discountRules = {
  // ... existing rules
  specialDay: {
    name: 'Special Event Day',
    discount: 30,
    requiresSpecialCode: true
  }
};
```

---

## Troubleshooting

### **Issue: No recommendations returned**

**Solution**: Check that cinema data includes all required fields:
- `pricing.basePrice`
- `discounts` array
- `activePromotions` array
- `foodOffers` array

### **Issue: Scores seem incorrect**

**Solution**: Verify weight configuration and ensure all scoring components are working:

```bash
# Test individual components
curl "http://localhost:5000/api/test/recommendations/demo" | jq '.recommendations[0].breakdown'
```

### **Issue: Personalization not working**

**Solution**: Ensure user context includes:
- `userId`
- `favoriteCinemas` array
- `bookingHistory` array
- `preferences` object

---

## Next Steps

1. ✅ Test the system with sample data
2. ✅ Integrate into your booking flow
3. ✅ Customize weights based on your business needs
4. ✅ Add your actual cinema data
5. ✅ Monitor performance metrics
6. ✅ Gather user feedback
7. ✅ Iterate and improve

---

## Support

Need help? Check:
- 📖 Full documentation: `CINEMA_RECOMMENDATION_SYSTEM.md`
- 🐛 Issues: Create a GitHub issue
- 💬 Questions: Contact the development team

---

**Happy Recommending! 🎬🍿**
