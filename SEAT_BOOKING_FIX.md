# Seat Booking Status Fix

## Problem
After users completed payment, seats were still showing as "held" instead of "booked". The seats remained in a temporary hold state even though payment was successful.

## Root Cause
The issue was a **parameter mismatch** between the frontend and backend:

### Frontend (PaymentPage.jsx)
Was sending:
```javascript
{
  userId: userId || 'guest',
  sessionId: `session_${Date.now()}`,  // ❌ Creating NEW sessionId
  showtimeId,                           // ❌ Not expected by backend
  seats: seatData.seats                 // ❌ Not expected by backend
}
```

### Backend (seatHold.js)
Expected either:
```javascript
{ holdId }  // OR
{ userId, sessionId }  // Must match the ORIGINAL session
```

## The Fix

### 1. Store sessionId in sessionStorage (SeatSelection.jsx)
```javascript
const [sessionId] = useState(() => {
  let existingSessionId = sessionStorage.getItem('sessionId');
  if (!existingSessionId) {
    existingSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', existingSessionId);
  }
  return existingSessionId;
});
```

### 2. Use stored sessionId in PaymentPage (PaymentPage.jsx)
```javascript
const sessionId = sessionStorage.getItem('sessionId') || `session_${Date.now()}`;
await fetch('http://localhost:5000/api/seat-hold/complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: userId || 'guest',
    sessionId: sessionId  // ✅ Using SAME sessionId from seat selection
  })
});
```

### 3. Clear sessionId after successful payment
```javascript
sessionStorage.removeItem('sessionId');
```

## How It Works Now

1. **Seat Selection**: User selects seats → sessionId is created and stored in sessionStorage
2. **Hold Seats**: Backend creates SeatHold record with userId + sessionId + status='active'
3. **Payment**: User completes payment → PaymentPage retrieves the SAME sessionId from sessionStorage
4. **Complete Hold**: Backend finds SeatHold records matching userId + sessionId → updates status to 'completed'
5. **Cleanup**: sessionId is removed from sessionStorage after successful payment

## Files Modified
- `frontend/src/pages/SeatSelection.jsx` - Store sessionId in sessionStorage
- `frontend/src/pages/PaymentPage.jsx` - Use stored sessionId and clean up after payment

## Testing
1. Select seats on any movie
2. Proceed to payment
3. Complete payment (any method: card, Khalti, eSewa)
4. Verify seats now show as "booked" (not "held")
5. Try booking the same seats again - should be blocked

## Technical Details
- The backend uses `updateMany()` to mark all holds with matching userId+sessionId as 'completed'
- This ensures all seats in the transaction are marked as booked atomically
- The sessionId acts as a unique transaction identifier across the booking flow
