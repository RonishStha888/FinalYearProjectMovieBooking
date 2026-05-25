# RTX Cinema - Complete Startup Guide

## 🚀 Quick Start (Recommended)

### Option 1: Automatic Startup (Windows)
Double-click `start-servers.bat` in the project root folder.

This will automatically open 2 terminal windows:
- ✅ Backend Server (http://localhost:5000)
- ✅ Frontend Server (http://localhost:5173)

**Keep both windows open while using the application!**

---

### Option 2: Manual Startup

#### Terminal 1 - Backend
```bash
cd backend
npm start
```

**Wait for:**
```
🚀 Server running on http://localhost:5000
✅ Connected to MongoDB
```

**Keep this terminal open!**

---

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

**Wait for:**
```
➜  Local:   http://localhost:5173/
```

**Keep this terminal open!**

---

## 🌐 Access the Application

Open your browser and go to:
```
http://localhost:5173
```

---

## ✅ Verify Everything is Working

### 1. Check Backend
Open in browser: http://localhost:5000

**Should see:**
```json
{"message":"RTX Cinema API is running!"}
```

If you see this, backend is working! ✅

---

### 2. Check Frontend
Open in browser: http://localhost:5173

**Should see:**
- RTX Cinema homepage
- Movies displayed
- Navigation menu
- Login/Signup buttons

If you see this, frontend is working! ✅

---

### 3. Test Signup Flow

1. Click "Sign Up" button
2. Fill in the form:
   - Email: your_email@gmail.com
   - Username: testuser
   - Password: password123
   - Confirm Password: password123
3. Click "Sign Up"

**Expected Result:**
```
✅ "Check Your Email!" success message
```

**Backend Console Should Show:**
```
📧 Signup request for: your_email@gmail.com
✅ User created (unverified): testuser
📧 Verification email sent to your_email@gmail.com
```

---

## 🔧 Troubleshooting

### Problem 1: "Failed to connect to server"

**Cause:** Backend is not running

**Fix:**
1. Open a new terminal
2. Run:
   ```bash
   cd backend
   npm start
   ```
3. Wait for "Server running" message
4. Try signup again

---

### Problem 2: Backend won't start

**Error:** `Cannot find module '@getbrevo/brevo'`

**Fix:**
```bash
cd backend
npm install
npm start
```

---

### Problem 3: Frontend won't start

**Error:** `Cannot find module` or similar

**Fix:**
```bash
cd frontend
npm install
npm run dev
```

---

### Problem 4: Email not sending

**Check Backend Console:**
- ✅ `📧 Verification email sent` = Working!
- ❌ `Brevo email error` = API key issue

**Fix:**
1. Get Brevo API key from https://www.brevo.com/
2. Update `backend/.env`:
   ```
   BREVO_API_KEY=your_actual_api_key_here
   ```
3. Restart backend server

**Test Brevo API:**
```bash
node test-brevo-api.js
```

---

### Problem 5: MongoDB connection error

**Error:** `MongoDB connection error`

**Check:**
1. Is your internet connected?
2. Is MongoDB Atlas connection string correct in `backend/.env`?

**Current Connection String:**
```
mongodb+srv://rtx_admin:c2H5HtlZxV3lJMSD@cluster0.xeizws7.mongodb.net/rtx_cinema?retryWrites=true&w=majority&appName=Cluster0
```

---

### Problem 6: Port already in use

**Error:** `Port 5000 is already in use`

**Fix:**
1. Find and close the process using port 5000
2. Or change port in `backend/.env`:
   ```
   PORT=5001
   ```
3. Update `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:5001
   ```

---

## 📋 Pre-Flight Checklist

Before starting, make sure:

- [ ] Node.js is installed (v18 or higher)
- [ ] npm is installed
- [ ] Internet connection is active
- [ ] MongoDB Atlas is accessible
- [ ] Brevo API key is configured (optional for testing)
- [ ] No other apps using ports 5000 or 5173

---

## 🧪 Run Tests

### Test Backend Connection
```bash
node test-backend-connection.js
```

### Test Brevo Email Service
```bash
node test-brevo-api.js
```

---

## 📁 Important Files

### Configuration Files
- `backend/.env` - Backend configuration (MongoDB, Brevo, etc.)
- `frontend/.env` - Frontend configuration (API URL)

### Startup Scripts
- `start-servers.bat` - Automatic startup (Windows)
- `test-backend-connection.js` - Test backend
- `test-brevo-api.js` - Test email service

### Documentation
- `QUICK_FIX_NETWORK_ERROR.md` - Fix connection errors
- `EMAIL_VERIFICATION_IMPLEMENTATION_COMPLETE.md` - Email system docs
- `DEPLOYMENT_GUIDE.md` - Production deployment

---

## 🎯 Development Workflow

### Daily Startup
1. Double-click `start-servers.bat`
2. Wait for both servers to start
3. Open http://localhost:5173
4. Start developing!

### Making Changes
- **Frontend changes:** Auto-reload (no restart needed)
- **Backend changes:** Restart backend server (Ctrl+C, then `npm start`)
- **.env changes:** Restart the server that uses it

### Stopping Servers
- Press `Ctrl+C` in each terminal
- Or close the terminal windows

---

## 🌍 Production Deployment

When ready to deploy:
1. See `DEPLOYMENT_GUIDE.md`
2. See `QUICK_DEPLOY.md`
3. See `DEPLOYMENT_CHECKLIST.md`

---

## 💡 Tips

1. **Keep terminals visible** - You can see errors immediately
2. **Check backend console** - Most errors show up there first
3. **Use browser DevTools (F12)** - Check Network tab for API errors
4. **Clear browser cache** - Use Ctrl+Shift+R for hard refresh
5. **Test in incognito mode** - Avoid cache issues

---

## 🆘 Still Having Issues?

### Check These:
1. Backend console - Any error messages?
2. Frontend console (F12) - Any error messages?
3. Network tab (F12) - Are API calls failing?
4. `backend/.env` - All variables set correctly?
5. `frontend/.env` - API URL correct?

### Common Error Messages:

| Error | Cause | Fix |
|-------|-------|-----|
| "Failed to connect to server" | Backend not running | Start backend |
| "Cannot find module" | Dependencies not installed | Run `npm install` |
| "Port already in use" | Port conflict | Change port or kill process |
| "MongoDB connection error" | Internet or wrong URI | Check connection |
| "Brevo email error" | Invalid API key | Get new key from Brevo |

---

## 📞 Need More Help?

Read these guides:
- `QUICK_FIX_NETWORK_ERROR.md` - Connection issues
- `EMAIL_VERIFICATION_IMPLEMENTATION_COMPLETE.md` - Email system
- `DEPLOYMENT_GUIDE.md` - Deployment help

---

## ✨ You're All Set!

Once both servers are running:
- Backend: http://localhost:5000 ✅
- Frontend: http://localhost:5173 ✅
- MongoDB: Connected ✅

**Happy coding! 🎬🍿**
