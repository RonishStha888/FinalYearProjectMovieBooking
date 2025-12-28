import express from 'express';
const router = express.Router();
import Cinema from '../models/Cinema.js';
import Hall from '../models/Hall.js';

// Get all cinemas by city
router.get('/', async (req, res) => {
  try {
    const { city = 'Kathmandu' } = req.query;
    
    const cinemas = await Cinema.find({ 
      city, 
      isActive: true 
    }).sort({ rating: -1 });
    
    res.json({
      success: true,
      cinemas
    });
  } catch (error) {
    console.error('Error fetching cinemas:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cinemas'
    });
  }
});

// Get cinema by ID with halls
router.get('/:id', async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    
    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }
    
    const halls = await Hall.find({ 
      cinemaId: req.params.id, 
      isActive: true 
    }).sort({ hallNumber: 1 });
    
    res.json({
      success: true,
      cinema: {
        ...cinema.toObject(),
        halls
      }
    });
  } catch (error) {
    console.error('Error fetching cinema:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cinema'
    });
  }
});

export default router;