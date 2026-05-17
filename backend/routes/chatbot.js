import express from 'express';
import chatbotService from '../services/chatbotService.js';
import chatLogService from '../services/chatLogService.js';
import { chatbotRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/chatbot
 * Process user message and return bot response
 */
router.post('/', chatbotRateLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Trim message
    const trimmedMessage = message.trim();

    // Process message through chatbot service
    const { reply, matchedFaqId } = await chatbotService.processMessage(trimmedMessage);

    // Log the interaction
    await chatLogService.logInteraction(trimmedMessage, matchedFaqId);

    // Return response
    res.json({
      success: true,
      reply,
      matchedFaqId
    });

  } catch (error) {
    console.error('Error in chatbot endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while processing your message. Please try again.'
    });
  }
});

/**
 * GET /api/chatbot/analytics
 * Get chatbot analytics (for admin use)
 */
router.get('/analytics', async (req, res) => {
  try {
    const analytics = await chatLogService.getAnalytics();
    const commonQuestions = await chatLogService.getCommonQuestions(10);
    const unmatchedQuestions = await chatLogService.getUnmatchedQuestions(10);

    res.json({
      success: true,
      analytics,
      commonQuestions,
      unmatchedQuestions
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics'
    });
  }
});

/**
 * GET /api/chatbot/logs
 * Get recent chat logs (for admin use)
 */
router.get('/logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const logs = await chatLogService.getRecentLogs(limit);

    res.json({
      success: true,
      logs
    });
  } catch (error) {
    console.error('Error getting logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve logs'
    });
  }
});

/**
 * GET /api/chatbot/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chatbot service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
