import ChatLog from '../models/ChatLog.js';

class ChatLogService {
  /**
   * Log user interaction with chatbot
   * @param {string} userMessage - The user's message
   * @param {string|null} matchedFaqId - ID of matched FAQ (null if no match)
   * @returns {Promise<Object>} - Created chat log entry
   */
  async logInteraction(userMessage, matchedFaqId = null) {
    try {
      const chatLog = new ChatLog({
        userMessage,
        matchedFaqId: matchedFaqId || null,
        createdAt: new Date()
      });

      await chatLog.save();
      return chatLog;
    } catch (error) {
      console.error('Error logging chat interaction:', error);
      throw error;
    }
  }

  /**
   * Get most common questions from chat logs
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} - Array of common questions with counts
   */
  async getCommonQuestions(limit = 10) {
    try {
      const commonQuestions = await ChatLog.aggregate([
        {
          $group: {
            _id: '$userMessage',
            count: { $sum: 1 },
            lastAsked: { $max: '$createdAt' }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            _id: 0,
            question: '$_id',
            count: 1,
            lastAsked: 1
          }
        }
      ]);

      return commonQuestions;
    } catch (error) {
      console.error('Error getting common questions:', error);
      throw error;
    }
  }

  /**
   * Get questions that had no FAQ match
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} - Array of unmatched questions
   */
  async getUnmatchedQuestions(limit = 10) {
    try {
      const unmatchedQuestions = await ChatLog.aggregate([
        {
          $match: { matchedFaqId: null }
        },
        {
          $group: {
            _id: '$userMessage',
            count: { $sum: 1 },
            lastAsked: { $max: '$createdAt' }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            _id: 0,
            question: '$_id',
            count: 1,
            lastAsked: 1
          }
        }
      ]);

      return unmatchedQuestions;
    } catch (error) {
      console.error('Error getting unmatched questions:', error);
      throw error;
    }
  }

  /**
   * Get analytics summary
   * @returns {Promise<Object>} - Analytics data
   */
  async getAnalytics() {
    try {
      const totalMessages = await ChatLog.countDocuments();
      const matchedMessages = await ChatLog.countDocuments({ matchedFaqId: { $ne: null } });
      const unmatchedMessages = totalMessages - matchedMessages;
      const matchRate = totalMessages > 0 ? (matchedMessages / totalMessages * 100).toFixed(2) : 0;

      return {
        totalMessages,
        matchedMessages,
        unmatchedMessages,
        matchRate: parseFloat(matchRate)
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }

  /**
   * Get recent chat logs
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} - Array of recent chat logs
   */
  async getRecentLogs(limit = 50) {
    try {
      const logs = await ChatLog.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('matchedFaqId', 'question answer');

      return logs;
    } catch (error) {
      console.error('Error getting recent logs:', error);
      throw error;
    }
  }
}

export default new ChatLogService();
