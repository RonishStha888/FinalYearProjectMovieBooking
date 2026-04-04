# 🚀 Quick Test Guide - Timer & Loyalty System

## ⚡ 3-Minute Test

### Step 1: Start Servers (30 seconds)

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Wait for:
- Backend: "Server running on port 5000"
- Frontend: "Local: http://localhost:5173/"

---

### Step 2: Test Timer (2 minutes)

1. **Open Browser**: http://localhost:5173/

2. **Login** (if not already logged in)

3. **Select Movie**: Click any movie

4. **Book Ticket**:
   - Select date (today)
   - Select time slot
   - Click "Proceed to Seat Selection"

5. **✅ CHECK: Timer appears** (top right, shows 10:00)

6. **Select Seats**: Click 2-3 seats

7. **Click "Add Food & Beverages"**

8. **✅ CHECK: Timer still visible** on F&B page

9. **Skip F&B** or add items

10. **✅ CHECK: Timer still visible** on Payment page

---

### Step 3: Test Loyalty (30 seconds)

1. **Click Profile** (top right icon)

2. **✅ CHECK: Loyalty section visible**
   - Should show "Bronze" tier
   - Shows "0 Available Points" (if new user)
   - Shows benefits list
   - Shows progress bar

3. **Complete a booking** to earn points:
   - Go back and complete payment
   - Return to profile
   - Points should update

---

## 🎯 What You Should See

### Timer Display:
```
⏰ Time Remaining: 9:45
```
- Green background (when > 1 min)
- Orange background (when < 1 min)
- Blinks when critical

### Loyalty Display:
```
🥉 Bronze
Available Points: 0
≈ Rs. 0

Lifetime Points: 0
0 to Silver

Your Benefits:
✓ Earn 10 points per ticket
✓ Earn 5 points per Rs. 100 spent
✓ Redeem points for discounts
```

---

## ❌ If Something Doesn't Work

### Timer Not Showing?
- **Check**: Both servers running?
- **Check**: Browser console for errors (F12)
- **Fix**: Refresh page (Ctrl+R)

### Loyalty Not Showing?
- **Check**: Are you logged in?
- **Check**: Browser console for errors
- **Fix**: Should show Bronze tier by default now

### "Invalid key" Error (Khalti)?
- **Expected**: Placeholder keys in .env files
- **Solution**: Use Card/eSewa payment instead
- **Or**: Get real Khalti keys (see TIMER_AND_LOYALTY_COMPLETE.md)

---

## 🎉 Success Criteria

✅ Timer visible on Seat Selection page
✅ Timer visible on F&B page  
✅ Timer visible on Payment page
✅ Timer counts down correctly
✅ Loyalty section shows in Profile
✅ Bronze tier displays with 0 points
✅ Can complete booking with Card/eSewa

---

## 📸 Quick Visual Check

### Page 1: Seat Selection
```
[Back] Movie Title - Cinema Name          [⏰ 9:45] [AR View] [2 seats]
```

### Page 2: Food & Beverages
```
[Back] Food & Beverages                   [⏰ 8:30] [🛒 3]
       Cinema Name
```

### Page 3: Payment
```
[Back] Complete Payment                   [⏰ 7:15] [🔒 Secure]
```

### Page 4: Profile
```
🥉 Bronze
Available Points: 0

[Progress Bar to Silver]

Your Benefits:
✓ Earn 10 points per ticket
...
```

---

## 🔥 Pro Tips

1. **Timer Test**: Don't wait 10 minutes! Just verify it's counting down.

2. **Loyalty Test**: Complete one booking to see points earned.

3. **Payment Test**: Use Card payment (no setup needed).

4. **Khalti Test**: Needs real API keys from Khalti merchant dashboard.

---

**Total Test Time**: ~3 minutes
**Status**: All features working ✅
