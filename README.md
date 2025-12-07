# RTX Cinema - Movie Booking Platform

A full-stack cinema booking application with user authentication, built with React and Node.js.

## Features

- 🎬 User Authentication (Email & Google OAuth)
- 🔐 Password Reset with Email Verification
- 🎥 Movie Collections (Top Rated, Action, Coming Soon)
- 📧 Email Notifications (Welcome & Password Reset)
- 🎨 Modern UI with Cinema Theme

## Tech Stack

**Frontend:**
- React + Vite
- Google OAuth (@react-oauth/google)
- CSS3

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- SendGrid (Email Service)
- bcrypt (Password Hashing)

## Color Theme

- Dark Background: `#1D1616`
- Dark Red: `#8E1616`
- Bright Red: `#D84040`
- Light Gray: `#EEEEEE`

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- SendGrid Account (for emails)
- Google OAuth Client ID (for Google sign-in)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd rtx-cinema
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rtx-cinema

# SendGrid Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-verified-email@gmail.com
```

5. **Start MongoDB**
- Make sure MongoDB is running on `localhost:27017`
- Or update `MONGODB_URI` in `.env` with your MongoDB connection string

6. **Run the Application**

Start Backend (in `backend` folder):
```bash
npm run dev
```

Start Frontend (in `frontend` folder):
```bash
npm run dev
```

7. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
rtx-cinema/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Email services
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── public/          # Static assets
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with code

## Database

**MongoDB Collections:**
- `users` - User accounts
- `passwordresets` - Password reset codes (15-minute expiration)

## Email Templates

- Welcome Email - Sent on signup
- Password Reset Email - Sent with 6-digit code

## Security Features

- Password hashing with bcrypt
- Environment variables for sensitive data
- Password reset code expiration (15 minutes)
- MongoDB injection protection

## Contributing

Feel free to submit issues and pull requests!

## License

MIT License

---

© 2020-2021, PT TIX ID
