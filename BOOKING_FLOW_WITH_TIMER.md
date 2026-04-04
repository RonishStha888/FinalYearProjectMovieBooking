# 🎬 Complete Booking Flow with Timer System

## 📊 Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOME PAGE                                │
│  [Browse Movies] [Search] [Filter by Genre] [Profile]           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [Click Movie Card]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BOOKING PAGE                                │
│  Step 1: Select Date     [Today] [Tomorrow] [Mar 10] ...        │
│  Step 2: Select Cinema   [QFX Jai Nepal] [FCube] [Big Movies]   │
│  Step 3: Select Time     [10:00 AM] [1:00 PM] [4:00 PM] ...     │
│                                                                   │
│  [Proceed to Seat Selection] ────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SEAT SELECTION PAGE                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [← Back]  Movie Title - Cinema    [⏰ 10:00] [AR View]  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ⚡ TIMER STARTS HERE (10 minutes)                               │
│                                                                   │
│                        [SCREEN]                                  │
│                                                                   │
│     A  [1] [2] [3] [4] [5] [6] [7] [8]                          │
│     B  [1] [2] [3] [4] [5] [6] [7] [8]                          │
│     C  [1] [2] [3] [4] [5] [6] [7] [8]  ← Premium Rows          │
│     D  [1] [2] [3] [4] [5] [6] [7] [8]                          │
│                                                                   │
│  Selected: A5, A6, A7                                            │
│  Total: Rs. 1,500                                                │
│                                                                   │
│  [Proceed to F&B] ───────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  F&B PROMPT MODAL                                │
│                                                                   │
│  🍿 Would you like to add Food & Beverages?                      │
│                                                                   │
│  Enhance your movie experience with our delicious menu!          │
│                                                                   │
│     [Yes, Show Menu]          [No, Skip to Payment]              │
└─────────────────────────────────────────────────────────────────┘
         ↓                                    ↓
    [Yes Selected]                       [No Selected]
         ↓                                    ↓
         ↓                                    └──────────────┐
         ↓                                                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                 FOOD & BEVERAGE PAGE                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [← Back]  Food & Beverages    [⏰ 9:15] [🛒 Cart: 3]    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ⚡ TIMER CONTINUES (countdown from previous page)               │
│                                                                   │
│  Categories: [All] [🍿 Popcorn] [🥤 Drinks] [🍔 Combos]         │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │ Popcorn  │  │  Coke    │  │  Combo   │                       │
│  │  Large   │  │  Medium  │  │  Deal    │                       │
│  │ Rs. 250  │  │ Rs. 150  │  │ Rs. 450  │                       │
│  │ [+ Add]  │  │ [+ Add]  │  │ [+ Add]  │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
│                                                                   │
│  Cart Total: Rs. 850                                             │
│                                                                   │
│  [Continue to Payment]  [Skip F&B] ──────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT PAGE                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [← Back]  Complete Payment    [⏰ 7:45] [🔒 Secure]      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ⚡ TIMER CONTINUES (final countdown)                            │
│                                                                   │
│  ┌─────────────────────────┐  ┌──────────────────────────────┐  │
│  │   Booking Summary       │  │   Payment Method             │  │
│  │                         │  │                              │  │
│  │  Movie: Avengers        │  │  [💳 Card] [📱 eSewa]       │  │
│  │  Seats: A5, A6, A7      │  │  [💜 Khalti]                │  │
│  │  Tickets: Rs. 1,500     │  │                              │  │
│  │  F&B: Rs. 850           │  │  Card Number: ____________  │  │
│  │  Fee: Rs. 25            │  │  Expiry: ____  CVV: ___     │  │
│  │  GST: Rs. 428           │  │  Name: __________________   │  │
│  │  ─────────────────      │  │                              │  │
│  │  Total: Rs. 2,803       │  │  [Pay Rs. 2,803]            │  │
│  └─────────────────────────┘  └──────────────────────────────┘  │
│                                                                   │
│  🔒 256-bit SSL Encryption | PCI DSS Compliant                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [Payment Processing]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      TICKET PAGE                                 │
│                                                                   │
│  ✅ Booking Confirmed!                                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🎬 RTX CINEMA                                          │    │
│  │                                                          │    │
│  │  Movie: Avengers: Endgame                               │    │
│  │  Cinema: QFX Jai Nepal                                  │    │
│  │  Date: March 8, 2026                                    │    │
│  │  Time: 4:00 PM                                          │    │
│  │  Seats: A5, A6, A7                                      │    │
│  │                                                          │    │
│  │  Booking ID: RTX1709876543210                           │    │
│  │  Transaction: TXN9876543210ABC                          │    │
│  │                                                          │    │
│  │  [QR CODE]                                              │    │
│  │                                                          │    │
│  │  Show this at the cinema entrance                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Download Ticket] [Share] [Back to Home]                        │
│                                                                   │
│  🎉 You earned 45 loyalty points!                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Timer Behavior

