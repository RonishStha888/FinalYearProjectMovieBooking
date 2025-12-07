# RTX Cinema - Setup Guide

## 🎬 Complete Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed (or MongoDB Atlas account)

---

## Backend Setup

### 1. Install MongoDB

**Option A: Local MongoDB (Windows)**
```bash
# Download and install from:
https://www.mongodb.com/try/download/community

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `backend/.env` with your connection string

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

---

## Frontend Setup

### 1. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173`

---

## 🧪 Testing the Application

### Test Google Signup
1. Click the "SignUp" button (with Google icon)
2. It will create a test user in MongoDB
3. Check MongoDB to see the stored data

### Test Login
1. First, you need to create a user manually or use Google signup
2. Enter login and password
3. Click "Login" button

---

## 📊 View MongoDB Data

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse database: `rtx-cinema`
4. View collection: `users`

### Using MongoDB Shell
```bash
mongosh
use rtx-cinema
db.users.find()
```

---

## 🔧 Troubleshooting

### Backend won't start
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify `.env` file exists in backend folder

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify the API URL in frontend code

### MongoDB connection error
- Check if MongoDB service is running
- Verify connection string in `.env`
- For Atlas, check IP whitelist settings

---

## 📁 Project Structure

```
├── backend/
│   ├── models/
│   │   └── User.js          # User schema
│   ├── routes/
│   │   └── auth.js          # Auth endpoints
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   └── App.css          # Styles
│   └── package.json
```

---

## 🚀 Next Steps

1. Implement real Google OAuth integration
2. Add JWT tokens for authentication
3. Create signup page for email/password
4. Add password reset functionality
5. Implement user profile page

---

## 📝 API Endpoints

### POST /api/auth/login
```json
{
  "login": "username",
  "password": "password123"
}
```

### POST /api/auth/google
```json
{
  "email": "user@gmail.com",
  "name": "User Name",
  "googleId": "google-user-id"
}
```
