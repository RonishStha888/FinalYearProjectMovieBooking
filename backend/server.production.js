import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import cinemaRoutes from './routes/cinemas.js';
import adminRoutes from './routes/admin.js';
import hallRoutes from './routes/admin/halls.js';
import fbRoutes from './routes/fb.js';
import paymentRoutes from './routes/payment.js';
import loyaltyRoutes from './routes/loyalty.js';
import seatHoldRoutes from './routes/seatHold.js';
import chatbotRoutes from './routes/chatbot.js';
import parkingRoutes from './routes/parking.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration for Production
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'http://localhost:3000', // Alternative local port
  process.env.FRONTEND_URL, // Your Netlify URL from environment variable
  // Add your actual Netlify URL here as backup
  // 'https://rtx-cinema.netlify.app',
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/halls', hallRoutes);
app.use('/api/fb', fbRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/seat-hold', seatHoldRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/parking', parkingRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'RTX Cinema API is running!',
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
