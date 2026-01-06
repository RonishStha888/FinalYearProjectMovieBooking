# 🚀 RTX Cinema - Quick Setup Guide

## ⚡ Quick Start (5 Minutes)

### 1. Clone & Install
```bash
git clone https://github.com/RonishStha888/FinalYearProjectMovieBooking.git
cd FinalYearProjectMovieBooking

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies  
cd ../frontend && npm install
```

### 2. Environment Setup
Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/rtx_cinema
JWT_SECRET=rtx_cinema_secret_key_2024
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 3. Database Setup
```bash
cd backend
node seedData.js
```

### 4. Start Application
**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🔑 Test Login
- **Username**: `testuser`
- **Password**: `password123`

## 🎬 Experience Features
1. Login with test credentials
2. Browse 10 real movies with TMDB posters
3. Select any movie → Choose date/time/cinema
4. Experience professional seat selection
5. Complete booking with realistic pricing

## 🎭 Cinema Halls Available
- **QFX Cinema**: Regular (156 seats) + Gold Class (48 recliners)
- **FCube Cinema**: Standard (120 seats) + Premium (60 recliners)
- **Big Movies**: Main Hall (140 seats)

## 💰 Pricing Features
- Base prices: Rs. 380-700
- Premium seats: +Rs. 100
- Weekend surcharge: Automatic
- Convenience fee: Rs. 25

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Compass
# Connection string: mongodb://localhost:27017/rtx_cinema
```

### Port Already in Use
```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000
npx kill-port 5000
```

### Email Verification Setup
1. Enable 2-factor authentication on Gmail
2. Generate App Password in Google Account settings
3. Use App Password in EMAIL_PASS (not your regular password)

## 🎬 Ready to Experience Professional Cinema Booking!

Your RTX Cinema system is now ready with:
✅ Professional seat selection
✅ Real movie data integration  
✅ Realistic cinema layouts
✅ Dynamic pricing system
✅ Complete booking flow

**Open http://localhost:3000 and start booking!** 🎭✨