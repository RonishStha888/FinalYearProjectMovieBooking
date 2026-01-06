import QFXScraper from './scrapers/qfx-scraper.js';

async function runScraper() {
  const scraper = new QFXScraper();
  
  try {
    console.log('🚀 Starting QFX Cinema data scraping...');
    const data = await scraper.scrapeAll();
    
    console.log('\n📊 Scraping Results:');
    console.log('===================');
    console.log(`🎬 Movies found: ${data.movies.length}`);
    console.log(`🏢 Cinemas found: ${data.cinemas.length}`);
    console.log(`⏰ Showtimes found: ${data.showtimes.length}`);
    
    if (data.movies.length > 0) {
      console.log('\n🎬 Sample Movies:');
      data.movies.slice(0, 3).forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title} (${movie.genre})`);
      });
    }
    
    if (data.cinemas.length > 0) {
      console.log('\n🏢 Cinema Locations:');
      data.cinemas.forEach((cinema, index) => {
        console.log(`${index + 1}. ${cinema.name} - ${cinema.address}`);
      });
    }
    
    console.log('\n✅ Scraping completed successfully!');
    console.log('📁 Data saved to: scraped-data/qfx-data.json');
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
  }
}

// Run the scraper
runScraper();