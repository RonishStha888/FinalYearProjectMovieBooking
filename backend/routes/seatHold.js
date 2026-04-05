import express from 'express';
import SeatHold from '../models/SeatHold.js';

const router = express.Router();

/**
 * Hold seats for a user (10 minutes)
 */
router.post('/hold', async (req, res) => {
  try {
    const { showtimeId, userId, sessionId, seats } = req.body;

    if (!showtimeId || !userId || !sessionId || !seats || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if seats are already held by someone else
    const existingHolds = await SeatHold.find({
      showtimeId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    const heldSeats = existingHolds.flatMap(hold => 
      hold.seats.map(s => s.seatNumber)
    );

    const requestedSeatNumbers = seats.map(s => s.seatNumber);
    const conflictingSeats = requestedSeatNumbers.filter(seat => 
      heldSeats.includes(seat)
    );

    if (conflictingSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Some seats are already being held by another user',
        conflictingSeats
      });
    }

    // Release any previous holds by this user for this showtime
    await SeatHold.updateMany(
      { showtimeId, userId, status: 'active' },
      { status: 'cancelled' }
    );

    // Create new hold (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    const seatHold = await SeatHold.create({
      showtimeId,
      userId,
      sessionId,
      seats,
      expiresAt,
      status: 'active'
    });

    console.log(`🔒 Seats held for user ${userId}:`, requestedSeatNumbers);
    console.log(`⏰ Expires at:`, expiresAt.toLocaleTimeString());

    res.json({
      success: true,
      message: 'Seats held successfully',
      holdId: seatHold._id,
      expiresAt,
      expiresIn: 600 // seconds
    });

  } catch (error) {
    console.error('❌ Seat hold error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * Release held seats
 */
router.post('/release', async (req, res) => {
  try {
    const { holdId, userId, sessionId } = req.body;

    let query = { status: 'active' };
    
    if (holdId) {
      query._id = holdId;
    } else if (userId && sessionId) {
      query.userId = userId;
      query.sessionId = sessionId;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either holdId or userId+sessionId required'
      });
    }

    const result = await SeatHold.updateMany(query, { 
      status: 'cancelled' 
    });

    console.log(`🔓 Released ${result.modifiedCount} seat hold(s)`);

    res.json({
      success: true,
      message: 'Seats released successfully',
      releasedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('❌ Seat release error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * Get held seats for a showtime
 */
router.get('/showtime/:showtimeId', async (req, res) => {
  try {
    const { showtimeId } = req.params;

    const holds = await SeatHold.find({
      showtimeId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    const heldSeats = holds.flatMap(hold => 
      hold.seats.map(s => s.seatNumber)
    );

    res.json({
      success: true,
      heldSeats,
      holds: holds.map(h => ({
        holdId: h._id,
        seats: h.seats.map(s => s.seatNumber),
        expiresAt: h.expiresAt
      }))
    });

  } catch (error) {
    console.error('❌ Get held seats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * Get permanently booked seats for a showtime
 */
router.get('/booked/:showtimeId', async (req, res) => {
  try {
    const { showtimeId } = req.params;

    const completedHolds = await SeatHold.find({
      showtimeId,
      status: 'completed'
    });

    const bookedSeats = completedHolds.flatMap(hold => 
      hold.seats.map(s => s.seatNumber)
    );

    res.json({
      success: true,
      bookedSeats,
      totalBooked: bookedSeats.length
    });

  } catch (error) {
    console.error('❌ Get booked seats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * Extend hold time (add 5 more minutes)
 */
router.post('/extend', async (req, res) => {
  try {
    const { holdId } = req.body;

    const hold = await SeatHold.findById(holdId);
    
    if (!hold || hold.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Hold not found or expired'
      });
    }

    // Add 5 more minutes
    hold.expiresAt = new Date(hold.expiresAt.getTime() + 5 * 60 * 1000);
    await hold.save();

    console.log(`⏰ Extended hold ${holdId} to`, hold.expiresAt.toLocaleTimeString());

    res.json({
      success: true,
      message: 'Hold extended successfully',
      expiresAt: hold.expiresAt
    });

  } catch (error) {
    console.error('❌ Extend hold error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * Mark hold as completed (after successful payment)
 */
router.post('/complete', async (req, res) => {
  try {
    const { holdId, userId, sessionId } = req.body;

    let query = { status: 'active' };
    
    if (holdId) {
      query._id = holdId;
    } else if (userId && sessionId) {
      query.userId = userId;
      query.sessionId = sessionId;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either holdId or userId+sessionId required'
      });
    }

    const result = await SeatHold.updateMany(query, { 
      status: 'completed' 
    });

    console.log(`✅ Completed ${result.modifiedCount} seat hold(s)`);

    res.json({
      success: true,
      message: 'Hold completed successfully',
      completedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('❌ Complete hold error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * Cleanup expired holds (called periodically)
 */
router.post('/cleanup', async (req, res) => {
  try {
    const result = await SeatHold.updateMany(
      {
        status: 'active',
        expiresAt: { $lt: new Date() }
      },
      { status: 'expired' }
    );

    console.log(`🧹 Cleaned up ${result.modifiedCount} expired holds`);

    res.json({
      success: true,
      message: 'Cleanup completed',
      expiredCount: result.modifiedCount
    });

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