### Timer States:

```
┌─────────────────────────────────────────────────────────────┐
│  TIMER STATE 1: Normal (10:00 - 1:01)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ⏰ Time Remaining: 9:45                              │   │
│  │ Background: Green                                     │   │
│  │ Animation: None                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  TIMER STATE 2: Warning (1:00 - 0:01)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ⚠️ Time Remaining: 0:45                              │   │
│  │ Background: Orange                                    │   │
│  │ Animation: Pulsing                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  TIMER STATE 3: Expired (0:00)                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ❌ Alert: "Your seat hold has expired"               │   │
│  │ Action: Auto-redirect to Seat Selection              │   │
│  │ Seats: Released automatically                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Timer Persistence

### How Timer State is Maintained:

```javascript
// BookingPage.jsx - Parent component manages timer
const [holdExpiresAt, setHoldExpiresAt] = useState(null);

// When seats are selected:
setHoldExpiresAt(Date.now() + 10 * 60 * 1000); // 10 minutes

// Pass to all child pages:
<SeatSelection holdExpiresAt={holdExpiresAt} />
<FoodBeveragePage holdExpiresAt={holdExpiresAt} />
<PaymentPage holdExpiresAt={holdExpiresAt} />

// Each page calculates remaining time:
const remaining = Math.floor((holdExpiresAt - Date.now()) / 1000);
```

### Timer Flow:

```
Seat Selection (10:00)
       ↓
   User selects seats
       ↓
   holdExpiresAt = now + 600 seconds
       ↓
F&B Page (9:15) ← Timer continues from previous page
       ↓
   User adds items
       ↓
   Same holdExpiresAt value
       ↓
Payment Page (7:45) ← Timer still counting down
       ↓
   User completes payment
       ↓
   Timer stops, seats confirmed
```

---

## 🏆 Loyalty Points Flow

### Points Earning:

```
┌─────────────────────────────────────────────────────────────┐
│  BOOKING COMPLETED                                           │
│  ├─ Tickets: 3 × Rs. 500 = Rs. 1,500                        │
│  ├─ F&B: Rs. 850                                             │
│  ├─ Total: Rs. 2,350                                         │
│  └─ Payment: Successful                                      │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  POINTS CALCULATION                                          │
│  ├─ Per Ticket: 3 × 10 = 30 points                          │
│  ├─ Per Rs. 100: 2,350 ÷ 100 × 5 = 118 points               │
│  ├─ First Booking Bonus: 50 points (if first)               │
│  ├─ Tier Bonus (Bronze): 0% = 0 points                      │
│  └─ TOTAL EARNED: 198 points                                │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  PROFILE UPDATE                                              │
│  ├─ Available Points: 0 → 198                               │
│  ├─ Lifetime Points: 0 → 198                                │
│  ├─ Tier: Bronze (need 500 for Silver)                      │
│  └─ Progress: 39.6% to Silver                               │
└─────────────────────────────────────────────────────────────┘
```

### Tier Progression:

```
🥉 Bronze (0-499 pts)
   ↓ Need 500 points
