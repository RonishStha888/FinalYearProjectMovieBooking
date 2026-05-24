# Update API URLs for Production

After deploying your backend to Render, you need to update all API URLs in the frontend.

## Quick Method: Using Environment Variable (Recommended)

### Step 1: Create .env file in frontend folder
```bash
cd frontend
```

Create a file named `.env` with:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Step 2: Update all fetch calls to use environment variable

Replace all instances of:
```javascript
fetch('http://localhost:5000/api/...')
```

With:
```javascript
fetch(`${import.meta.env.VITE_API_URL}/api/...`)
```

## Manual Method: Find and Replace

If you prefer not to use environment variables, you can do a global find and replace:

### Files that need updating:
1. `frontend/src/pages/HomePage.jsx`
2. `frontend/src/pages/BookingPage.jsx`
3. `frontend/src/pages/PaymentPage.jsx`
4. `frontend/src/pages/SeatSelection.jsx`
5. `frontend/src/pages/ProfilePage.jsx`
6. `frontend/src/pages/MyBookingsPage.jsx`
7. `frontend/src/pages/FavoritesPage.jsx`
8. `frontend/src/pages/AdminDashboard.jsx`
9. `frontend/src/components/ChatBot.jsx`
10. Any other files making API calls

### Find and Replace:
**Find**: `http://localhost:5000`
**Replace**: `https://your-backend-url.onrender.com`

## Using VS Code:
1. Press `Ctrl+Shift+H` (Windows) or `Cmd+Shift+H` (Mac)
2. Enter `http://localhost:5000` in "Find"
3. Enter your Render URL in "Replace"
4. Click "Replace All" in the frontend folder only

## Important Notes:
- Don't forget to update the URL in Netlify environment variables
- After updating, rebuild your frontend: `npm run build`
- Test locally before deploying to ensure all API calls work
- Keep localhost URL for local development (use .env files)

## Example API Calls After Update:

### Before (Local):
```javascript
fetch('http://localhost:5000/api/movies')
```

### After (Production with env var):
```javascript
fetch(`${import.meta.env.VITE_API_URL}/api/movies`)
```

### After (Production without env var):
```javascript
fetch('https://rtx-cinema-backend.onrender.com/api/movies')
```
