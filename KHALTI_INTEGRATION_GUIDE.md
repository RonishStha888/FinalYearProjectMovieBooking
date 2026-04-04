# 💜 Khalti Payment Gateway Integration Guide

## Complete Step-by-Step Implementation for RTX Cinema

---

## 🎯 What You'll Achieve

- ✅ Real Khalti payment integration
- ✅ Money goes directly to your Khalti account
- ✅ Same UI, real payments
- ✅ Payment verification
- ✅ Booking confirmation after successful payment

---

## 📋 Prerequisites

### Step 1: Create Khalti Merchant Account

1. **Go to:** https://khalti.com/
2. **Click:** "Merchant" or "For Business"
3. **Sign Up** for a merchant account
4. **Complete KYC** (Know Your Customer) verification
5. **Wait for approval** (usually 1-2 business days)

### Step 2: Get API Keys

Once approved:
1. Login to **Khalti Merchant Dashboard**
2. Go to **Settings** → **API Keys**
3. You'll see two keys:
   - **Test Public Key** (for development)
   - **Test Secret Key** (for development)
   - **Live Public Key** (for production)
   - **Live Secret Key** (for production)

**Example Keys:**
```
Test Public Key: test_public_key_xxxxxxxxxxxxx
Test Secret Key: test_secret_key_xxxxxxxxxxxxx
Live Public Key: live_public_key_xxxxxxxxxxxxx
Live Secret Key: live_secret_key_xxxxxxxxxxxxx
```

---

## 🔧 Implementation Steps

### Step 1: Install Khalti Package (2 minutes)

```bash
cd frontend
npm install khalti-checkout-web
```

### Step 2: Update .env File (1 minute)

Add to `backend/.env`:
```env
# Khalti Configuration
KHALTI_SECRET_KEY=test_secret_key_xxxxxxxxxxxxx
KHALTI_PUBLIC_KEY=test_public_key_xxxxxxxxxxxxx

# For production, use live keys:
# KHALTI_SECRET_KEY=live_secret_key_xxxxxxxxxxxxx
# KHALTI_PUBLIC_KEY=live_public_key_xxxxxxxxxxxxx
```

Add to `frontend/.env` (create if doesn't exist):
```env
VITE_KHALTI_PUBLIC_KEY=test_public_key_xxxxxxxxxxxxx

# For production:
# VITE_KHALTI_PUBLIC_KEY=live_public_key_xxxxxxxxxxxxx
```

---

## 📝 Step 3: Create Khalti Service (Backend)

Create: `backend/services/khaltiService.js`

```javascript
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const KHALTI_VERIFY_URL = 'https://khalti.com/api/v2/payment/verify/';

/**
 * Verify Khalti payment
 * @param {string} token - Payment token from Khalti
 * @param {number} amount - Amount in paisa (Rs. 100 = 10000 paisa)
 * @returns {Promise<Object>} Verification result
 */
export const verifyKhaltiPayment = async (token, amount) => {
  try {
    const response = await axios.post(
      KHALTI_VERIFY_URL,
      {
        token: token,
        amount: amount
      },
      {
        headers: {
          'Authorization': `Key ${KHALTI_SECRET_KEY}`
        }
      }
    );

    console.log('✅ Khalti payment verified:', response.data);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Khalti verification failed:', error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Get Khalti transaction details
 * @param {string} idx - Transaction ID
 * @returns {Promise<Object>} Transaction details
 */
export const getKhaltiTransaction = async (idx) => {
  try {
    const response = await axios.get(
      `https://khalti.com/api/v2/merchant-transaction/${idx}/`,
      {
        headers: {
          'Authorization': `Key ${KHALTI_SECRET_KEY}`
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Failed to get transaction:', error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};
```

---

## 🛣️ Step 4: Create Payment Routes (Backend)

Create or update: `backend/routes/payment.js`

```javascript
import express from 'express';
import Booking from '../models/Booking.js';
import { verifyKhaltiPayment } from '../services/khaltiService.js';

const router = express.Router();

/**
 * Verify Khalti payment and create booking
 */
router.post('/khalti/verify', async (req, res) => {
  try {
    const { token, amount, bookingData } = req.body;

    console.log('🔍 Verifying Khalti payment...');
    console.log('Token:', token);
    console.log('Amount:', amount);

    // Verify payment with Khalti
    const verification = await verifyKhaltiPayment(token, amount);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: verification.error
      });
    }

    // Payment verified successfully
    const khaltiData = verification.data;

    // Create booking in database
    const booking = await Booking.create({
      ...bookingData,
      paymentMethod: 'khalti',
      paymentStatus: 'completed',
      transactionId: khaltiData.idx,
      khaltiToken: token,
      khaltiData: khaltiData,
      paidAmount: amount / 100, // Convert paisa to rupees
      bookingDate: new Date()
    });

    console.log('✅ Booking created:', booking._id);

    res.json({
      success: true,
      message: 'Payment successful!',
      booking: booking,
      khaltiData: khaltiData
    });

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification',
      error: error.message
    });
  }
});

