# 🔧 Troubleshooting F&B Admin Panel

## ❌ "Network Error" when adding items

### Solution 1: Login to Admin Panel

**The most common issue!**

1. Navigate to: `http://localhost:5173/admin`
2. Login with your admin credentials:
   - Email: Your admin email
   - Password: Your admin password
3. After successful login, navigate to "🍿 Food & Beverages"
4. Try adding an item again

### Solution 2: Check if Backend is Running

1. Open a new terminal
2. Navigate to backend folder: `cd backend`
3. Run: `npm start`
4. You should see:
   ```
   🚀 Server running on http://localhost:5000
   ✅ Connected to MongoDB
   ```

### Solution 3: Clear Browser Cache

1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Clear "Cached images and files"
3. Refresh the page (`Ctrl + F5` or `Cmd + Shift + R`)
4. Login again

### Solution 4: Check Browser Console

1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Look for any red error messages
4. Common errors and fixes:

   **Error: "Failed to fetch"**
   - Backend server is not running
   - Solution: Start backend with `npm start` in backend folder

   **Error: "401 Unauthorized"**
   - Not logged in or token expired
   - Solution: Login to admin panel again

   **Error: "Network request failed"**
   - CORS issue or backend not accessible
   - Solution: Restart backend server

### Solution 5: Verify Admin Token

1. Open browser console (`F12`)
2. Type: `localStorage.getItem('adminToken')`
3. Press Enter

**If it shows `null`:**
- You're not logged in
- Solution: Login to admin panel

**If it shows a long string:**
- You're logged in, but token might be expired
- Solution: Logout and login again

### Solution 6: Check Network Tab

1. Press `F12` to open Developer Tools
2. Go to "Network" tab
3. Try adding an item
4. Look for the request to `/api/admin/fb/items`
5. Click on it to see details

**Status Code 401:**
- Not authenticated
- Solution: Login again

**Status Code 500:**
- Server error
- Check backend console for error details

**Status Code 404:**
- Endpoint not found
- Solution: Restart backend server

### Solution 7: Restart Both Servers

**Backend:**
```bash
cd backend
# Stop if running (Ctrl + C)
npm start
```

**Frontend:**
```bash
cd frontend
# Stop if running (Ctrl + C)
npm run dev
```

### Solution 8: Check Form Validation

Make sure you filled in all required fields:
- ✅ Item Name
- ✅ Category
- ✅ Description
- ✅ Image URL
- ✅ Base Price

### Solution 9: Test with Simple Item

Try adding a very simple item first:

```
Name: Test Item
Category: Popcorn
Description: Test description
Image: https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400
Base Price: 100
Active: ✓
```

### Solution 10: Check MongoDB Connection

1. Check backend console
2. Look for: `✅ Connected to MongoDB`
3. If not connected:
   - Check `.env` file has correct `MONGODB_URI`
   - Make sure MongoDB is running

---

## 🧪 Quick Test

Run this in your browser console while on the admin panel:

```javascript
// Test if you're logged in
const token = localStorage.getItem('adminToken');
console.log('Token exists:', !!token);

// Test if backend is accessible
fetch('http://localhost:5000/api/admin/fb/items', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => {
  console.log('Status:', res.status);
  if (res.status === 200) {
    console.log('✅ Everything is working!');
  } else if (res.status === 401) {
    console.log('❌ Not authenticated - Please login');
  } else {
    console.log('❌ Error:', res.status);
  }
})
.catch(err => {
  console.log('❌ Network error:', err.message);
  console.log('Backend might not be running');
});
```

---

## 📞 Still Having Issues?

### Check These:

1. **Backend running?** → `http://localhost:5000` should be accessible
2. **Frontend running?** → `http://localhost:5173` should be accessible
3. **Logged in as admin?** → Check localStorage for adminToken
4. **MongoDB connected?** → Check backend console
5. **CORS enabled?** → Should be enabled by default in server.js

### Get More Info:

**Backend logs:**
- Check the terminal where backend is running
- Look for any error messages

**Frontend logs:**
- Press F12 → Console tab
- Look for red error messages

**Network requests:**
- Press F12 → Network tab
- Try adding item
- Check the request details

---

## ✅ Verification Steps

After fixing, verify everything works:

1. ✅ Login to admin panel
2. ✅ Navigate to Food & Beverages
3. ✅ Fill in a simple item form
4. ✅ Click "Add Item"
5. ✅ Should see success message
6. ✅ Item should appear in the list below

---

## 🎯 Common Mistakes

1. **Not logged in** - Most common issue!
2. **Backend not running** - Check terminal
3. **Wrong port** - Backend should be on 5000, frontend on 5173
4. **Expired token** - Logout and login again
5. **Missing required fields** - Fill all fields marked with *
6. **Invalid image URL** - Use a valid URL (try Unsplash)
7. **Invalid price** - Must be a number

---

## 💡 Pro Tips

- Keep backend terminal open to see errors
- Keep browser console open while testing
- Use simple test data first
- Check Network tab for detailed error info
- Restart servers if you made code changes

---

**Need more help? Check the backend console for detailed error messages!**
