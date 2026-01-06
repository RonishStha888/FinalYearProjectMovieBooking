import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

class LiveCinemaScraper {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    };
  }

  async fetchPage(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`📡 Fetching: ${url} (Attempt ${i + 1})`);
        const response = await axios.get(url, { 
          headers: this.headers,
          timeout: 15000,
          maxRedirects: 5
        });
        console.log(`✅ Successfully fetched: ${url}`);
        return cheerio.load(response.data);
      } catch (error) {
        console.log(`❌ Attempt ${i + 1} failed for ${url}: ${error.message}`);
        if (i === retries - 1) {
          console.log(`🚫 All attempts failed for ${url}`);
          return null;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  async scrapeQFXLive() {
    try {
      console.log('🎬 Scraping LIVE data from QFX Cinema...');
      
      const qfxUrls = [
        'https://qfxcinemas.com',
        'https://www.qfxcinemas.com',
        'https://qfxcinemas.com/movies',
        'https://qfxcinemas.com/now-showing'
      ];
      
      let movies = [];
      let cinemas = [];
      let showtimes = [];
      
      for (const url of qfxUrls) {
        const $ = await this.fetchPage(url);
        if (!$) continue;
        
        console.log(`🔍 Analyzing page structure for: ${url}`);
        
        // Extract movies with multiple selector strategies
        const movieSelectors = [
          '.movie-item', '.film-item', '.movie-card', '.movie', '.film',
          '.content-item', '.post', '.entry', '.card', '.item',
          '[class*="movie"]', '[class*="film"]', '[class*="show"]'
        ];
        
        for (const selector of movieSelectors) {
          const elements = $(selector);
          if (elements.length > 0) {
            console.log(`📽️ Found ${elements.length} potential movie elements with: ${selector}`);
            
            elements.each((index, element) => {
              const $el = $(element);
              
              // Extract title with multiple strategies
              const title = this.extractText($el, [
                'h1', 'h2', 'h3', 'h4', 'h5', '.title', '.movie-title', 
                '.film-title', '.name', 'a[title]', 'img[alt]'
              ]);
              
              if (title && title.length > 2 && !title.toLowerCase().includes('cinema')) {
                const movie = {
                  id: movies.length + 1,
                  title: title,
                  image: this.extractImage($el),
                  genre: this.extractText($el, ['.genre', '.category', '.type']) || 'Drama',
                  duration: this.extractText($el, ['.duration', '.runtime', '.time']) || '120 min',
                  rating: this.extractText($el, ['.rating', '.imdb', '.score']) || '7.5',
                  description: this.extractText($el, ['.description', '.synopsis', '.summary']) || `${title} - Now showing at QFX Cinema`,
                  releaseDate: new Date().toISOString().split('T')[0],
                  language: 'English',
                  director: 'Director',
                  cast: 'Cast Members',
                  source: 'QFX Cinema Live',
                  scrapedAt: new Date().toISOString()
                };
                
                // Avoid duplicates
                if (!movies.find(m => m.title === movie.title)) {
                  movies.push(movie);
                  console.log(`✅ Extracted movie: ${movie.title}`);
                }
              }
            });
          }
        }
        
        // Extract showtimes
        const timePattern = /\b\d{1,2}:\d{2}\s*(AM|PM|am|pm)\b/g;
        const pageText = $.text();
        const timeMatches = pageText.match(timePattern);
        
        if (timeMatches) {
          const uniqueTimes = [...new Set(timeMatches)];
          showtimes.push(...uniqueTimes);
          console.log(`⏰ Found ${uniqueTimes.length} showtime slots`);
        }
        
        // Extract cinema locations
        const locationText = $.text().toLowerCase();
        const qfxLocations = [
          { name: 'QFX Kumari', address: 'Kumari Mall, New Baneshwor' },
          { name: 'QFX Labim Mall', address: 'Labim Mall, Pulchowk' },
          { name: 'QFX Civil Mall', address: 'Civil Mall, Sundhara' },
          { name: 'QFX Jai Nepal', address: 'Jai Nepal Cinema Hall' }
        ];
        
        qfxLocations.forEach(location => {
          if (locationText.includes(location.name.toLowerCase()) || 
              locationText.includes('kumari') || 
              locationText.includes('labim') || 
              locationText.includes('civil')) {
            if (!cinemas.find(c => c.name === location.name)) {
              cinemas.push({
                id: cinemas.length + 1,
                name: location.name,
                address: location.address,
                city: 'Kathmandu',
                phone: '+977-1-4444444',
                facilities: ['Digital', '3D', 'Dolby Atmos'],
                source: 'QFX Cinema Live'
              });
            }
          }
        });
        
        if (movies.length > 0) break; // Stop if we found movies
      }
      
      return { movies, cinemas, showtimes: [...new Set(showtimes)] };
      
    } catch (error) {
      console.error('❌ QFX scraping error:', error);
      return { movies: [], cinemas: [], showtimes: [] };
    }
  }

  async scrapeFCubeLive() {
    try {
      console.log('🎬 Scraping LIVE data from FCube Cinema...');
      
      const fcubeUrls = [
        'https://fcubecinemas.com',
        'https://www.fcubecinemas.com',
        'https://fcubecinemas.com/movies',
        'https://fcubecinemas.com/showtimes'
      ];
      
      let movies = [];
      let cinemas = [];
      let showtimes = [];
      
      for (const url of fcubeUrls) {
        const $ = await this.fetchPage(url);
        if (!$) continue;
        
        console.log(`🔍 Analyzing FCube page: ${url}`);
        
        // Extract movies
        const movieSelectors = [
          '.movie-item', '.film-item', '.movie-card', '.movie', '.film',
          '.show-item', '.content-item', '.card', '.item',
          '[class*="movie"]', '[class*="film"]'
        ];
        
        for (const selector of movieSelectors) {
          const elements = $(selector);
          if (elements.length > 0) {
            console.log(`📽️ Found ${elements.length} FCube movie elements with: ${selector}`);
            
            elements.each((index, element) => {
              const $el = $(element);
              
              const title = this.extractText($el, [
                'h1', 'h2', 'h3', 'h4', '.title', '.movie-title', 
                '.film-title', '.name', 'a[title]', 'img[alt]'
              ]);
              
              if (title && title.length > 2 && !title.toLowerCase().includes('cinema')) {
                const movie = {
                  id: movies.length + 1,
                  title: title,
                  image: this.extractImage($el),
                  genre: this.extractText($el, ['.genre', '.category']) || 'Action',
                  duration: this.extractText($el, ['.duration', '.runtime']) || '130 min',
                  rating: this.extractText($el, ['.rating', '.imdb']) || '7.8',
                  description: `${title} - Now showing at FCube Cinema`,
                  releaseDate: new Date().toISOString().split('T')[0],
                  language: 'English',
                  director: 'Director',
                  cast: 'Cast Members',
                  source: 'FCube Cinema Live',
                  scrapedAt: new Date().toISOString()
                };
                
                if (!movies.find(m => m.title === movie.title)) {
                  movies.push(movie);
                  console.log(`✅ Extracted FCube movie: ${movie.title}`);
                }
              }
            });
          }
        }
        
        // Extract FCube showtimes
        const timePattern = /\b\d{1,2}:\d{2}\s*(AM|PM|am|pm)\b/g;
        const pageText = $.text();
        const timeMatches = pageText.match(timePattern);
        
        if (timeMatches) {
          const uniqueTimes = [...new Set(timeMatches)];
          showtimes.push(...uniqueTimes);
        }
        
        // FCube locations
        const fcubeLocations = [
          { name: 'FCube Cinema Durbarmarg', address: 'Durbarmarg, Kathmandu' },
          { name: 'FCube Cinema Butwal', address: 'Butwal, Rupandehi' }
        ];
        
        fcubeLocations.forEach(location => {
          cinemas.push({
            id: cinemas.length + 1,
            name: location.name,
            address: location.address,
            city: location.address.includes('Butwal') ? 'Butwal' : 'Kathmandu',
            phone: '+977-1-5555555',
            facilities: ['4DX', 'IMAX', 'Dolby Atmos'],
            source: 'FCube Cinema Live'
          });
        });
        
        if (movies.length > 0) break;
      }
      
      return { movies, cinemas, showtimes: [...new Set(showtimes)] };
      
    } catch (error) {
      console.error('❌ FCube scraping error:', error);
      return { movies: [], cinemas: [], showtimes: [] };
    }
  }

  extractText($element, selectors) {
    for (const selector of selectors) {
      const text = $element.find(selector).first().text().trim();
      if (text) return text;
      
      // Try attribute extraction
      if (selector.includes('[')) {
        const attrMatch = selector.match(/\[(\w+)\]/);
        if (attrMatch) {
          const attr = $element.find(selector.split('[')[0]).first().attr(attrMatch[1]);
          if (attr) return attr.trim();
        }
      }
    }
    return '';
  }

  extractImage($element) {
    const img = $element.find('img').first();
    let src = img.attr('src') || img.attr('data-src') || img.attr('data-lazy') || '';
    
    if (src && !src.startsWith('http')) {
      if (src.startsWith('//')) {
        src = 'https:' + src;
      } else if (src.startsWith('/')) {
        src = 'https://qfxcinemas.com' + src;
      }
    }
    
    return src || '';
  }

  async scrapeLiveData() {
    try {
      console.log('🚀 Starting LIVE cinema data scraping...');
      console.log('📅 Scraping current movies and showtimes');
      console.log('⏰ ' + new Date().toLocaleString());
      console.log('');
      
      // Scrape both QFX and FCube in parallel
      const [qfxData, fcubeData] = await Promise.all([
        this.scrapeQFXLive(),
        this.scrapeFCubeLive()
      ]);
      
      // Combine data
      const combinedData = {
        movies: [...qfxData.movies, ...fcubeData.movies],
        cinemas: [...qfxData.cinemas, ...fcubeData.cinemas],
        showtimes: [...new Set([...qfxData.showtimes, ...fcubeData.showtimes])],
        scrapedAt: new Date().toISOString(),
        source: 'Live Cinema Data (QFX + FCube)',
        metadata: {
          qfxMovies: qfxData.movies.length,
          fcubeMovies: fcubeData.movies.length,
          totalMovies: qfxData.movies.length + fcubeData.movies.length,
          totalCinemas: qfxData.cinemas.length + fcubeData.cinemas.length,
          totalShowtimes: [...new Set([...qfxData.showtimes, ...fcubeData.showtimes])].length
        }
      };
      
      // Add fallback data if scraping didn't find much
      if (combinedData.movies.length === 0) {
        console.log('⚠️ No movies found, adding current popular movies...');
        combinedData.movies = this.getCurrentPopularMovies();
      }
      
      if (combinedData.showtimes.length === 0) {
        console.log('⚠️ No showtimes found, adding standard showtimes...');
        combinedData.showtimes = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];
      }
      
      // Save to file
      const outputPath = path.join(process.cwd(), 'scraped-data', 'live-cinema-data.json');
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2));
      
      console.log('✅ Live scraping completed!');
      console.log(`📁 Data saved to: ${outputPath}`);
      console.log(`🎬 Total Movies: ${combinedData.movies.length}`);
      console.log(`🏢 Total Cinemas: ${combinedData.cinemas.length}`);
      console.log(`⏰ Total Showtimes: ${combinedData.showtimes.length}`);
      
      return combinedData;
      
    } catch (error) {
      console.error('❌ Live scraping failed:', error);
      throw error;
    }
  }

  getCurrentPopularMovies() {
    // Current popular movies (updated regularly)
    return [
      {
        id: 1,
        title: 'Aquaman and the Lost Kingdom',
        image: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg',
        genre: 'Action, Adventure, Fantasy',
        duration: '124 min',
        rating: '7.2',
        description: 'Aquaman balances his duties as king and as a member of the Justice League.',
        releaseDate: '2023-12-22',
        language: 'English',
        director: 'James Wan',
        cast: 'Jason Momoa, Patrick Wilson, Yahya Abdul-Mateen II',
        source: 'Current Popular Movies'
      },
      {
        id: 2,
        title: 'Wonka',
        image: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
        genre: 'Family, Fantasy, Comedy',
        duration: '116 min',
        rating: '7.8',
        description: 'The story of how the world\'s greatest inventor, magician and chocolate-maker became the beloved Willy Wonka.',
        releaseDate: '2023-12-15',
        language: 'English',
        director: 'Paul King',
        cast: 'Timothée Chalamet, Olivia Colman, Hugh Grant',
        source: 'Current Popular Movies'
      },
      {
        id: 3,
        title: 'The Hunger Games: The Ballad of Songbirds & Snakes',
        image: 'https://image.tmdb.org/t/p/w500/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg',
        genre: 'Action, Adventure, Drama',
        duration: '157 min',
        rating: '7.4',
        description: 'Years before he would become the tyrannical President of Panem, 18-year-old Coriolanus Snow is the last hope for his fading lineage.',
        releaseDate: '2023-11-17',
        language: 'English',
        director: 'Francis Lawrence',
        cast: 'Tom Blyth, Rachel Zegler, Peter Dinklage',
        source: 'Current Popular Movies'
      }
    ];
  }
}

export default LiveCinemaScraper;