/**
 * Get booking by ID
 */
router.get('/booking/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movieId')
      .populate('cinemaId')
      .populate('hallId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error('❌ Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
```

---

## 🎨 Step 5: Update Payment Page (Frontend)

Update: `frontend/src/pages/PaymentPage.jsx`

Add these imports at the top:
```javascript
import { useEffect } from 'react';
import KhaltiCheckout from 'khalti-checkout-web';
```

Add Khalti configuration after the state declarations:
```javascript
// Khalti Configuration
const khaltiConfig = {
  publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY,
  productIdentity: `RTX-${Date.now()}`,
  productName: `${movie.title} - ${seatData.seats.length} Tickets`,
  productUrl: window.location.href,
  eventHandler: {
    onSuccess: async (payload) => {
      console.log('✅ Khalti payment success:', payload);
      await handleKhaltiSuccess(payload);
    },
    onError: (error) => {
      console.error('❌ Khalti payment error:', error);
      alert('Payment failed. Please try again.');
      setProcessing(false);
    },
    onClose: () => {
      console.log('Khalti widget closed');
      setProcessing(false);
    }
  },
  paymentPreference: ['KHALTI', 'EBANKING', 'MOBILE_BANKING', 'CONNECT_IPS', 'SCT']
};

// Initialize Khalti
const khaltiCheckout = new KhaltiCheckout(khaltiConfig);
```

Add Khalti success handler:
```javascript
const handleKhaltiSuccess = async (payload) => {
  try {
    setProcessing(true);

    // Prepare booking data
    const bookingData = {
      movieId: movie._id || movie.id,
      cinemaId: selectedCinema._id,
      hallId: selectedHall._id,
      userId: JSON.parse(localStorage.getItem('user') || '{}')._id,
      showDate: selectedDate,
      showTime: selectedShowtime.time,
      seats: seatData.seats,
      seatDetails: seatData.seatDetails,
      ticketPrice: selectedShowtime.price,
      ticketCount: seatData.seats.length,
      ticketTotal: ticketTotal,
      fbItems: fbData?.items?.map(item => ({
        itemId: item.item._id,
        name: item.item.name,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize
      })) || [],
      fbSubtotal: fbData?.subtotal || 0,
      fbDiscount: fbData?.totalDiscount || 0,
      fbTotal: fbTotal,
      convenienceFee: convenienceFee,
      gst: Math.round(total * 0.18),
      totalAmount: Math.round(total * 1.18)
    };

    // Verify payment with backend
    const response = await fetch('http://localhost:5000/api/payment/khalti/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: payload.token,
        amount: payload.amount,
        bookingData: bookingData
      })
    });

    const data = await response.json();

    if (data.success) {
      // Payment verified and booking created
      const completeBookingData = {
        ...bookingData,
        bookingId: data.booking._id,
        transactionId: payload.idx,
        paymentMethod: 'khalti',
        paymentStatus: 'completed',
        bookingTime: new Date().toISOString(),
        khaltiData: payload
      };

      onPaymentSuccess(completeBookingData);
    } else {
      alert('Payment verification failed. Please contact support.');
      setProcessing(false);
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    alert('Error processing payment. Please contact support.');
    setProcessing(false);
  }
};
```

Update the handlePayment function:
```javascript
const handlePayment = async () => {
  if (paymentMethod === 'khalti') {
    // Khalti payment
    setProcessing(true);
    const amountInPaisa = Math.round(total * 1.18) * 100; // Convert to paisa
    
    khaltiCheckout.show({ amount: amountInPaisa });
  } else if (paymentMethod === 'card' || paymentMethod === 'esewa') {
    // Existing payment logic
    if (!validateForm()) return;
    
    setProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const bookingData = {
        bookingId: `RTX${Date.now()}`,
        movie: movie,
        cinema: selectedCinema,
        hall: selectedHall,
        date: selectedDate,
        showtime: selectedShowtime,
        seats: seatData.seats,
        seatDetails: seatData.seatDetails,
        ticketTotal: ticketTotal,
        fbItems: fbData?.items || [],
        fbSubtotal: fbData?.subtotal || 0,
        fbDiscount: fbData?.totalDiscount || 0,
        fbTotal: fbTotal,
        convenienceFee: convenienceFee,
        total: Math.round(total * 1.18),
        paymentMethod: paymentMethod,
        paymentStatus: 'completed',
        bookingTime: new Date().toISOString(),
        user: JSON.parse(localStorage.getItem('user') || '{}'),
        transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));
      
      onPaymentSuccess(bookingData);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }
};
```

---

## 🔌 Step 6: Register Payment Routes (Backend)

Update `backend/server.js`:

```javascript
import paymentRoutes from './routes/payment.js';