🥈 Silver (500-1,999 pts) +5% bonus
   ↓ Need 2,000 points
🥇 Gold (2,000-4,999 pts) +10% bonus
   ↓ Need 5,000 points
💎 Platinum (5,000+ pts) +15% bonus
```

---

## 🎨 UI States

### Seat States:

```
┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
│  1  │  │  2  │  │  3  │  │  4  │  │  5  │
│ ✅  │  │ 🔒  │  │ ⏳  │  │ ❌  │  │ 👑  │
└─────┘  └─────┘  └─────┘  └─────┘  └─────┘
Available Selected  Held    Booked  Premium
(Green)  (Blue)   (Yellow) (Gray)  (Gold)
```

### Payment Methods:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   💳 Card    │  │  📱 eSewa    │  │  💜 Khalti   │
│              │  │              │  │              │
│  ✅ Working  │  │  ✅ Working  │  │  🔄 Needs    │
│  (Demo)      │  │  (Demo)      │  │  Real Keys   │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 📱 Responsive Design

### Desktop View:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo | Navigation | Profile | Timer                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │  Booking Summary │  │  Main Content Area           │    │
│  │                  │  │                              │    │
│  │  Movie Info      │  │  Seat Map / F&B Menu /       │    │
│  │  Selected Items  │  │  Payment Form                │    │
│  │  Price Breakdown │  │                              │    │
│  │                  │  │                              │    │
│  └──────────────────┘  └──────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Mobile View:
```
┌──────────────────────┐
│  Header + Timer      │
├──────────────────────┤
│                      │
│  Main Content        │
│  (Full Width)        │
│                      │
│  Seat Map /          │
│  F&B Menu /          │
│  Payment Form        │
│                      │
├──────────────────────┤
│  Booking Summary     │
│  (Sticky Footer)     │
└──────────────────────┘
```

---

## 🔄 State Management

### Key States:

```javascript
// BookingPage.jsx
const [selectedDate, setSelectedDate] = useState(null);
const [selectedTime, setSelectedTime] = useState(null);
const [selectedCinema, setSelectedCinema] = useState(null);
const [selectedShowtime, setSelectedShowtime] = useState(null);
const [seatData, setSeatData] = useState(null);
const [fbData, setFBData] = useState(null);
const [holdExpiresAt, setHoldExpiresAt] = useState(null); // ⏱️ Timer

// SeatSelection.jsx
const [selectedSeats, setSelectedSeats] = useState([]);
const [bookedSeats, setBookedSeats] = useState([]);
const [heldSeats, setHeldSeats] = useState([]);
const [timeRemaining, setTimeRemaining] = useState(600); // ⏱️ Countdown

// FoodBeveragePage.jsx
const [cart, setCart] = useState(new Map());
const [timeRemaining, setTimeRemaining] = useState(0); // ⏱️ Countdown

// PaymentPage.jsx
const [paymentMethod, setPaymentMethod] = useState('card');
const [timeRemaining, setTimeRemaining] = useState(0); // ⏱️ Countdown
```

---

## 🎉 Success Flow

```
User Journey:
1. Browse Movies (0:00)
2. Select Movie (0:30)
3. Choose Date/Time/Cinema (1:00)
4. Select Seats (2:00) ← Timer starts
5. Add F&B (3:00) ← Timer continues
6. Complete Payment (4:00) ← Timer continues
7. Receive Ticket (4:30) ← Timer stops
8. Earn Loyalty Points (4:30)
9. Check Profile (5:00)

Total Time: ~5 minutes
Timer Duration: 10 minutes (plenty of buffer)
```

---

## 📊 Analytics

### Tracked Events:
- Movie views
- Booking starts
- Seat selections
- Timer expirations
- F&B additions
- Payment completions
- Loyalty points earned
- Tier progressions

---

**Last Updated**: March 8, 2026
**Status**: ✅ Complete and Working
**Timer**: ✅ All Pages
**Loyalty**: ✅ Profile Display
**Payment**: ✅ Card/eSewa | 🔄 Khalti (needs keys)
