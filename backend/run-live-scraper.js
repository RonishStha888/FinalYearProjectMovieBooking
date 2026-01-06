import LiveCinemaScraper from './scrapers/live-cinema-scraper.js';

async function runLiveScraper() {
  const scraper = new LiveCinemaScraper();
  
  try {
    console.log('🔴 LIVE CINEMA DATA SCRAPER');
    console.log('===========================');
    console.log('🎯 Target: QFX Cinema & FCube Cinema');
    console.log('📅 Date: ' + new Date().toLocaleDateString());
    console.log('⏰ Time: ' + new Date().toLocaleTimeString());
    console.log('🌐 Fetching real-time data...');
    console.log('');
    
    const data = await scraper.scrapeLiveData();
    
    console.log('\n📊 LIVE SCRAPING RESULTS:');
    console.log('=========================');
    console.log(`🎬 Movies Found: ${data.movies.length}`);
    console.log(`   - QFX Movies: ${data.metadata.qfxMovies}`);
    console.log(`   - FCube Movies: ${data.metadata.fcubeMovies}`);
    console.log(`🏢 Cinema Locations: ${data.cinemas.length}`);
    console.log(`⏰ Showtime Slots: ${data.showtimes.length}`);
    console.log(`📅 Scraped At: ${new Date(data.scrapedAt).toLocaleString()}`);
    
    if (data.movies.length > 0) {
      console.log('\n🎬 CURRENT MOVIES:');
      console.log('==================');
      data.movies.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title}`);
        console.log(`   Genre: ${movie.genre}`);
        console.log(`   Duration: ${movie.duration}`);
        console.log(`   Rating: ${movie.rating}/10`);
        console.log(`   Source: ${movie.source}`);
        console.log('');
      });
    }
    
    if (data.cinemas.length > 0) {
      console.log('🏢 CINEMA LOCATIONS:');
      console.log('====================');
      data.cinemas.forEach((cinema, index) => {
        console.log(`${index + 1}. ${cinema.name}`);
        console.log(`   Address: ${cinema.address}`);
        console.log(`   Facilities: ${cinema.facilities.join(', ')}`);
        console.log(`   Source: ${cinema.source}`);
        console.log('');
      });
    }
    
    if (data.showtimes.length > 0) {
      console.log('⏰ AVAILABLE SHOWTIMES:');
      console.log('======================');
      console.log(data.showtimes.join(' | '));
      console.log('');
    }
    
    console.log('✅ LIVE SCRAPING COMPLETED SUCCESSFULLY!');
    console.log('📁 Data saved to: scraped-data/live-cinema-data.json');
    console.log('');
    console.log('🔄 Next Steps:');
    console.log('- Run integration script to update database');
    console.log('- Use this fresh data in your cinema application');
    console.log('- Set up automated scraping for regular updates');
    
    return data;
    
  } catch (error) {
    console.error('❌ LIVE SCRAPING FAILED:', error);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('- Check internet connection');
    console.log('- Cinema websites might be temporarily down');
    console.log('- Website structure may have changed');
    console.log('- Try running the scraper again in a few minutes');
  }
}

// Run the live scraper
runLiveScraper();