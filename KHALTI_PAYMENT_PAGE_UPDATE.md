# 🔄 PaymentPage.jsx Update for Khalti Integration

## Changes to Make

### 1. Add Imports (at the top of the file)

```javascript
import { useState, useEffect } from "react";
import "./PaymentPage.css";
import KhaltiCheckout from 'khalti-checkout-web';
```

### 2. Add Khalti Configuration (after state declarations, around line 20)

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
let khaltiCheckout;
useEffect(() => {
  khaltiCheckout = new KhaltiCheckout(khaltiConfig);
}, []);
```

### 3. Add Khalti Success Handler (before handlePayment function)

```javascript
const handleKhaltiSuccess = async (payload) => {
  try {
    setProcessing(true);

    // Get user data
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Prepare booking data
    const bookingData = {
      movieId: movie._id || movie.id,
      movieTitle: movie.title,
      cinemaId: selectedCinema._id,
      cinemaName: selectedCinema.name,
      hallId: selectedHall._id,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
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

    console.log('📤 Sending verification request...');

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
      console.log('✅ Payment verified and booking created!');
      
      // Payment verified and booking created
      const completeBookingData = {
        ...bookingData,
        bookingId: data.booking._id,
        bookingReference: data.bookingReference,
        transactionId: payload.idx,
        paymentMethod: 'khalti',
        paymentStatus: 'completed',
        bookingTime: new Date().toISOString(),
        khaltiData: payload,
        movie: movie,
        cinema: selectedCinema,
        hall: selectedHall,
        date: selectedDate,
        showtime: selectedShowtime
      };

      onPaymentSuccess(completeBookingData);
    } else {
      alert('Payment verification failed. Please contact support with transaction ID: ' + payload.idx);
      setProcessing(false);
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    alert('Error processing payment. Please contact support.');
    setProcessing(false);
  }
};
```

### 4. Update handlePayment Function

Replace the existing `handlePayment` function with:

```javascript
const handlePayment = async () => {
  if (paymentMethod === 'khalti') {
    // Khalti payment
    setProcessing(true);
    const amountInPaisa = Math.round(total * 1.18) * 100; // Convert to paisa
    
    console.log('💜 Opening Khalti payment widget...');
    console.log('Amount:', Math.round(total * 1.18), 'Rs. =', amountInPaisa, 'paisa');
    
    khaltiCheckout.show({ amount: amountInPaisa });
    
  } else if (paymentMethod === 'card' || paymentMethod === 'esewa') {
    // Existing payment logic for card/esewa
    if (paymentMethod === 'card' && !validateForm()) return;
    
    setProcessing(true);
    
    try {
      // Simulate payment processing
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

## That's It!

These are the only changes needed to integrate Khalti. The UI remains the same, but now when users click "Khalti" and pay, the money goes to your real Khalti merchant account!

## Testing

1. Restart both servers
2. Go through booking flow
3. Select Khalti payment
4. Use test credentials:
   - Mobile: 9800000000
   - MPIN: 1111
   - OTP: 987654
5. Payment should complete successfully!
