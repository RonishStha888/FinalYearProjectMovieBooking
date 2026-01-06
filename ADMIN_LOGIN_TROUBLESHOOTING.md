# 🔧 RTX Cinema - Admin Login Troubleshooting Guide

## ✅ **VERIFIED WORKING COMPONENTS**

### **Backend API Status: ✅ WORKING**
- Admin login endpoint: `http://localhost:5000/api/admin/login`
- Admin user exists in database
- Credentials verified: `admin@rtxcinema.com` / `admin123`
- JWT token generation working
- CORS configured correctly

### **Frontend Status: 🔍 NEEDS DEBUGGING**
- Frontend running on: `http://localhost:5173`
- Admin login page: `http://localhost:5173/admin`
- Enhanced logging added to AdminLogin component

## 🎯 **CORRECT ACCESS INFORMATION**

### **Admin Credentials:**
```
📧 Email: admin@rtxcinema.com
🔒 Password: admin123
```

### **URLs:**
```
🌐 Admin Login: http://localhost:5173/admin
🌐 Admin Dashboard: http://localhost:5173/admin/dashboard
```

## 🔍 **DEBUGGING STEPS**

### **Step 1: Check Browser Console**
1. Open browser developer tools (`F12`)
2. Go to "Console" tab
3. Navigate to `http://localhost:5173/admin`
4. Enter credentials and click login
5. Look for these console messages:
   ```
   🔐 Attempting admin login with: {email: "admin@rtxcinema.com", password: "admin123"}
   🌐 Making request to: http://localhost:5000/api/admin/login
   📥 Response status: 200
   📥 Response ok: true
   📄 Response data: {message: "Admin login successful", token: "...", admin: {...}}
   🔑 Token present: true
   👤 Admin data present: true
   ✅ Login successful, storing token...
   🔄 Redirecting to admin dashboard...
   ```

### **Step 2: Check Network Tab**
1. Go to "Network" tab in developer tools
2. Try logging in again
3. Look for POST request to `admin/login`
4. Check request payload and response

### **Step 3: Check Local Storage**
1. Go to "Application" tab in developer tools
2. Check "Local Storage" → `http://localhost:5173`
3. After successful login, you should see:
   - `adminToken`: JWT token
   - `adminUser`: Admin user data

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **Issue 1: "Invalid login or password" Error**
**Cause:** Frontend not handling response correctly
**Solution:** Check console logs for actual API response

### **Issue 2: Network Error**
**Cause:** Backend not running or CORS issue
**Solution:** 
- Verify backend is running: `http://localhost:5000`
- Check if both frontend (5173) and backend (5000) are running

### **Issue 3: Page Not Found**
**Cause:** Wrong URL
**Solution:** Use `http://localhost:5173/admin` (not `/admin/login`)

### **Issue 4: JavaScript Errors**
**Cause:** Code errors preventing login
**Solution:** Check console for JavaScript errors

## 🧪 **MANUAL API TEST**

You can test the API directly using PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@rtxcinema.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "name": "RTX Cinema Administrator", 
    "email": "admin@rtxcinema.com",
    "role": "admin"
  }
}
```

## 📞 **NEXT STEPS**

1. **Follow debugging steps above**
2. **Share console logs** - Copy and paste what you see in browser console
3. **Share network tab info** - Check if API request is being made
4. **Try hard refresh** - `Ctrl+F5` to clear cache
5. **Try incognito mode** - Rule out browser cache issues

## ✅ **VERIFICATION CHECKLIST**

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173  
- [ ] Using correct URL: `http://localhost:5173/admin`
- [ ] Using correct credentials: `admin@rtxcinema.com` / `admin123`
- [ ] Browser developer tools open
- [ ] Console tab visible
- [ ] Network tab checked
- [ ] No JavaScript errors in console

---

**The backend API is 100% working. The issue is in the frontend or browser. Follow the debugging steps above to identify the exact problem.**