import FAQ from '../models/FAQ.js';

class ChatbotService {
  /**
   * Tokenize and lowercase user message
   * @param {string} message - User's message
   * @returns {string[]} - Array of lowercase tokens
   */
  tokenizeMessage(message) {
    if (!message || typeof message !== 'string') {
      return [];
    }
    
    // Lowercase, remove punctuation, split by whitespace
    return message
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  /**
   * Calculate keyword overlap score between message tokens and FAQ keywords
   * @param {string[]} messageTokens - Tokenized user message
   * @param {string[]} faqKeywords - FAQ keywords array
   * @returns {number} - Overlap score (number of matching keywords)
   */
  calculateScore(messageTokens, faqKeywords) {
    if (!messageTokens || !faqKeywords || messageTokens.length === 0 || faqKeywords.length === 0) {
      return 0;
    }

    let score = 0;
    
    // Count how many message tokens match FAQ keywords
    for (const token of messageTokens) {
      if (faqKeywords.includes(token)) {
        score++;
      }
    }
    
    return score;
  }

  /**
   * Find best matching FAQ for user message
   * @param {string[]} tokens - Tokenized user message
   * @returns {Promise<{faq: Object|null, score: number}>} - Best matching FAQ and its score
   */
  async findBestMatch(tokens) {
    try {
      // Get all FAQs from database
      const faqs = await FAQ.find();
      
      if (!faqs || faqs.length === 0) {
        return { faq: null, score: 0 };
      }

      let bestMatch = null;
      let bestScore = 0;

      // Calculate score for each FAQ
      for (const faq of faqs) {
        const faqKeywords = faq.keywords.split(',').map(k => k.trim());
        const score = this.calculateScore(tokens, faqKeywords);
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = faq;
        }
      }

      return { faq: bestMatch, score: bestScore };
    } catch (error) {
      console.error('Error finding best match:', error);
      return { faq: null, score: 0 };
    }
  }

  /**
   * Get fallback message when no FAQ match is found
   * @returns {string} - Fallback message
   */
  getFallbackMessage() {
    return "Sorry, I don't have an answer for that. Please contact us via call or WhatsApp us at 9828999454 for further assistance!";
  }

  /**
   * Process user message and return bot response
   * @param {string} message - User's message
   * @returns {Promise<{reply: string, matchedFaqId: string|null}>} - Bot response and matched FAQ ID
   */
  async processMessage(message) {
    try {
      // Tokenize the message
      const tokens = this.tokenizeMessage(message);
      
      if (tokens.length === 0) {
        return {
          reply: this.getFallbackMessage(),
          matchedFaqId: null
        };
      }

      // Find best matching FAQ
      const { faq, score } = await this.findBestMatch(tokens);
      
      // If we found a match with score > 0, return the answer
      if (faq && score > 0) {
        return {
          reply: faq.answer,
          matchedFaqId: faq._id.toString()
        };
      }
      
      // No match found, return fallback
      return {
        reply: this.getFallbackMessage(),
        matchedFaqId: null
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        reply: this.getFallbackMessage(),
        matchedFaqId: null
      };
    }
  }
}

export default new ChatbotService();
