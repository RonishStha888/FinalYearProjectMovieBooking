import express from 'express';
import Hall from '../../models/Hall.js';
import Cinema from '../../models/Cinema.js';
import { adminAuth } from '../../middleware/adminAuth.js';

const router = express.Router();

// Get all halls
router.get('/', adminAuth, async (req, res) => {
  try {
    const halls = await Hall.find().populate('cinemaId', 'name location');
    res.json(halls);
  } catch (error) {
    console.error('Error fetching halls:', error);
    res.status(500).json({ message: 'Error fetching halls' });
  }
});

// Get hall by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id).populate('cinemaId');
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }
    res.json(hall);
  } catch (error) {
    console.error('Error fetching hall:', error);
    res.status(500).json({ message: 'Error fetching hall' });
  }
});

// Create new hall
router.post('/', adminAuth, async (req, res) => {
  try {
    const hall = new Hall(req.body);
    await hall.save();
    
    // Add hall reference to cinema
    await Cinema.findByIdAndUpdate(
      req.body.cinemaId,
      { $push: { halls: hall._id } }
    );
    
    res.status(201).json(hall);
  } catch (error) {
    console.error('Error creating hall:', error);
    res.status(500).json({ message: 'Error creating hall', error: error.message });
  }
});

// Update hall
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const hall = await Hall.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }
    
    res.json(hall);
  } catch (error) {
    console.error('Error updating hall:', error);
    res.status(500).json({ message: 'Error updating hall', error: error.message });
  }
});

// Delete hall
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }
    
    // Remove hall reference from cinema
    await Cinema.findByIdAndUpdate(
      hall.cinemaId,
      { $pull: { halls: hall._id } }
    );
    
    await Hall.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Hall deleted successfully' });
  } catch (error) {
    console.error('Error deleting hall:', error);
    res.status(500).json({ message: 'Error deleting hall' });
  }
});

export default router;
