import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Cinema from '../models/Cinema.js';
import Hall from '../models/Hall.js';
import Showtime from '../models/Showtime.js';
import Booking from '../models/Booking.js';
import Promotion from '../models/Promotion.js';
import Revenue from '../models/Revenue.js';
import SystemLog from '../models/SystemLog.js';
import Banner from '../models/Banner.js';
import FBItem from '../models/FBItem.js';
import FBOffer from '../models/FBOffer.js';

const router = express.Router();

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin user
    const admin = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'admin',
      isActive: true
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// Get admin dashboard stats
router.get('/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments({ isActive: true });
    const totalCinemas = await Cinema.countDocuments();
    const totalHalls = await Hall.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    const todayShowtimes = await Showtime.countDocuments({
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    const todayBookings = await Booking.countDocuments({
      bookingDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    const todayRevenue = await Booking.aggregate([
      {
        $match: {
          bookingDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999))
          },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          bookingDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      totalMovies,
      totalCinemas,
      totalHalls,
      totalUsers,
      todayShowtimes,
      todayBookings,
      todayRevenue: todayRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Get all movies for admin
router.get('/movies', authenticateAdmin, async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

// Add new movie
router.post('/movies', authenticateAdmin, async (req, res) => {
  try {
    const movieData = req.body;
    
    // Check if movie already exists
    const existingMovie = await Movie.findOne({ title: movieData.title });
    if (existingMovie) {
      return res.status(400).json({ message: 'Movie with this title already exists' });
    }

    const newMovie = new Movie({
      ...movieData,
      isActive: true
    });

    await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  } catch (error) {
    console.error('Add movie error:', error);
    res.status(500).json({ message: 'Error adding movie' });
  }
});

// Update movie
router.put('/movies/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie updated successfully', movie: updatedMovie });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ message: 'Error updating movie' });
  }
});

// Delete movie
router.delete('/movies/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - set isActive to false
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Also remove associated showtimes
    await Showtime.deleteMany({ movieId: id });

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ message: 'Error deleting movie' });
  }
});

// Get all cinemas and halls
router.get('/cinemas', authenticateAdmin, async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    const cinemasWithHalls = await Promise.all(
      cinemas.map(async (cinema) => {
        const halls = await Hall.find({ cinemaId: cinema._id });
        return {
          ...cinema.toObject(),
          halls
        };
      })
    );
    
    res.json(cinemasWithHalls);
  } catch (error) {
    console.error('Get cinemas error:', error);
    res.status(500).json({ message: 'Error fetching cinemas' });
  }
});

// Get showtimes with filters
router.get('/showtimes', authenticateAdmin, async (req, res) => {
  try {
    const { date, movieId, cinemaId } = req.query;
    
    let filter = {};
    
    if (date) {
      const targetDate = new Date(date);
      filter.date = {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }
    
    if (movieId) filter.movieId = movieId;
    if (cinemaId) filter.cinemaId = cinemaId;

    const showtimes = await Showtime.find(filter)
      .populate('movieId', 'title image')
      .populate('cinemaId', 'name location')
      .populate('hallId', 'name type')
      .sort({ date: 1, time: 1 });

    res.json(showtimes);
  } catch (error) {
    console.error('Get showtimes error:', error);
    res.status(500).json({ message: 'Error fetching showtimes' });
  }
});

// Add new showtime
router.post('/showtimes', authenticateAdmin, async (req, res) => {
  try {
    const { movieId, cinemaId, hallId, date, time, price, originalPrice } = req.body;

    // Check if showtime already exists for this hall at this time
    const existingShowtime = await Showtime.findOne({
      hallId,
      date: new Date(date),
      time
    });

    if (existingShowtime) {
      return res.status(400).json({ 
        message: 'A showtime already exists for this hall at this time' 
      });
    }

    // Get hall info for available seats
    const hall = await Hall.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    const newShowtime = new Showtime({
      movieId,
      cinemaId,
      hallId,
      date: new Date(date),
      time,
      price: price || originalPrice,
      originalPrice,
      availableSeats: hall.totalSeats,
      bookedSeats: []
    });

    await newShowtime.save();
    
    const populatedShowtime = await Showtime.findById(newShowtime._id)
      .populate('movieId', 'title')
      .populate('cinemaId', 'name')
      .populate('hallId', 'name type');

    res.status(201).json({ 
      message: 'Showtime added successfully', 
      showtime: populatedShowtime 
    });
  } catch (error) {
    console.error('Add showtime error:', error);
    res.status(500).json({ message: 'Error adding showtime' });
  }
});

// Update showtime
router.put('/showtimes/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const updatedShowtime = await Showtime.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('movieId', 'title')
     .populate('cinemaId', 'name')
     .populate('hallId', 'name type');

    if (!updatedShowtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.json({ message: 'Showtime updated successfully', showtime: updatedShowtime });
  } catch (error) {
    console.error('Update showtime error:', error);
    res.status(500).json({ message: 'Error updating showtime' });
  }
});

