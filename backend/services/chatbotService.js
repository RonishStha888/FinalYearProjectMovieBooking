import FAQ from '../models/FAQ.js';
import Movie from '../models/Movie.js';
import Cinema from '../models/Cinema.js';
import Showtime from '../models/Showtime.js';

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
   * Check if message is asking about movies
   * @param {string[]} tokens - Tokenized message
   * @returns {string|null} - Type of movie query or null
   */
  detectMovieQuery(tokens) {
    const nowShowingKeywords = ['now', 'showing', 'playing', 'current', 'today', 'available', 'watch'];
    const comingSoonKeywords = ['coming', 'soon', 'upcoming', 'future', 'next', 'later'];
    const movieKeywords = ['movie', 'movies', 'film', 'films'];
    
    const hasMovieKeyword = tokens.some(t => movieKeywords.includes(t));
    const hasNowShowing = tokens.some(t => nowShowingKeywords.includes(t));
    const hasComingSoon = tokens.some(t => comingSoonKeywords.includes(t));
    
    if (hasMovieKeyword || hasNowShowing || hasComingSoon) {
      if (hasComingSoon) return 'coming-soon';
      if (hasNowShowing) return 'now-showing';
      return 'all-movies';
    }
    
    return null;
  }

  /**
   * Check if message is asking about cinemas
   * @param {string[]} tokens - Tokenized message
   * @returns {boolean}
   */
  detectCinemaQuery(tokens) {
    const cinemaKeywords = ['cinema', 'cinemas', 'theater', 'theatres', 'location', 'locations', 'where', 'branch', 'branches'];
    return tokens.some(t => cinemaKeywords.includes(t));
  }

  /**
   * Get movies from database
   * @param {string} type - Type of movies to fetch
   * @returns {Promise<string>} - Formatted movie list
   */
  async getMovies(type) {
    try {
      let movies;
      
      if (type === 'coming-soon') {
        movies = await Movie.find({ comingSoon: true }).limit(10);
        if (movies.length === 0) {
          return "We don't have any upcoming movies announced yet. Please check back later!";
        }
        
        let response = "🎬 **Coming Soon Movies:**\n\n";
        movies.forEach((movie, index) => {
          response += `${index + 1}. **${movie.title}** (${movie.year})\n`;
          response += `   Genre: ${movie.genre}\n`;
          response += `   Rating: ${movie.rating}/10\n`;
          if (movie.releaseDate) {
            response += `   Release: ${new Date(movie.releaseDate).toLocaleDateString()}\n`;
          }
          response += `\n`;
        });
        return response;
        
      } else if (type === 'now-showing') {
        movies = await Movie.find({ comingSoon: { $ne: true } }).limit(10);
        if (movies.length === 0) {
          return "We don't have any movies showing right now. Please check back later!";
        }
        
        let response = "🎥 **Now Showing:**\n\n";
        movies.forEach((movie, index) => {
          response += `${index + 1}. **${movie.title}** (${movie.year})\n`;
          response += `   Genre: ${movie.genre}\n`;
          response += `   Duration: ${movie.duration} mins\n`;
          response += `   Rating: ${movie.rating}/10\n\n`;
        });
        response += "Visit our website to book tickets!";
        return response;
        
      } else {
        movies = await Movie.find().limit(15);
        if (movies.length === 0) {
          return "We don't have any movies in our database yet.";
        }
        
        const nowShowing = movies.filter(m => !m.comingSoon);
        const comingSoon = movies.filter(m => m.comingSoon);
        
        let response = "";
        if (nowShowing.length > 0) {
          response += "🎥 **Now Showing:**\n";
          nowShowing.slice(0, 5).forEach((movie, index) => {
            response += `${index + 1}. ${movie.title} (${movie.genre})\n`;
          });
          response += "\n";
        }
        
        if (comingSoon.length > 0) {
          response += "🎬 **Coming Soon:**\n";
          comingSoon.slice(0, 5).forEach((movie, index) => {
            response += `${index + 1}. ${movie.title} (${movie.genre})\n`;
          });
        }
        
        return response || "No movies available at the moment.";
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      return "Sorry, I couldn't fetch the movie information right now. Please try again later.";
    }
  }

  /**
   * Get cinemas from database
   * @returns {Promise<string>} - Formatted cinema list
   */
  async getCinemas() {
    try {
      const cinemas = await Cinema.find({ isActive: true });
      
      if (cinemas.length === 0) {
        return "We don't have any cinema locations listed yet.";
      }
      
      let response = "🎭 **Our Cinema Locations:**\n\n";
      cinemas.forEach((cinema, index) => {
        response += `${index + 1}. **${cinema.name}**\n`;
        response += `   📍 ${cinema.location}, ${cinema.city}\n`;
        response += `   ⭐ Rating: ${cinema.rating}/5\n`;
        if (cinema.phone) {
          response += `   📞 ${cinema.phone}\n`;
        }
        response += `\n`;
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      return "Sorry, I couldn't fetch the cinema information right now. Please try again later.";
    }
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

      // Check for movie queries first
      const movieQueryType = this.detectMovieQuery(tokens);
      if (movieQueryType) {
        const reply = await this.getMovies(movieQueryType);
        return {
          reply,
          matchedFaqId: 'dynamic-movies'
        };
      }

      // Check for cinema queries
      if (this.detectCinemaQuery(tokens)) {
        const reply = await this.getCinemas();
        return {
          reply,
          matchedFaqId: 'dynamic-cinemas'
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
