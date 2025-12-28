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

export default router;