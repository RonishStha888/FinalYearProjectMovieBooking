# 🔑 How to Get Khalti Test Keys

## The Issue
You're seeing "Invalid key" because the placeholder test key in the `.env` file is not a real Khalti key.

## Solution: Get Real Test Keys from Khalti

### Step 1: Sign Up for Khalti Merchant Account
1. Go to: https://khalti.com/join/merchant/
2. Fill in your details:
   - Business Name: RTX Cinema (or your name)
   - Email: Your email
   - Phone: Your phone number
   - Password: Create a password
3. Click "Sign Up"

### Step 2: Verify Your Email
1. Check your email inbox
2. Click the verification link from Khalti
3. Your account will be activated

### Step 3: Login to Merchant Dashboard
1. Go to: https://khalti.com/merchant/
2. Login with your credentials
3. You'll see the merchant dashboard

### Step 4: Get Test Keys
1. In the dashboard, look for "API Keys" or "Settings"
2. You'll see two sets of keys:
   - **Test Keys** (for development)
   - **Live Keys** (for production - only after KYC)
3. Copy the **Test Public Key** (starts with `test_public_key_...`)
4. Copy the **Test Secret Key** (starts with `test_secret_key_...`)

### Step 5: Update Your .env Files

**Frontend (.env):**
```env
VITE_KHALTI_PUBLIC_KEY=test_public_key_YOUR_ACTUAL_KEY_HERE
```

**Backend (.env):**
```env
KHALTI_SECRET_KEY=test_secret_key_YOUR_ACTUAL_KEY_HERE
```

### Step 6: Restart Servers
```bash
# Stop both servers (Ctrl+C)
# Then restart:
cd backend
npm start

cd frontend
npm run dev
```

## Alternative: Use Card/eSewa Payment for Now

If you don't want to set up Khalti right now, you can test with:

1. **Credit/Debit Card** (simulated payment)
   - Just fill in any card details
   - Payment will be simulated (no real charge)

2. **eSewa** (simulated payment)
   - Click eSewa option
   - Payment will be simulated

These options work without any API keys and will still:
- ✅ Create bookings
- ✅ Award loyalty points
- ✅ Send confirmation emails
- ✅ Generate tickets

## Test Credentials (Once You Have Real Keys)

After you get real test keys from Khalti, use these test credentials:

**Khalti Test Account:**
- Mobile: `9800000000`
- MPIN: `1111`
- OTP: `987654`

**Test Cards:**
- Visa: `4111111111111111`
- Mastercard: `5555555555554444`
- CVV: `123`
- Expiry: Any future date

## Important Notes

1. **Test Keys vs Live Keys:**
   - Test keys: For development, no real money
   - Live keys: For production, real transactions (requires KYC approval)

2. **KYC Verification:**
   - You mentioned your KYC is being verified
   - Once approved, you'll get live keys
   - Until then, use test keys for development

3. **No Real Charges:**
   - Test mode = No real money charged
   - All transactions are simulated
   - Perfect for testing your app

## Quick Fix for Now

If you want to test the booking flow immediately without Khalti setup:

1. Select **"Credit/Debit Card"** as payment method
2. Fill in any card details (they won't be validated)
3. Click "Pay"
4. Booking will complete successfully!

This lets you test:
- Seat hold system (10-minute timer)
- Loyalty points
- Email confirmation
- Ticket generation
- F&B orders

You can add real Khalti integration later when you have the keys!

---

**Need Help?**
- Khalti Support: support@khalti.com
- Khalti Docs: https://docs.khalti.com/
- Khalti Merchant: https://khalti.com/merchant/
