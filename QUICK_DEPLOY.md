# ⚡ Quick Deploy Guide - RTX Cinema

**Time Required**: 30-45 minutes

This is a streamlined version of the deployment process. For detailed instructions, see `DEPLOYMENT_GUIDE.md`.

---

## 🎯 Quick Steps

### 1️⃣ MongoDB Atlas (5 minutes)

1. Go to https://cloud.mongodb.com → Sign up/Login
2. Create FREE cluster (M0)
3. Create database user (save password!)
4. Network Access → Allow 0.0.0.0/0
5. Get connection string:
   ```
   mongodb+srv://username:PASSWORD@cluster.xxxxx.mongodb.net/rtx_cinema?retryWrites=true&w=majority
   ```

✅ **Save this connection string!**

---

### 2️⃣ Deploy Backend to Render (10 minutes)

1. Go to https://render.com → Sign up/Login
2. New → Web Service → Connect GitHub repo
3. Settings:
   - Name: `rtx-cinema-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Free tier

4. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-connection-string>
   EMAIL_USER=cinemasrtx@gmail.com
   EMAIL_PASS=uvha uhjg hyfy npxj
   KHALTI_SECRET_KEY=test_secret_key_dc74e0fd57cb46cd93832aee0a390234
   KHALTI_PUBLIC_KEY=test_public_key_dc74e0fd57cb46cd93832aee0a507256
   ```

5. Deploy → Wait 5-10 minutes

✅ **Save your backend URL**: `https://rtx-cinema-backend-xxxx.onrender.com`

---

### 3️⃣ Update Frontend Code (5 minutes)

**Option A: Environment Variable (Recommended)**

Create `frontend/.env`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

Then update all fetch calls:
```javascript
// Before
fetch('http://localhost:5000/api/movies')

// After
fetch(`${import.meta.env.VITE_API_URL}/api/movies`)
```

**Option B: Find & Replace**

In VS Code:
- Press `Ctrl+Shift+H`
- Find: `http://localhost:5000`
- Replace: `https://your-backend-url.onrender.com`
- Replace in `frontend` folder only

Commit and push to GitHub!

---

### 4️⃣ Deploy Frontend to Netlify (10 minutes)

1. Go to https://netlify.com → Sign up/Login
2. Add new site → Import from Git → Select repo
3. Settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. Site settings → Environment variables → Add:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

5. Deploy → Wait 3-5 minutes

✅ **Your site is live!** `https://your-site-xxxx.netlify.app`

---

### 5️⃣ Fix CORS (5 minutes)

Update `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-site-xxxx.netlify.app', // Your actual Netlify URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Commit and push → Render auto-deploys

---

### 6️⃣ Test Everything (5 minutes)

Visit your Netlify URL and test:
- ✅ Homepage loads
- ✅ Movies display
- ✅ Can register/login
- ✅ Can select seats
- ✅ Can complete booking
- ✅ Check browser console (no errors)

---

## 🎉 Done!

Your RTX Cinema is now live on the internet!

**Frontend**: https://your-site.netlify.app
**Backend**: https://your-backend.onrender.com

---

## ⚠️ Common Issues

**CORS Error?**
→ Add your Netlify URL to backend CORS whitelist

**API not working?**
→ Check VITE_API_URL in Netlify environment variables

**Backend sleeping?**
→ Render free tier sleeps after 15 min. First request wakes it up (takes 30 seconds)

**Build failed?**
→ Check build logs in Netlify dashboard

---

## 💡 Pro Tips

1. **Keep localhost for development**: Use `.env` files to switch between local and production
2. **Monitor your apps**: Check Render and Netlify dashboards regularly
3. **Free tier limits**: 
   - Render: Sleeps after 15 min inactivity
   - Netlify: 100GB bandwidth/month
   - MongoDB: 512MB storage
4. **Upgrade when needed**: All platforms have paid tiers for production apps

---

## 📚 Need More Help?

- Full guide: `DEPLOYMENT_GUIDE.md`
- Checklist: `DEPLOYMENT_CHECKLIST.md`
- API updates: `UPDATE_API_URLS.md`

---

**Happy Deploying! 🚀**
