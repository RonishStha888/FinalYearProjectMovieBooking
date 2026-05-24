# RTX Cinema Deployment Guide
## Netlify (Frontend) + Render (Backend) + MongoDB Atlas

This guide will walk you through deploying your RTX Cinema application to production.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Netlify Account** - Sign up at https://netlify.com
3. **Render Account** - Sign up at https://render.com
4. **MongoDB Atlas Account** - Sign up at https://mongodb.com/cloud/atlas

---

## 🗄️ STEP 1: Setup MongoDB Atlas (Database)

### 1.1 Create a Cluster
1. Go to https://cloud.mongodb.com
2. Click **"Build a Database"**
3. Choose **FREE** tier (M0 Sandbox)
4. Select a cloud provider and region (choose closest to your users)
5. Name your cluster (e.g., `rtx-cinema-cluster`)
6. Click **"Create"**

### 1.2 Create Database User
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `rtx_admin` (or your choice)
5. Password: Generate a strong password (SAVE THIS!)
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### 1.3 Whitelist IP Addresses
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.4 Get Connection String
1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://rtx_admin:<password>@rtx-cinema-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name before the `?`:
   ```
   mongodb+srv://rtx_admin:YOUR_PASSWORD@rtx-cinema-cluster.xxxxx.mongodb.net/rtx_cinema?retryWrites=true&w=majority
   ```

**SAVE THIS CONNECTION STRING - You'll need it for Render!**

---

## 🚀 STEP 2: Deploy Backend to Render

### 2.1 Prepare Backend for Deployment
Your backend is already configured, but ensure `server.js` uses environment variables.

### 2.2 Create Web Service on Render
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `rtx-cinema-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 2.3 Add Environment Variables
In the **Environment** section, add these variables:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://rtx_admin:YOUR_PASSWORD@rtx-cinema-cluster.xxxxx.mongodb.net/rtx_cinema?retryWrites=true&w=majority
EMAIL_USER=cinemasrtx@gmail.com
EMAIL_PASS=uvha uhjg hyfy npxj
KHALTI_SECRET_KEY=test_secret_key_dc74e0fd57cb46cd93832aee0a390234
KHALTI_PUBLIC_KEY=test_public_key_dc74e0fd57cb46cd93832aee0a507256
```

**Important**: Replace `YOUR_PASSWORD` with your MongoDB Atlas password!

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://rtx-cinema-backend.onrender.com`

**SAVE THIS URL - You'll need it for the frontend!**

### 2.5 Test Backend
Visit: `https://rtx-cinema-backend.onrender.com/api/movies`
You should see a JSON response with movies.

---

## 🌐 STEP 3: Deploy Frontend to Netlify

### 3.1 Update API URLs in Frontend
You need to replace all `http://localhost:5000` with your Render backend URL.

**Option A: Create Environment Variable (Recommended)**
1. Create a `.env` file in the `frontend` folder (if it doesn't exist)
2. Add:
   ```
   VITE_API_URL=https://rtx-cinema-backend.onrender.com
   ```

**Option B: Find and Replace**
Search for `http://localhost:5000` in all frontend files and replace with your Render URL.

### 3.2 Create Netlify Configuration
A `netlify.toml` file has been created in your frontend folder.

### 3.3 Deploy to Netlify

#### Method 1: Netlify UI (Easiest)
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Click **"Deploy site"**

#### Method 2: Netlify CLI
```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### 3.4 Add Environment Variables on Netlify
1. Go to **Site settings** → **Environment variables**
2. Add:
   ```
   VITE_API_URL=https://rtx-cinema-backend.onrender.com
   ```
3. Click **"Save"**
4. Trigger a new deploy: **Deploys** → **Trigger deploy** → **Deploy site**

### 3.5 Get Your Live URL
After deployment, you'll get a URL like: `https://rtx-cinema-xyz123.netlify.app`

---

## 🔧 STEP 4: Configure CORS on Backend

Update your backend to allow requests from your Netlify domain.

In `backend/server.js`, update the CORS configuration:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://rtx-cinema-xyz123.netlify.app', // Replace with your actual Netlify URL
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

After updating, commit and push to GitHub. Render will auto-deploy.

---

## ✅ STEP 5: Verification Checklist

### Backend (Render)
- [ ] Service is running (green status)
- [ ] Environment variables are set
- [ ] MongoDB connection is successful
- [ ] API endpoints respond correctly
- [ ] Check logs for any errors

### Frontend (Netlify)
- [ ] Site is published
- [ ] Environment variables are set
- [ ] Build completed successfully
- [ ] Site loads without errors
- [ ] API calls work (check browser console)

### Database (MongoDB Atlas)
- [ ] Cluster is running
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string is correct

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to MongoDB"
- Check MongoDB Atlas connection string
- Verify password doesn't contain special characters (URL encode if needed)
- Check Network Access whitelist

**Problem**: "Application failed to start"
- Check Render logs
- Verify all environment variables are set
- Check `package.json` start script

### Frontend Issues

**Problem**: "API calls failing"
- Check browser console for CORS errors
- Verify VITE_API_URL is set correctly
- Check backend CORS configuration
- Ensure backend is running

**Problem**: "Build failed"
- Check Netlify build logs
- Verify `package.json` build script
- Check for missing dependencies

### CORS Issues
If you see CORS errors:
1. Add your Netlify URL to backend CORS whitelist
2. Redeploy backend
3. Clear browser cache
4. Try again

---

## 🔐 Security Notes

### Production Checklist
- [ ] Change MongoDB password to a strong one
- [ ] Use production Khalti keys (not test keys)
- [ ] Set up proper email service (not Gmail)
- [ ] Enable HTTPS (automatic on Netlify/Render)
- [ ] Add rate limiting to backend
- [ ] Set up monitoring and alerts
- [ ] Regular database backups

### Environment Variables
Never commit `.env` files to GitHub! They're already in `.gitignore`.

---

## 📊 Monitoring

### Render
- View logs: Dashboard → Your service → Logs
- Monitor performance: Dashboard → Metrics

### Netlify
- View deploy logs: Site → Deploys → Click on deploy
- Analytics: Site → Analytics

### MongoDB Atlas
- Monitor database: Cluster → Metrics
- View logs: Cluster → Logs

---

## 💰 Cost Breakdown

- **MongoDB Atlas**: FREE (M0 tier - 512MB storage)
- **Render**: FREE (750 hours/month, sleeps after 15 min inactivity)
- **Netlify**: FREE (100GB bandwidth/month)

**Total**: $0/month for hobby projects! 🎉

---

## 🔄 Continuous Deployment

Both Render and Netlify support automatic deployments:

1. Push code to GitHub
2. Render auto-deploys backend
3. Netlify auto-deploys frontend
4. Changes go live automatically!

---

## 📞 Support

If you encounter issues:
- **Render**: https://render.com/docs
- **Netlify**: https://docs.netlify.com
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

## 🎉 You're Done!

Your RTX Cinema application is now live on the internet!

**Frontend**: https://your-site.netlify.app
**Backend**: https://your-backend.onrender.com
**Database**: MongoDB Atlas Cloud

Share your live URL with friends and enjoy! 🍿🎬
