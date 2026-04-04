import express from 'express';
import FBItem from '../models/FBItem.js';
import FBOffer from '../models/FBOffer.js';

const router = express.Router();

/**
 * GET /api/fb/items
 * Fetch all F&B items with optional filtering
 */
router.get('/items', async (req, res) => {
  try {
    const { cinemaId, category, active = 'true' } = req.query;
    
    // Build filter
    const filter = {};
    
    if (active === 'true') {
      filter.isActive = true;
    }
    
    if (cinemaId) {
      filter.$or = [
        { cinemaId: cinemaId },
        { cinemaId: { $exists: false } } // Include global items
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    // Fetch items
    const items = await FBItem.find(filter)
      .sort({ displayOrder: 1, category: 1, name: 1 })
      .lean();
    
    res.json({
      success: true,
      count: items.length,
      items
    });
    
  } catch (error) {
    console.error('Get F&B items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching F&B items',
      error: error.message
    });
  }
});

/**
 * GET /api/fb/items/:id
 * Fetch single F&B item by ID
 */
router.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await FBItem.findById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'F&B item not found'
      });
    }
    
    res.json({
      success: true,
      item
    });
    
  } catch (error) {
    console.error('Get F&B item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching F&B item',
      error: error.message
    });
  }
});

/**
 * GET /api/fb/offers
 * Fetch active offers with optional filtering
 */
router.get('/offers', async (req, res) => {
  try {
    const { date, ticketCount, cinemaId } = req.query;
    
    const now = new Date();
    const checkDate = date ? new Date(date) : now;
    
    // Build filter for active offers
    const filter = {
      isActive: true,
      validFrom: { $lte: checkDate },
      validUntil: { $gte: checkDate }
    };
    
    if (cinemaId) {
      filter.$or = [
        { cinemaId: cinemaId },
        { cinemaId: { $exists: false } } // Include global offers
      ];
    }
    
    // Fetch offers
    let offers = await FBOffer.find(filter)
      .populate('applicableItems', 'name category')
      .sort({ priority: -1, createdAt: -1 })
      .lean();
    
    // Filter by valid days
    const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    offers = offers.filter(offer => {
      if (!offer.validDays || offer.validDays.length === 0) return true;
      return offer.validDays.includes(dayName);
    });
    
    // Filter by ticket count
    if (ticketCount) {
      const count = parseInt(ticketCount);
      offers = offers.filter(offer => {
        if (!offer.minTickets) return true;
        return count >= offer.minTickets;
      });
    }
    
    // Filter by usage limit
    offers = offers.filter(offer => {
      if (!offer.usageLimit) return true;
      return offer.usedCount < offer.usageLimit;
    });
    
    res.json({
      success: true,
      count: offers.length,
      offers
    });
    
  } catch (error) {
    console.error('Get F&B offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching F&B offers',
      error: error.message
    });
  }
});

/**
 * POST /api/fb/calculate-total
 * Calculate total with offers applied
 */
router.post('/calculate-total', async (req, res) => {
  try {
    const { items, ticketCount = 1, bookingDate } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide items array'
      });
    }
    
    // Fetch item details
    const itemIds = items.map(i => i.itemId);
    const fbItems = await FBItem.find({ _id: { $in: itemIds }, isActive: true });
    
    if (fbItems.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'Some items are not available'
      });
    }
    
    // Calculate subtotal
    let subtotal = 0;
    const cartItems = items.map(cartItem => {
      const item = fbItems.find(i => i._id.toString() === cartItem.itemId);
      const price = cartItem.size ? item.getPriceForSize(cartItem.size) : item.basePrice;
      const itemSubtotal = price * cartItem.quantity;
      
      subtotal += itemSubtotal;
      
      return {
        itemId: item._id,
        name: item.name,
        category: item.category,
        quantity: cartItem.quantity,
        selectedSize: cartItem.size,
        pricePerUnit: price,
        subtotal: itemSubtotal
      };
    });
    
    // Fetch applicable offers
    const checkDate = bookingDate ? new Date(bookingDate) : new Date();
    const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const offers = await FBOffer.find({
      isActive: true,
      validFrom: { $lte: checkDate },
      validUntil: { $gte: checkDate },
      $or: [
        { validDays: { $size: 0 } },
        { validDays: dayName }
      ]
    }).sort({ priority: -1 });
    
    // Apply offers
    const appliedOffers = [];
    let totalDiscount = 0;
    
    for (const offer of offers) {
      // Check usage limit
      if (offer.usageLimit && offer.usedCount >= offer.usageLimit) continue;
      
      // Check minimum tickets
      if (offer.minTickets && ticketCount < offer.minTickets) continue;
      
      // Check minimum amount
      if (offer.minAmount && subtotal < offer.minAmount) continue;
      
      // Calculate applicable amount
      let applicableAmount = 0;
      
      for (const cartItem of cartItems) {
        const item = fbItems.find(i => i._id.toString() === cartItem.itemId.toString());
        if (offer.appliesTo(item._id, item.category)) {
          applicableAmount += cartItem.subtotal;
        }
      }
      
      if (applicableAmount > 0) {
        const discount = offer.calculateDiscount(applicableAmount);
        
        if (discount > 0) {
          totalDiscount += discount;
          appliedOffers.push({
            offerId: offer._id,
            title: offer.title,
            description: offer.description,
            type: offer.type,
            discountAmount: discount
          });
        }
      }
    }
    
    // Ensure total discount doesn't exceed subtotal
    totalDiscount = Math.min(totalDiscount, subtotal);
    
    // Calculate final total
    const finalTotal = Math.max(0, subtotal - totalDiscount);
    
    res.json({
      success: true,
      items: cartItems,
      subtotal,
      appliedOffers,
      totalDiscount,
      finalTotal
    });
    
  } catch (error) {
    console.error('Calculate total error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating total',
      error: error.message
    });
  }
});