// Delete showtime
router.delete('/showtimes/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedShowtime = await Showtime.findByIdAndDelete(id);
    if (!deletedShowtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.json({ message: 'Showtime deleted successfully' });
  } catch (error) {
    console.error('Delete showtime error:', error);
    res.status(500).json({ message: 'Error deleting showtime' });
  }
});

export default router;

// ==========================================
// USER MANAGEMENT ENDPOINTS
// ==========================================

// Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { login: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;
    if (status) filter.isActive = status === 'active';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user status
router.put('/users/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Get user booking history
router.get('/users/:id/bookings', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ userId: id })
      .populate('movieId', 'title image')
      .populate('cinemaId', 'name location')
      .populate('hallId', 'name')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
});

// ==========================================
// BOOKING MANAGEMENT ENDPOINTS
// ==========================================

// Get all bookings
router.get('/bookings', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, date, cinema } = req.query;
    
    let filter = {};
    if (status) filter.bookingStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (date) {
      const targetDate = new Date(date);
      filter.showDate = {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }
    if (cinema) filter.cinemaId = cinema;

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email')
      .populate('movieId', 'title image')
      .populate('cinemaId', 'name location')
      .populate('hallId', 'name type')
      .sort({ bookingDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Cancel booking
router.put('/bookings/:id/cancel', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.bookingStatus = 'cancelled';
    booking.refundInfo = {
      refundAmount: booking.totalAmount,
      refundDate: new Date(),
      refundReason: reason,
      refundMethod: 'admin_cancellation'
    };
    
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

// ==========================================
// ANALYTICS & REPORTS ENDPOINTS
// ==========================================

// Revenue analytics
router.get('/analytics/revenue', authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate, cinemaId, movieId } = req.query;
    
    let matchFilter = {
      paymentStatus: 'completed'
    };

    if (startDate && endDate) {
      matchFilter.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (cinemaId) matchFilter.cinemaId = cinemaId;
    if (movieId) matchFilter.movieId = movieId;

    // Daily revenue data
    const revenueData = await Booking.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" } }
          },
          totalRevenue: { $sum: '$totalAmount' },
          totalBookings: { $sum: 1 },
          averageBookingValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Payment method statistics
    const paymentMethodStats = await Booking.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      revenueData,
      paymentMethodStats
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ message: 'Error fetching revenue analytics' });
  }
});

// Movie performance analytics
router.get('/analytics/movies', authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchFilter = {
      paymentStatus: 'completed'
    };

    if (startDate && endDate) {
      matchFilter.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const movieStats = await Booking.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$movieId',
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageBookingValue: { $avg: '$totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    res.json(movieStats);
  } catch (error) {
    console.error('Movie analytics error:', error);
    res.status(500).json({ message: 'Error fetching movie analytics' });
  }
});

// ==========================================
// PROMOTION MANAGEMENT ENDPOINTS
// ==========================================

