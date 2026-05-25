# Quick Fix: "Failed to Connect to Server" Error

## Problem
Getting "Failed to connect to server. Please try again!" error when trying to sign up.

## Root Cause
The backend server is not running or there's a connection issue between frontend and backend.

---

## ✅ SOLUTION

### Step 1: Start Backend Server
Open a **NEW** terminal/command prompt:

```bash
cd backend
npm start
```

**Expected Output:**
```
🚀 Server running on http://localhost:5000
✅ Connected to MongoDB
```

**Keep this terminal open!** Don't close it.

---

### Step 2: Start Frontend Server
Open **ANOTHER NEW** terminal/command prompt:

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Keep this terminal open too!**

---

### Step 3: Test the Connection

1. Open browser: http://localhost:5173
2. Click "Sign Up"
3. Fill in the form
4. Click "Sign Up" button

**Expected Result:**
- ✅ "Check Your Email!" success message
- ✅ Backend console shows: `📧 Verification email sent to [email]`

---

## 🚀 QUICK START (Windows)

Double-click the `start-servers.bat` file in the project root. This will automatically start both servers in separate windows.

---

## 🔍 Troubleshooting

### Issue 1: Backend won't start
**Error:** `Cannot find module '@getbrevo/brevo'`

**Fix:**
```bash
cd backend
npm install
```

---

### Issue 2: Frontend shows "Failed to connect"
**Check:**
1. Is backend running? Go to http://localhost:5000 in browser
   - Should see: `{"message":"RTX Cinema API is running!"}`
   - If not, backend is not running

2. Check `frontend/.env` file:
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. Restart frontend after changing .env:
   - Stop frontend (Ctrl+C)
   - Run `npm run dev` again

---

### Issue 3: Email not sending
**Check backend console for:**
- ✅ `📧 Verification email sent to [email]` = Working!
- ❌ `Brevo email error` = API key issue

**Fix Brevo API Key:**
1. Go to https://www.brevo.com/
2. Sign up / Login
3. Go to: Settings → SMTP & API → API Keys
4. Create new API key
5. Copy the key
6. Update `backend/.env`:
   ```
   BREVO_API_KEY=your_actual_api_key_here
   ```
7. Restart backend server

---

### Issue 4: CORS Error
**Error in browser console:** `Access to fetch at 'http://localhost:5000' has been blocked by CORS`

**Fix:** Backend should have CORS enabled. Check `backend/server.js`:
```javascript
app.use(cors());
```

If still having issues, update to:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 📝 Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] MongoDB connected (check backend console)
- [ ] Brevo API key configured in `backend/.env`
- [ ] Both terminals are open and running
- [ ] No error messages in either console

---

## 🎯 Test Signup Flow

1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter:
   - Email: your_email@gmail.com
   - Username: testuser
   - Password: password123
   - Confirm Password: password123
4. Click "Sign Up"
5. Should see: "Check Your Email!" message
6. Check your email inbox (and spam folder)
7. Click verification link
8. Should see: "Email verified successfully!"
9. Go back and login

---

## 💡 Common Mistakes

1. **Not starting backend** - Frontend can't work without backend!
2. **Closing terminal** - Keep both terminals open while testing
3. **Wrong API URL** - Make sure `frontend/.env` has correct URL
4. **Invalid Brevo key** - Get a real API key from Brevo
5. **Not restarting after .env changes** - Always restart servers after changing .env files

---

## 🆘 Still Not Working?

Run this test script:
```bash
node test-backend-connection.js
```

This will test:
- ✅ Backend connection
- ✅ Signup endpoint
- ✅ Email sending

Check the output for specific errors.

---

## 📞 Need Help?

Check these files for more info:
- `EMAIL_VERIFICATION_IMPLEMENTATION_COMPLETE.md` - Full documentation
- `backend/.env` - Configuration
- Backend console - Error messages
- Browser console (F12) - Frontend errors