/**
 * POST /api/fb/recommendations
 * Get recommended combos based on ticket count
 */
router.post('/recommendations', async (req, res) => {
  try {
    const { ticketCount = 1, cinemaId } = req.body;
    
    // Build filter
    const filter = {
      isActive: true,
      isCombo: true
    };
    
    if (cinemaId) {
      filter.$or = [
        { cinemaId: cinemaId },
        { cinemaId: { $exists: false } }
      ];
    }
    
    // Fetch all combos
    const combos = await FBItem.find(filter).lean();
    
    // Recommend based on ticket count
    const recommendations = [];
    
    for (const combo of combos) {
      let reason = '';
      let score = 0;
      
      // Scoring logic based on ticket count
      if (ticketCount === 1) {
        if (combo.name.toLowerCase().includes('single') || 
            combo.name.toLowerCase().includes('solo') ||
            combo.name.toLowerCase().includes('individual')) {
          score = 100;
          reason = 'Perfect for one person';
        } else if (combo.name.toLowerCase().includes('small')) {
          score = 80;
          reason = 'Great individual portion';
        }
      } else if (ticketCount === 2) {
        if (combo.name.toLowerCase().includes('couple') || 
            combo.name.toLowerCase().includes('duo') ||
            combo.name.toLowerCase().includes('pair')) {
          score = 100;
          reason = 'Perfect for two people';
        } else if (combo.name.toLowerCase().includes('medium')) {
          score = 80;
          reason = 'Great for sharing';
        }
      } else if (ticketCount >= 3 && ticketCount <= 4) {
        if (combo.name.toLowerCase().includes('family') || 
            combo.name.toLowerCase().includes('group') ||
            combo.name.toLowerCase().includes('large')) {
          score = 100;
          reason = `Perfect for ${ticketCount} people`;
        } else if (combo.name.toLowerCase().includes('sharing')) {
          score = 80;
          reason = 'Great for your group';
        }
      } else if (ticketCount >= 5) {
        if (combo.name.toLowerCase().includes('party') || 
            combo.name.toLowerCase().includes('mega') ||
            combo.name.toLowerCase().includes('jumbo')) {
          score = 100;
          reason = `Perfect for ${ticketCount} people`;
        } else if (combo.name.toLowerCase().includes('family') ||
                   combo.name.toLowerCase().includes('large')) {
          score = 80;
          reason = 'Great for large groups';
        }
      }
      
      // Add savings information
      const savings = combo.originalPrice ? combo.originalPrice - combo.basePrice : 0;
      
      if (score > 0) {
        recommendations.push({
          item: combo,
          reason,
          score,
          savings
        });
      }
    }
    
    // Sort by score
    recommendations.sort((a, b) => b.score - a.score);
    
    // Return top 3 recommendations
    res.json({
      success: true,
      ticketCount,
      recommendations: recommendations.slice(0, 3)
    });
    
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting recommendations',
      error: error.message
    });
  }
});

/**
 * GET /api/fb/categories
 * Get all available categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'all', name: 'All Items', icon: '🍿' },
      { id: 'combos', name: 'Combos', icon: '🎁' },
      { id: 'popcorn', name: 'Popcorn', icon: '🍿' },
      { id: 'drinks', name: 'Drinks', icon: '🥤' },
      { id: 'snacks', name: 'Snacks', icon: '🍕' },
      { id: 'candy', name: 'Candy', icon: '🍬' }
    ];
    
    res.json({
      success: true,
      categories
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

export default router;
