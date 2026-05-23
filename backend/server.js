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

// Middleware
app.use(cors());
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

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'RTX Cinema API is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
