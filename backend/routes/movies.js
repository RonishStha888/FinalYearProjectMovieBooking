import express from 'express';
const router = express.Router();
import Movie from '../models/Movie.js';
import Cinema from '../models/Cinema.js';
import Hall from '../models/Hall.js';
import Showtime from '../models/Showtime.js';
import { getTopRatedMovies, getCurrentlyShowingMovies, getMoviesByCategory } from '../services/movieApiService.js';

// Get all movies with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20 } = req.query;
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const movies = await Movie.find(query)
      .limit(parseInt(limit))
      .sort({ rating: -1, createdAt: -1 });
    
    res.json({
      success: true,
      movies
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies'
    });
  }
});

// Get currently showing movies (for homepage banner)
router.get('/now-showing', async (req, res) => {
  try {
    const movies = await Movie.find({ 
      isActive: true,
      $or: [
        { category: 'action' },
        { category: 'coming-soon' },
        { rating: { $gte: 7.5 } }
      ]
    })
    .limit(6)
    .sort({ rating: -1, releaseDate: -1 });
    
    res.json({
      success: true,
      movies,
      message: 'Currently showing movies with real posters'
    });
  } catch (error) {
    console.error('Error fetching now showing movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch currently showing movies'
    });
  }
});

// Get top rated movies (for top rated section)
router.get('/top-rated', async (req, res) => {
  try {
    const movies = await Movie.find({ 
      isActive: true,
      $or: [
        { category: 'top-rated' },
        { rating: { $gte: 8.0 } }
      ]
    })
    .limit(8)
    .sort({ rating: -1 });
    
    res.json({
      success: true,
      movies,
      message: 'Top rated movies with real posters'
    });
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top rated movies'
    });
  }
});

// Get movie by ID with showtimes
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    res.json({
      success: true,
      movie
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movie'
    });
  }
});

// Get showtimes for a movie
router.get('/:id/showtimes', async (req, res) => {
  try {
    const { date, city = 'Kathmandu' } = req.query;
    const movieId = req.params.id;
    
    // Default to today if no date provided
    const searchDate = date ? new Date(date) : new Date();
    searchDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const showtimes = await Showtime.find({
      movieId,
      date: {
        $gte: searchDate,
        $lt: nextDay
      },
      isActive: true
    })
    .populate({
      path: 'cinemaId',
      match: { city, isActive: true }
    })
    .populate('hallId')
    .sort({ time: 1 });
    
    // Filter out showtimes where cinema is null (due to city filter)
    const validShowtimes = showtimes.filter(showtime => showtime.cinemaId);
    
    // Group by cinema
    const cinemaShowtimes = {};
    
    validShowtimes.forEach(showtime => {
      const cinemaId = showtime.cinemaId._id.toString();
      
      if (!cinemaShowtimes[cinemaId]) {
        cinemaShowtimes[cinemaId] = {
          cinema: showtime.cinemaId,
          halls: {}
        };
      }
      
      const hallId = showtime.hallId._id.toString();
      if (!cinemaShowtimes[cinemaId].halls[hallId]) {
        cinemaShowtimes[cinemaId].halls[hallId] = {
          hall: showtime.hallId,
          showtimes: []
        };
      }
      
      cinemaShowtimes[cinemaId].halls[hallId].showtimes.push({
        _id: showtime._id,
        time: showtime.time,
        price: showtime.price,
        originalPrice: showtime.originalPrice,
        availableSeats: showtime.getAvailableSeatsCount()
      });
    });
    
    res.json({
      success: true,
      date: searchDate,
      cinemas: Object.values(cinemaShowtimes)
    });
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch showtimes'
    });
  }
});

