# 🚀 RTX Cinema Deployment Checklist

Use this checklist to ensure a smooth deployment process.

---

## 📦 Pre-Deployment Preparation

### Code Preparation
- [ ] All code is committed to GitHub
- [ ] `.env` files are in `.gitignore` (never commit secrets!)
- [ ] `package.json` has correct scripts
- [ ] Dependencies are up to date
- [ ] No console.log statements in production code (optional)
- [ ] Error handling is implemented

### Testing
- [ ] Application works locally
- [ ] All features tested
- [ ] Payment flow works
- [ ] Seat booking works
- [ ] Admin panel accessible
- [ ] Email verification works

---

## 🗄️ MongoDB Atlas Setup

- [ ] Account created at https://cloud.mongodb.com
- [ ] Free cluster created (M0 tier)
- [ ] Database user created with strong password
- [ ] Password saved securely
- [ ] Network access set to "Allow from Anywhere" (0.0.0.0/0)
- [ ] Connection string copied and saved
- [ ] Connection string tested locally
- [ ] Database name added to connection string

**Connection String Format:**
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/rtx_cinema?retryWrites=true&w=majority
```

---

## 🖥️ Backend Deployment (Render)

### Initial Setup
- [ ] Account created at https://render.com
- [ ] GitHub repository connected
- [ ] New Web Service created
- [ ] Service name: `rtx-cinema-backend`
- [ ] Root directory set to: `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Free tier selected

### Environment Variables
Add these in Render dashboard:

- [ ] `PORT` = `5000`
- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = `your-mongodb-atlas-connection-string`
- [ ] `EMAIL_USER` = `cinemasrtx@gmail.com`
- [ ] `EMAIL_PASS` = `uvha uhjg hyfy npxj`
- [ ] `KHALTI_SECRET_KEY` = `test_secret_key_dc74e0fd57cb46cd93832aee0a390234`
- [ ] `KHALTI_PUBLIC_KEY` = `test_public_key_dc74e0fd57cb46cd93832aee0a507256`
- [ ] `FRONTEND_URL` = `your-netlify-url` (add after frontend deployment)

### Verification
- [ ] Service deployed successfully (green status)
- [ ] No errors in logs
- [ ] Health check passing
- [ ] Test endpoint: `https://your-backend.onrender.com/api/movies`
- [ ] Backend URL saved for frontend configuration

---

## 🌐 Frontend Deployment (Netlify)

### Code Updates
- [ ] Create `frontend/.env` file
- [ ] Add `VITE_API_URL=https://your-backend.onrender.com`
- [ ] Update all API calls to use `import.meta.env.VITE_API_URL`
- [ ] OR do find/replace: `http://localhost:5000` → `https://your-backend.onrender.com`
- [ ] Test locally with production API
- [ ] Commit changes to GitHub

### Netlify Setup
- [ ] Account created at https://netlify.com
- [ ] New site created from GitHub
- [ ] Repository connected
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`

### Environment Variables
Add in Netlify dashboard (Site settings → Environment variables):

- [ ] `VITE_API_URL` = `https://your-backend.onrender.com`

### Deployment
- [ ] Site deployed successfully
- [ ] No build errors
- [ ] Site URL saved
- [ ] Custom domain configured (optional)

### Verification
- [ ] Site loads without errors
- [ ] Check browser console for errors
- [ ] Test all pages
- [ ] Test API calls (Network tab)
- [ ] Test user registration
- [ ] Test movie browsing
- [ ] Test seat selection
- [ ] Test payment flow

---

## 🔄 CORS Configuration

### Update Backend CORS
- [ ] Add Netlify URL to backend CORS whitelist
- [ ] Update `server.js` or use `server.production.js`
- [ ] Add `FRONTEND_URL` environment variable in Render
- [ ] Commit and push changes
- [ ] Wait for Render auto-deploy
- [ ] Verify CORS working (no errors in browser console)

---

## 🧪 Post-Deployment Testing

### Frontend Testing
- [ ] Homepage loads
- [ ] Movies display correctly
- [ ] Search works
- [ ] User can register
- [ ] User can login
- [ ] Profile page works
- [ ] Seat selection works
- [ ] Timer countdown works
- [ ] Payment page loads
- [ ] Food & Beverage selection works
- [ ] Loyalty points display
- [ ] Admin panel accessible (if admin)

### Backend Testing
- [ ] All API endpoints respond
- [ ] Database queries work
- [ ] Authentication works
- [ ] Email sending works
- [ ] Payment processing works
- [ ] Seat hold system works
- [ ] No errors in Render logs

### Integration Testing
- [ ] Complete booking flow works end-to-end
- [ ] Seats update correctly after booking
- [ ] Email confirmations sent
- [ ] Loyalty points awarded
- [ ] Admin can manage movies
- [ ] Admin can manage food items

---

## 🔐 Security Checklist

- [ ] `.env` files not committed to GitHub
- [ ] Strong MongoDB password used
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on Netlify/Render)
- [ ] API rate limiting considered (future enhancement)
- [ ] Input validation in place
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS protection headers set

---

## 📊 Monitoring Setup

### Render
- [ ] Email notifications enabled
- [ ] Check logs regularly
- [ ] Monitor service health
- [ ] Set up uptime monitoring (optional)

### Netlify
- [ ] Deploy notifications enabled
- [ ] Check build logs
- [ ] Monitor bandwidth usage
- [ ] Analytics enabled (optional)

### MongoDB Atlas
- [ ] Alerts configured
- [ ] Monitor database size
- [ ] Check connection metrics
- [ ] Backup strategy in place

---

## 📝 Documentation

- [ ] Update README with live URLs
- [ ] Document deployment process
- [ ] Note any issues encountered
- [ ] Create user guide (optional)
- [ ] Document admin credentials
- [ ] Save all URLs and credentials securely

---

## 🎉 Launch Checklist

- [ ] All tests passing
- [ ] No critical errors
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Share with team/friends
- [ ] Collect feedback
- [ ] Plan improvements

---

## 🆘 Troubleshooting Quick Reference

### "Cannot connect to database"
→ Check MongoDB Atlas connection string and network access

### "CORS error"
→ Add Netlify URL to backend CORS whitelist

### "API calls failing"
→ Verify VITE_API_URL is set correctly in Netlify

### "Build failed"
→ Check Netlify build logs for missing dependencies

### "Backend not responding"
→ Check Render logs, verify environment variables

### "Seats not updating"
→ Check MongoDB connection, verify seat hold API calls

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Vite Docs**: https://vitejs.dev
- **Express Docs**: https://expressjs.com

---

## ✅ Final Verification

Once everything is checked:

1. Visit your live site: `https://your-site.netlify.app`
2. Complete a full booking flow
3. Check email for confirmation
4. Verify booking in admin panel
5. Celebrate! 🎉

---

**Deployment Date**: _______________
**Frontend URL**: _______________
**Backend URL**: _______________
**Database**: MongoDB Atlas
**Status**: ⬜ In Progress | ⬜ Completed | ⬜ Issues

---

## Notes

_Add any deployment notes, issues encountered, or special configurations here:_