// Get all promotions
router.get('/promotions', authenticateAdmin, async (req, res) => {
  try {
    const promotions = await Promotion.find()
      .populate('createdBy', 'name')
      .populate('applicableMovies', 'title')
      .populate('applicableCinemas', 'name')
      .sort({ createdAt: -1 });

    res.json(promotions);
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({ message: 'Error fetching promotions' });
  }
});

// Create promotion
router.post('/promotions', authenticateAdmin, async (req, res) => {
  try {
    const promotionData = {
      ...req.body,
      createdBy: req.user._id
    };

    const promotion = new Promotion(promotionData);
    await promotion.save();

    res.status(201).json({ message: 'Promotion created successfully', promotion });
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({ message: 'Error creating promotion' });
  }
});

// Update promotion
router.put('/promotions/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.json({ message: 'Promotion updated successfully', promotion });
  } catch (error) {
    console.error('Update promotion error:', error);
    res.status(500).json({ message: 'Error updating promotion' });
  }
});

// Delete promotion
router.delete('/promotions/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndDelete(id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.status(500).json({ message: 'Error deleting promotion' });
  }
});

// ==========================================
// CINEMA MANAGEMENT ENDPOINTS
// ==========================================

// Add new cinema
router.post('/cinemas', authenticateAdmin, async (req, res) => {
  try {
    const cinema = new Cinema(req.body);
    await cinema.save();

    res.status(201).json({ message: 'Cinema added successfully', cinema });
  } catch (error) {
    console.error('Add cinema error:', error);
    res.status(500).json({ message: 'Error adding cinema' });
  }
});

// Update cinema
router.put('/cinemas/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const cinema = await Cinema.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }

    res.json({ message: 'Cinema updated successfully', cinema });
  } catch (error) {
    console.error('Update cinema error:', error);
    res.status(500).json({ message: 'Error updating cinema' });
  }
});

// Add hall to cinema
router.post('/cinemas/:id/halls', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const hallData = {
      ...req.body,
      cinemaId: id
    };

    const hall = new Hall(hallData);
    await hall.save();

    res.status(201).json({ message: 'Hall added successfully', hall });
  } catch (error) {
    console.error('Add hall error:', error);
    res.status(500).json({ message: 'Error adding hall' });
  }
});

// Update hall
router.put('/halls/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const hall = await Hall.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    res.json({ message: 'Hall updated successfully', hall });
  } catch (error) {
    console.error('Update hall error:', error);
    res.status(500).json({ message: 'Error updating hall' });
  }
});

// ==========================================
// BANNER MANAGEMENT ENDPOINTS
// ==========================================

// Get all banners
router.get('/banners', authenticateAdmin, async (req, res) => {
  try {
    const banners = await Banner.find()
      .populate('createdBy', 'name')
      .sort({ priority: -1, createdAt: -1 });

    res.json(banners);
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ message: 'Error fetching banners' });
  }
});

// Create banner
router.post('/banners', authenticateAdmin, async (req, res) => {
  try {
    const bannerData = {
      ...req.body,
      createdBy: req.user._id
    };

    const banner = new Banner(bannerData);
    await banner.save();

    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ message: 'Error creating banner' });
  }
});

// Update banner
router.put('/banners/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.json({ message: 'Banner updated successfully', banner });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ message: 'Error updating banner' });
  }
});

// Delete banner
router.delete('/banners/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ message: 'Error deleting banner' });
  }
});

// ==========================================
// FOOD & BEVERAGE MANAGEMENT ENDPOINTS
// ==========================================

// Get all F&B items
router.get('/fb/items', authenticateAdmin, async (req, res) => {
  try {
    const { category, cinemaId, active } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (cinemaId) filter.cinemaId = cinemaId;
    if (active !== undefined) filter.isActive = active === 'true';

    const items = await FBItem.find(filter)
      .populate('cinemaId', 'name')
      .sort({ category: 1, displayOrder: 1, name: 1 });

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Get F&B items error:', error);
    res.status(500).json({ success: false, message: 'Error fetching F&B items' });
  }
});

