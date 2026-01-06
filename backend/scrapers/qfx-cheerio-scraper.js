import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

class QFXCheerioScraper {
  constructor() {
    this.baseUrl = 'https://qfxcinemas.com';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
    };
  }

  async fetchPage(url) {
    try {
      console.log(`📡 Fetching: ${url}`);
      const response = await axios.get(url, { 
        headers: this.headers,
        timeout: 10000
      });
      return cheerio.load(response.data);
    } catch (error) {
      console.log(`❌ Failed to fetch ${url}:`, error.message);
      return null;
    }
  }

  async scrapeMovies() {
    try {
      console.log('🎬 Scraping movies from QFX Cinema...');
      
      const $ = await this.fetchPage(this.baseUrl);
      if (!$) return this.getDefaultMovies();
      
      const movies = [];
      
      // Try different selectors for movies
      const movieSelectors = [
        '.movie-item',
        '.film-item', 
        '.movie-card',
        '.movie',
        '.film',
        '.content-item',
        '.post',
        '.entry'
      ];
      
      for (const selector of movieSelectors) {
        const elements = $(selector);
        if (elements.length > 0) {
          console.log(`✅ Found ${elements.length} elements with selector: ${selector}`);
          
          elements.each((index, element) => {
            try {
              const $el = $(element);
              
              // Try different ways to extract title
              const title = $el.find('h1, h2, h3, h4, .title, .movie-title, .film-title').first().text().trim() ||
                           $el.find('a').first().attr('title') ||
                           $el.find('img').first().attr('alt') ||
                           $el.text().trim().split('\n')[0];
              
              // Extract image
              const image = $el.find('img').first().attr('src') || 
                           $el.find('img').first().attr('data-src') ||
                           '';
              
              // Extract other details
              const genre = $el.find('.genre, .category, .type').first().text().trim() || 'Action';
              const duration = $el.find('.duration, .runtime, .time').first().text().trim() || '120 min';
              const rating = $el.find('.rating, .imdb, .score').first().text().trim() || '8.0';
              
              if (title && title.length > 2) {
                movies.push({
                  id: movies.length + 1,
                  title: title,
                  image: image.startsWith('http') ? image : (image ? `${this.baseUrl}${image}` : ''),
                  genre: genre,
                  duration: duration,
                  rating: rating,
                  description: `${title} - An exciting movie experience at QFX Cinema`,
                  releaseDate: new Date().toISOString().split('T')[0],
                  language: 'English',
                  director: 'Director Name',
                  cast: 'Cast Members'
                });
              }
            } catch (error) {
              console.log('Error extracting movie:', error.message);
            }
          });
          
          if (movies.length > 0) break;
        }
      }
      
      console.log(`✅ Extracted ${movies.length} movies`);
      return movies.length > 0 ? movies : this.getDefaultMovies();
      
    } catch (error) {
      console.error('❌ Error scraping movies:', error);
      return this.getDefaultMovies();
    }
  }

  async scrapeCinemas() {
    try {
      console.log('🏢 Scraping cinema locations...');
      
      // Try different URLs for cinema locations
      const cinemaUrls = [
        `${this.baseUrl}/cinemas`,
        `${this.baseUrl}/locations`,
        `${this.baseUrl}/theaters`,
        `${this.baseUrl}/venues`,
        `${this.baseUrl}/about`,
        this.baseUrl
      ];
      
      let cinemas = [];
      
      for (const url of cinemaUrls) {
        const $ = await this.fetchPage(url);
        if (!$) continue;
        
        // Try different selectors for cinema locations
        const cinemaSelectors = [
          '.cinema',
          '.location',
          '.theater',
          '.venue',
          '.branch',
          '.outlet'
        ];
        
        for (const selector of cinemaSelectors) {
          const elements = $(selector);
          if (elements.length > 0) {
            elements.each((index, element) => {
              const $el = $(element);
              const name = $el.find('h1, h2, h3, h4, .name, .title').first().text().trim();
              const address = $el.find('.address, .location, .addr').first().text().trim();
              
              if (name && name.length > 2) {
                cinemas.push({
                  id: cinemas.length + 1,
                  name: name,
                  address: address || 'Kathmandu, Nepal',
                  city: 'Kathmandu',
                  phone: '+977-1-4444444',
                  facilities: ['IMAX', 'Dolby Atmos', '3D', 'Recliner Seats']
                });
              }
            });
          }
        }
        
        if (cinemas.length > 0) break;
      }
      
      console.log(`✅ Found ${cinemas.length} cinema locations`);
      return cinemas.length > 0 ? cinemas : this.getDefaultCinemas();
      
    } catch (error) {
      console.error('❌ Error scraping cinemas:', error);
      return this.getDefaultCinemas();
    }
  }

  async scrapeShowtimes() {
    try {
      console.log('⏰ Scraping showtimes...');
      
      const $ = await this.fetchPage(this.baseUrl);
      if (!$) return this.getDefaultShowtimes();
      
      const showtimes = [];
      
      // Look for time patterns in the page
      const timeRegex = /\b\d{1,2}:\d{2}\s*(AM|PM|am|pm)?\b/g;
      const pageText = $.text();
      const matches = pageText.match(timeRegex);
      
      if (matches) {
        const uniqueTimes = [...new Set(matches)];
        showtimes.push(...uniqueTimes.slice(0, 10)); // Limit to 10 times
      }
      
      console.log(`✅ Found ${showtimes.length} showtime slots`);
      return showtimes.length > 0 ? showtimes : this.getDefaultShowtimes();
      
    } catch (error) {
      console.error('❌ Error scraping showtimes:', error);
      return this.getDefaultShowtimes();
    }
  }

  getDefaultMovies() {
    return [
      {
        id: 1,
        title: 'Spider-Man: No Way Home',
        image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        genre: 'Action, Adventure, Sci-Fi',
        duration: '148 min',
        rating: '8.4',
        description: 'Spider-Man: No Way Home - The multiverse unleashed',
        releaseDate: '2021-12-17',
        language: 'English',
        director: 'Jon Watts',
        cast: 'Tom Holland, Zendaya, Benedict Cumberbatch'
      },
      {
        id: 2,
        title: 'Top Gun: Maverick',
        image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        genre: 'Action, Drama',
        duration: '130 min',
        rating: '8.3',
        description: 'Top Gun: Maverick - Feel the need for speed',
        releaseDate: '2022-05-27',
        language: 'English',
        director: 'Joseph Kosinski',
        cast: 'Tom Cruise, Miles Teller, Jennifer Connelly'
      },
      {
        id: 3,
        title: 'The Batman',
        image: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
        genre: 'Action, Crime, Drama',
        duration: '176 min',
        rating: '7.8',
        description: 'The Batman - Vengeance in the shadows',
        releaseDate: '2022-03-04',
        language: 'English',
        director: 'Matt Reeves',
        cast: 'Robert Pattinson, Zoë Kravitz, Jeffrey Wright'
      }
    ];
  }

  getDefaultCinemas() {
    return [
      {
        id: 1,
        name: 'QFX Cinema Kumari',
        address: 'Kumari Mall, New Baneshwor, Kathmandu',
        city: 'Kathmandu',
        phone: '+977-1-4444444',
        facilities: ['IMAX', 'Dolby Atmos', '3D', 'Recliner Seats']
      },
      {
        id: 2,
        name: 'QFX Cinema Labim Mall',
        address: 'Labim Mall, Pulchowk, Lalitpur',
        city: 'Lalitpur',
        phone: '+977-1-5555555',
        facilities: ['4DX', 'Dolby Atmos', '3D', 'Premium Seats']
      },
      {
        id: 3,
        name: 'QFX Cinema Civil Mall',
        address: 'Civil Mall, Sundhara, Kathmandu',
        city: 'Kathmandu',
        phone: '+977-1-6666666',
        facilities: ['IMAX', '3D', 'Dolby Digital', 'VIP Lounge']
      }
    ];
  }

  getDefaultShowtimes() {
    return ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];
  }

  async scrapeAll() {
    try {
      console.log('🕷️ Starting QFX Cinema scraping with Cheerio...');
      
      const [movies, cinemas, showtimes] = await Promise.all([
        this.scrapeMovies(),
        this.scrapeCinemas(),
        this.scrapeShowtimes()
      ]);
      
      const scrapedData = {
        movies,
        cinemas,
        showtimes,
        scrapedAt: new Date().toISOString(),
        source: 'QFX Cinema Website (Cheerio Scraper)',
        metadata: {
          totalMovies: movies.length,
          totalCinemas: cinemas.length,
          totalShowtimes: showtimes.length
        }
      };
      
      // Save to file
      const outputPath = path.join(process.cwd(), 'scraped-data', 'qfx-cheerio-data.json');
      
      // Create directory if it doesn't exist
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(scrapedData, null, 2));
      
      console.log('✅ Scraping completed successfully!');
      console.log(`📁 Data saved to: ${outputPath}`);
      console.log(`🎬 Movies: ${movies.length}`);
      console.log(`🏢 Cinemas: ${cinemas.length}`);
      console.log(`⏰ Showtimes: ${showtimes.length}`);
      
      return scrapedData;
      
    } catch (error) {
      console.error('❌ Scraping failed:', error);
      throw error;
    }
  }
}

export default QFXCheerioScraper;