// Get seat layout and booked seats for a specific showtime
router.get('/showtimes/:showtimeId/seats', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.showtimeId)
      .populate('cinemaId')
      .populate('hallId');
    
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
    }
    
    // Get the seat layout for this hall
    const getHallSeatLayout = (hallType, cinemaName) => {
      const layouts = {
        'QFX_REGULAR': {
          rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
          seatsPerRow: [10, 12, 14, 14, 16, 16, 16, 16, 14, 14, 12, 10],
          aisles: [3, 7],
          premiumRows: ['F', 'G', 'H'],
          disabledSeats: ['A1', 'A10', 'L1', 'L10']
        },
        'QFX_GOLD': {
          rows: ['A', 'B', 'C', 'D', 'E', 'F'],
          seatsPerRow: [6, 8, 8, 8, 8, 6],
          aisles: [2, 6],
          premiumRows: ['C', 'D', 'E'],
          disabledSeats: [],
          isRecliners: true
        },
        'FCUBE_STANDARD': {
          rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          seatsPerRow: [8, 10, 12, 12, 14, 14, 12, 12, 10, 8],
          aisles: [3, 8],
          premiumRows: ['E', 'F', 'G'],
          disabledSeats: ['A1', 'A8', 'J1', 'J8']
        },
        'FCUBE_PREMIUM': {
          rows: ['A', 'B', 'C', 'D', 'E', 'F'],
          seatsPerRow: [8, 10, 10, 10, 10, 8],
          aisles: [3, 7],
          premiumRows: ['C', 'D', 'E'],
          disabledSeats: [],
          isRecliners: true
        },
        'BIG_REGULAR': {
          rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
          seatsPerRow: [8, 8, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 8],
          aisles: [3, 7],
          premiumRows: ['G', 'H', 'I', 'J'],
          disabledSeats: ['A1', 'A8', 'N1', 'N8']
        }
      };

      let layoutKey = 'QFX_REGULAR';
      if (cinemaName?.includes('QFX')) {
        layoutKey = hallType?.includes('GOLD') ? 'QFX_GOLD' : 'QFX_REGULAR';
      } else if (cinemaName?.includes('FCube')) {
        layoutKey = hallType?.includes('PREMIUM') ? 'FCUBE_PREMIUM' : 'FCUBE_STANDARD';
      } else if (cinemaName?.includes('Big Movies')) {
        layoutKey = 'BIG_REGULAR';
      }

      return layouts[layoutKey];
    };
    
    const seatLayout = getHallSeatLayout(showtime.hallId.type, showtime.cinemaId.name);
    const bookedSeats = showtime.bookedSeats.map(seat => seat.seatNumber);
    
    res.json({
      success: true,
      showtime: {
        _id: showtime._id,
        movieId: showtime.movieId,
        date: showtime.date,
        time: showtime.time,
        price: showtime.price,
        cinema: showtime.cinemaId,
        hall: showtime.hallId
      },
      seatLayout,
      bookedSeats,
      availableSeats: showtime.getAvailableSeatsCount()
    });
  } catch (error) {
    console.error('Error fetching seat layout:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seat layout'
    });
  }
});

// Book seats for a showtime
router.post('/showtimes/:showtimeId/book', async (req, res) => {
  try {
    const { seats, userId } = req.body;
    const showtimeId = req.params.showtimeId;
    
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat'
      });
    }
    
    if (seats.length > 8) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 8 seats can be booked at once'
      });
    }
    
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
    }
    
    // Check if any of the requested seats are already booked
    const alreadyBookedSeats = showtime.bookedSeats.map(seat => seat.seatNumber);
    const conflictingSeats = seats.filter(seat => alreadyBookedSeats.includes(seat));
    
    if (conflictingSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats ${conflictingSeats.join(', ')} are already booked`,
        conflictingSeats
      });
    }
    
    // Add the new bookings
    const newBookings = seats.map(seatNumber => ({
      seatNumber,
      userId: userId || null,
      bookedAt: new Date()
    }));
    
    showtime.bookedSeats.push(...newBookings);
    await showtime.save();
    
    res.json({
      success: true,
      message: `Successfully booked ${seats.length} seat(s)`,
      bookedSeats: seats,
      totalBookedSeats: showtime.bookedSeats.length,
      availableSeats: showtime.getAvailableSeatsCount()
    });
  } catch (error) {
    console.error('Error booking seats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book seats'
    });
  }
});

export default router;