// ... other code ...

app.use('/api/payment', paymentRoutes);
```

---

## 🧪 Step 7: Testing

### Test Mode (Development)

1. **Use Test Keys** in `.env` files
2. **Test Credentials:**
   - Mobile: `9800000000` to `9800000010`
   - MPIN: `1111`
   - OTP: `987654`

### Test Flow:

1. Select movie, seats, F&B
2. Go to payment page
3. Click "Khalti" payment method
4. Click "Pay Rs. XXX"
5. Khalti widget opens
6. Enter test mobile: `9800000000`
7. Enter MPIN: `1111`
8. Enter OTP: `987654`
9. Payment success!
10. Booking confirmed

---

## 🚀 Going Live (Production)

### Step 1: Switch to Live Keys

Update `.env` files with **Live Keys**:

```env
# Backend
KHALTI_SECRET_KEY=live_secret_key_xxxxxxxxxxxxx
KHALTI_PUBLIC_KEY=live_public_key_xxxxxxxxxxxxx

# Frontend
VITE_KHALTI_PUBLIC_KEY=live_public_key_xxxxxxxxxxxxx
```

### Step 2: Test with Real Money

- Use your real Khalti account
- Make a small test payment (Rs. 10)
- Verify money appears in your merchant account

### Step 3: Deploy

- Deploy backend and frontend
- Update environment variables on server
- Test end-to-end

---

## 💰 Money Flow

```
Customer pays Rs. 500
        ↓
Khalti processes payment
        ↓
Money goes to YOUR Khalti Merchant Account
        ↓
You can withdraw to your bank account
```

**Khalti Fees:**
- 1.99% + Rs. 0 per transaction
- Example: Rs. 500 payment = Rs. 10 fee
- You receive: Rs. 490

---

## 📊 Khalti Dashboard

Access your merchant dashboard:
- **URL:** https://khalti.com/merchant/
- **View:** All transactions
- **Download:** Transaction reports
- **Withdraw:** Money to bank account

---

## 🐛 Troubleshooting

### Issue 1: "Invalid Public Key"

**Solution:**
- Check `.env` files have correct keys
- Restart both servers after updating `.env`
- Verify keys are from Khalti merchant dashboard

### Issue 2: Payment Widget Not Opening

**Solution:**
- Check browser console for errors
- Verify `khalti-checkout-web` is installed
- Check public key is loaded: `console.log(import.meta.env.VITE_KHALTI_PUBLIC_KEY)`

### Issue 3: Verification Failed

**Solution:**
- Check backend has correct secret key
- Verify amount matches (in paisa)
- Check network connection
- View backend console for error details

### Issue 4: Test Payment Not Working

**Solution:**
- Use exact test credentials:
  - Mobile: `9800000000`
  - MPIN: `1111`
  - OTP: `987654`
- Make sure using test keys, not live keys

---

## ✅ Checklist

Before going live:

- [ ] Khalti merchant account created and approved
- [ ] Test keys working in development
- [ ] Payment flow tested end-to-end
- [ ] Booking creation working
- [ ] Email confirmation sending
- [ ] Live keys obtained
- [ ] Live keys added to production `.env`
- [ ] Small test payment with real money
- [ ] Money received in merchant account
- [ ] Withdrawal to bank tested

---

## 📱 Payment Methods Supported

Khalti supports:
- ✅ Khalti Wallet
- ✅ E-Banking (all major banks)
- ✅ Mobile Banking
- ✅ Connect IPS
- ✅ SCT Cards

---

## 🎯 Summary

You now have:
1. ✅ Real Khalti integration
2. ✅ Money goes to your account
3. ✅ Same beautiful UI
4. ✅ Payment verification
5. ✅ Booking confirmation
6. ✅ Test and live modes

**Setup time:** ~30 minutes  
**Cost:** 1.99% per transaction

---

**Your cinema now accepts real payments! 🎉💜**
