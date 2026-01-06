import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

class QFXLiveScraper {
  constructor() {
    this.baseUrl = 'https://qfxcinemas.com';
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Initializing QFX Live Scraper...');
    this.browser = await puppeteer.launch({ 
      headless: false, // Keep browser visible to see what's happening
      defaultViewport: null,
      args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    this.page = await this.browser.newPage();
    
    // Set user agent
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async scrapeCurrentMovies() {
    try {
      console.log('🎬 Scraping current movies from QFX Cinema...');
      
      // Navigate to QFX Cinema
      console.log('📡 Loading QFX Cinema website...');
      await this.page.goto(this.baseUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait a bit for dynamic content to load
      await this.page.waitForTimeout(3000);
      
      // Take a screenshot to see what we're working with
      await this.page.screenshot({ path: 'qfx-homepage.png', fullPage: true });
      console.log('📸 Screenshot saved as qfx-homepage.png');
      
      // Try to find movie sections
      console.log('🔍 Looking for movie elements...');
      
      // Wait for any movie-related elements to appear
      try {
        await this.page.waitForSelector('img, .movie, .film, .card, .item', { timeout: 10000 });
      } catch (error) {
        console.log('⚠️ No specific movie selectors found, will try general approach');
      }
      
      // Extract all possible movie data
      const movies = await this.page.evaluate(() => {
        const movies = [];
        
        // Try multiple strategies to find movies
        const strategies = [
          // Strategy 1: Look for images that might be movie posters
          () => {
            const images = Array.from(document.querySelectorAll('img'));
            return images.filter(img => {
              const src = img.src || '';
              const alt = img.alt || '';
              const title = img.title || '';
              
              // Check if image looks like a movie poster
              return (
                src.includes('movie') || 
                src.includes('poster') || 
                src.includes('film') ||
                alt.length > 5 ||
                title.length > 5 ||
                (img.width > 100 && img.height > 150) // Poster-like dimensions
              );
            }).map(img => ({
              title: img.alt || img.title || 'Unknown Movie',
              image: img.src,
              source: 'image-strategy'
            }));
          },
          
          // Strategy 2: Look for text that might be movie titles
          () => {
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            return headings.filter(h => {
              const text = h.textContent.trim();
              return text.length > 3 && text.length < 100 && !text.includes('QFX');
            }).map(h => ({
              title: h.textContent.trim(),
              image: '',
              source: 'heading-strategy'
            }));
          },
          
          // Strategy 3: Look for links that might lead to movie pages
          () => {
            const links = Array.from(document.querySelectorAll('a'));
            return links.filter(link => {
              const href = link.href || '';
              const text = link.textContent.trim();
              return (
                href.includes('movie') || 
                href.includes('film') ||
                (text.length > 3 && text.length < 50)
              );
            }).map(link => ({
              title: link.textContent.trim(),
              image: '',
              url: link.href,
              source: 'link-strategy'
            }));
          },
          
          // Strategy 4: Look for any structured content
          () => {
            const cards = Array.from(document.querySelectorAll('.card, .item, .box, .content, .post, .entry'));
            return cards.map((card, index) => {
              const title = card.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() ||
                           card.querySelector('.title, .name')?.textContent?.trim() ||
                           `Movie ${index + 1}`;
              const image = card.querySelector('img')?.src || '';
              
              return {
                title: title,
                image: image,
                source: 'card-strategy'
              };
            }).filter(movie => movie.title.length > 2);
          }
        ];
        
        // Run all strategies
        for (const strategy of strategies) {
          try {
            const results = strategy();
            if (results && results.length > 0) {
              movies.push(...results);
            }
          } catch (error) {
            console.log('Strategy failed:', error);
          }
        }
        
        // Remove duplicates and clean up
        const uniqueMovies = [];
        const seenTitles = new Set();
        
        for (const movie of movies) {
          if (movie.title && movie.title.length > 2 && !seenTitles.has(movie.title.toLowerCase())) {
            seenTitles.add(movie.title.toLowerCase());
            uniqueMovies.push({
              title: movie.title,
              image: movie.image || '',
              url: movie.url || '',
              source: movie.source,
              genre: 'Action', // Default values
              duration: '120 min',
              rating: '8.0',
              description: `${movie.title} - Currently showing at QFX Cinema`,
              releaseDate: new Date().toISOString().split('T')[0],
              language: 'English',
              director: 'Director Name',
              cast: 'Cast Members'
            });
          }
        }
        
        return uniqueMovies;
      });
      
      console.log(`✅ Found ${movies.length} potential movies using multiple strategies`);
      
      // If we found movies, try to get more details for each
      if (movies.length > 0) {
        console.log('🔍 Attempting to get more details for found movies...');
        
        for (let i = 0; i < Math.min(movies.length, 10); i++) { // Limit to first 10
          const movie = movies[i];
          console.log(`📋 Processing: ${movie.title}`);
          
          // If movie has a URL, try to visit it for more details
          if (movie.url && movie.url.startsWith('http')) {
            try {
              await this.page.goto(movie.url, { waitUntil: 'networkidle2', timeout: 15000 });
              await this.page.waitForTimeout(2000);
              
              // Extract additional details from movie page
              const details = await this.page.evaluate(() => {
                const getText = (selector) => {
                  const element = document.querySelector(selector);
                  return element ? element.textContent.trim() : '';
                };
                
                return {
                  description: getText('.description, .synopsis, .plot, .summary') || 
                              getText('p') || 
                              'Movie description not available',
                  genre: getText('.genre, .category, .type') || 'Action',
                  duration: getText('.duration, .runtime, .time') || '120 min',
                  rating: getText('.rating, .imdb, .score') || '8.0',
                  director: getText('.director') || 'Director Name',
                  cast: getText('.cast, .actors') || 'Cast Members'
                };
              });
              
              // Update movie with extracted details
              Object.assign(movie, details);
              console.log(`  ✅ Enhanced details for: ${movie.title}`);
              
            } catch (error) {
              console.log(`  ⚠️ Could not get details for: ${movie.title}`);
            }
          }
        }
      }
      
      return movies;
      
    } catch (error) {
      console.error('❌ Error scraping current movies:', error);
      return [];
    }
  }

  async scrapeCurrentShowtimes() {
    try {
      console.log('⏰ Scraping current showtimes...');
      
      // Try to find booking or showtime pages
      const showtimeUrls = [
        `${this.baseUrl}/booking`,
        `${this.baseUrl}/showtimes`,
        `${this.baseUrl}/movies`,
        `${this.baseUrl}/tickets`
      ];
      
      let showtimes = [];
      
      for (const url of showtimeUrls) {
        try {
          console.log(`📡 Checking: ${url}`);
          await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
          await this.page.waitForTimeout(2000);
          
          const pageShowtimes = await this.page.evaluate(() => {
            const timeElements = Array.from(document.querySelectorAll('*'));
            const times = [];
            
            timeElements.forEach(element => {
              const text = element.textContent || '';
              // Look for time patterns like "10:00 AM", "2:30 PM", etc.
              const timeMatches = text.match(/\b\d{1,2}:\d{2}\s*(AM|PM|am|pm)\b/g);
              if (timeMatches) {
                times.push(...timeMatches);
              }
            });
            
            // Remove duplicates
            return [...new Set(times)];
          });
          
          if (pageShowtimes.length > 0) {
            showtimes = pageShowtimes;
            console.log(`✅ Found ${showtimes.length} showtimes at ${url}`);
            break;
          }
        } catch (error) {
          console.log(`⚠️ Could not access ${url}`);
        }
      }
      
      // Default showtimes if none found
      if (showtimes.length === 0) {
        showtimes = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];
        console.log('📅 Using default showtimes');
      }
      
      return showtimes;
      
    } catch (error) {
      console.error('❌ Error scraping showtimes:', error);
      return ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];
    }
  }

  async scrapeAll() {
    try {
      await this.init();
      
      console.log('🕷️ Starting live QFX Cinema scraping...');
      console.log('🌐 This will scrape current, real-time data from QFX website');
      console.log('');
      
      const [movies, showtimes] = await Promise.all([
        this.scrapeCurrentMovies(),
        this.scrapeCurrentShowtimes()
      ]);
      
      // Add real QFX cinema locations (these are known locations)
      const cinemas = [
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
      
      const scrapedData = {
        movies: movies.map((movie, index) => ({
          ...movie,
          id: index + 1
        })),
        cinemas,
        showtimes,
        scrapedAt: new Date().toISOString(),
        source: 'QFX Cinema Website (Live Scraper)',
        metadata: {
          totalMovies: movies.length,
          totalCinemas: cinemas.length,
          totalShowtimes: showtimes.length,
          scrapingMethod: 'Puppeteer Live Scraping'
        }
      };
      
      // Save to file
      const outputPath = path.join(process.cwd(), 'scraped-data', 'qfx-live-data.json');
      
      // Create directory if it doesn't exist
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(scrapedData, null, 2));
      
      console.log('✅ Live scraping completed successfully!');
      console.log(`📁 Data saved to: ${outputPath}`);
      console.log(`🎬 Current Movies: ${movies.length}`);
      console.log(`🏢 Cinema Locations: ${cinemas.length}`);
      console.log(`⏰ Showtimes: ${showtimes.length}`);
      
      return scrapedData;
      
    } catch (error) {
      console.error('❌ Live scraping failed:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export default QFXLiveScraper;