# Netlify Deployment Steps for RTX Cinema Frontend

## ✅ Prerequisites Completed
- ✅ Backend deployed on Render: `https://rtx-cinemas-backend.onrender.com`
- ✅ MongoDB Atlas configured and connected
- ✅ Frontend configured with environment variables
- ✅ All changes committed and pushed to GitHub

## 📋 Step-by-Step Netlify Deployment

### 1. Login to Netlify
- Go to [https://app.netlify.com](https://app.netlify.com)
- Sign in with your GitHub account

### 2. Create New Site
- Click **"Add new site"** → **"Import an existing project"**
- Choose **"Deploy with GitHub"**
- Authorize Netlify to access your GitHub repositories

### 3. Select Repository
- Find and select: **`FinalYearProjectMovieBooking`**
- Click on the repository

### 4. Configure Build Settings
Enter these exact settings:

**Base directory:**
```
frontend
```

**Build command:**
```
npm run build
```

**Publish directory:**
```
frontend/dist
```

**Branch to deploy:**
```
main
```

### 5. Add Environment Variable
Click **"Add environment variables"** and add:

**Key:**
```
VITE_API_URL
```

**Value:**
```
https://rtx-cinemas-backend.onrender.com
```

⚠️ **IMPORTANT**: No trailing slash at the end!

### 6. Deploy Site
- Click **"Deploy site"**
- Wait 2-5 minutes for the build to complete
- Netlify will automatically build and deploy your site

### 7. Get Your Site URL
- Once deployed, you'll see your site URL (something like `https://your-site-name.netlify.app`)
- Click on it to test your application

### 8. Test Your Deployment
Visit your site and test:
- ✅ Homepage loads
- ✅ Movies display correctly
- ✅ Login/Signup works
- ✅ Booking flow works
- ✅ Payment integration works
- ✅ Admin panel accessible at `/admin`

## 🎯 Custom Domain (Optional)
If you want a custom domain:
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your domain

## 🔧 Troubleshooting

### Build Fails
- Check the build logs in Netlify
- Make sure `frontend/package.json` has the correct build script
- Verify all dependencies are listed in `package.json`

### Site Loads But API Calls Fail
- Check that `VITE_API_URL` environment variable is set correctly
- Verify your Render backend is running
- Check browser console for CORS errors

### 404 Errors on Page Refresh
Add a `_redirects` file in `frontend/public/`:
```
/*    /index.html   200
```

## 📝 Important Notes

1. **Free Tier Limits:**
   - Netlify: 100GB bandwidth/month, 300 build minutes/month
   - Render: Backend sleeps after 15 minutes of inactivity

2. **Environment Variables:**
   - Local development uses: `http://localhost:5000`
   - Production uses: `https://rtx-cinemas-backend.onrender.com`

3. **Automatic Deployments:**
   - Every push to `main` branch will trigger a new deployment
   - You can disable this in Site settings if needed

## 🎉 Success!
Once deployed, your RTX Cinema application will be live and accessible worldwide!

**Your URLs:**
- Frontend: `https://your-site-name.netlify.app`
- Backend: `https://rtx-cinemas-backend.onrender.com`
- Database: MongoDB Atlas (cloud)