// Add new F&B item
router.post('/fb/items', authenticateAdmin, async (req, res) => {
  try {
    const item = new FBItem(req.body);
    await item.save();

    res.status(201).json({
      success: true,
      message: 'F&B item added successfully',
      item
    });
  } catch (error) {
    console.error('Add F&B item error:', error);
    res.status(500).json({ success: false, message: 'Error adding F&B item' });
  }
});

// Update F&B item
router.put('/fb/items/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await FBItem.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'F&B item not found' });
    }

    res.json({
      success: true,
      message: 'F&B item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update F&B item error:', error);
    res.status(500).json({ success: false, message: 'Error updating F&B item' });
  }
});

// Delete F&B item (soft delete)
router.delete('/fb/items/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await FBItem.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'F&B item not found' });
    }

    res.json({
      success: true,
      message: 'F&B item deleted successfully'
    });
  } catch (error) {
    console.error('Delete F&B item error:', error);
    res.status(500).json({ success: false, message: 'Error deleting F&B item' });
  }
});

// Get all F&B offers
router.get('/fb/offers', authenticateAdmin, async (req, res) => {
  try {
    const { active, cinemaId } = req.query;
    
    let filter = {};
    if (active !== undefined) filter.isActive = active === 'true';
    if (cinemaId) filter.cinemaId = cinemaId;

    const offers = await FBOffer.find(filter)
      .populate('applicableItems', 'name category')
      .populate('cinemaId', 'name')
      .populate('createdBy', 'name')
      .sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      count: offers.length,
      offers
    });
  } catch (error) {
    console.error('Get F&B offers error:', error);
    res.status(500).json({ success: false, message: 'Error fetching F&B offers' });
  }
});

// Add new F&B offer
router.post('/fb/offers', authenticateAdmin, async (req, res) => {
  try {
    const offerData = {
      ...req.body,
      createdBy: req.user._id
    };

    const offer = new FBOffer(offerData);
    await offer.save();

    res.status(201).json({
      success: true,
      message: 'F&B offer added successfully',
      offer
    });
  } catch (error) {
    console.error('Add F&B offer error:', error);
    res.status(500).json({ success: false, message: 'Error adding F&B offer' });
  }
});

// Update F&B offer
router.put('/fb/offers/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await FBOffer.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({ success: false, message: 'F&B offer not found' });
    }

    res.json({
      success: true,
      message: 'F&B offer updated successfully',
      offer
    });
  } catch (error) {
    console.error('Update F&B offer error:', error);
    res.status(500).json({ success: false, message: 'Error updating F&B offer' });
  }
});

// Delete F&B offer
router.delete('/fb/offers/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await FBOffer.findByIdAndDelete(id);

    if (!offer) {
      return res.status(404).json({ success: false, message: 'F&B offer not found' });
    }

    res.json({
      success: true,
      message: 'F&B offer deleted successfully'
    });
  } catch (error) {
    console.error('Delete F&B offer error:', error);
    res.status(500).json({ success: false, message: 'Error deleting F&B offer' });
  }
});

// ==========================================
// SYSTEM MANAGEMENT ENDPOINTS
// ==========================================

// Get system logs
router.get('/system/logs', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, level, category } = req.query;
    
    let filter = {};
    if (level) filter.level = level;
    if (category) filter.category = category;

    const logs = await SystemLog.find(filter)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SystemLog.countDocuments(filter);

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get system logs error:', error);
    res.status(500).json({ message: 'Error fetching system logs' });
  }
});

// System health check
router.get('/system/health', authenticateAdmin, async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    const stats = {
      database: dbStatus,
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      },
      timestamp: new Date()
    };

    res.json(stats);
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ message: 'Error checking system health' });
  }
});

// Database backup (placeholder)
router.post('/system/backup', authenticateAdmin, async (req, res) => {
  try {
    // This would typically trigger a database backup process
    // For now, we'll just return a success message
    res.json({ 
      message: 'Database backup initiated successfully',
      timestamp: new Date(),
      status: 'in_progress'
    });
  } catch (error) {
    console.error('Database backup error:', error);
    res.status(500).json({ message: 'Error initiating database backup' });
  }
});