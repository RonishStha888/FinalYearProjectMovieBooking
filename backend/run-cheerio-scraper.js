import QFXCheerioScraper from './scrapers/qfx-cheerio-scraper.js';

async function runCheerioScraper() {
  const scraper = new QFXCheerioScraper();
  
  try {
    console.log('🚀 Starting QFX Cinema data scraping with Cheerio...');
    console.log('📡 This scraper will extract data from QFX Cinema website');
    console.log('⚡ Using lightweight HTTP requests (no browser required)');
    console.log('');
    
    const data = await scraper.scrapeAll();
    
    console.log('\n📊 Scraping Results Summary:');
    console.log('============================');
    console.log(`🎬 Movies extracted: ${data.movies.length}`);
    console.log(`🏢 Cinema locations: ${data.cinemas.length}`);
    console.log(`⏰ Showtime slots: ${data.showtimes.length}`);
    console.log(`📅 Scraped at: ${new Date(data.scrapedAt).toLocaleString()}`);
    
    if (data.movies.length > 0) {
      console.log('\n🎬 Sample Movies Found:');
      console.log('----------------------');
      data.movies.slice(0, 5).forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title}`);
        console.log(`   Genre: ${movie.genre}`);
        console.log(`   Duration: ${movie.duration}`);
        console.log(`   Rating: ${movie.rating}`);
        console.log('');
      });
    }
    
    if (data.cinemas.length > 0) {
      console.log('🏢 Cinema Locations Found:');
      console.log('--------------------------');
      data.cinemas.forEach((cinema, index) => {
        console.log(`${index + 1}. ${cinema.name}`);
        console.log(`   Address: ${cinema.address}`);
        console.log(`   Facilities: ${cinema.facilities.join(', ')}`);
        console.log('');
      });
    }
    
    if (data.showtimes.length > 0) {
      console.log('⏰ Showtime Slots Found:');
      console.log('-----------------------');
      console.log(data.showtimes.join(', '));
      console.log('');
    }
    
    console.log('✅ Scraping completed successfully!');
    console.log('📁 Data saved to: scraped-data/qfx-cheerio-data.json');
    console.log('');
    console.log('🔄 You can now use this data to update your cinema database!');
    
    return data;
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    console.log('');
    console.log('💡 Troubleshooting tips:');
    console.log('- Check your internet connection');
    console.log('- QFX website might be temporarily unavailable');
    console.log('- The website structure might have changed');
    console.log('- Default data will be used as fallback');
  }
}

// Run the scraper
runCheerioScraper();