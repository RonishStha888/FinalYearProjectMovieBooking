import EnhancedLiveScraper from './scrapers/enhanced-live-scraper.js';

async function runEnhancedScraper() {
  const scraper = new EnhancedLiveScraper();
  
  try {
    console.log('🔥 ENHANCED LIVE CINEMA SCRAPER');
    console.log('===============================');
    console.log('🎯 Target: Real-time QFX & FCube data');
    console.log('🧠 Method: Deep text analysis + pattern matching');
    console.log('📅 Date: ' + new Date().toLocaleDateString());
    console.log('⏰ Time: ' + new Date().toLocaleTimeString());
    console.log('');
    
    const data = await scraper.scrapeEnhancedLiveData();
    
    console.log('\n🎉 ENHANCED SCRAPING RESULTS:');
    console.log('=============================');
    console.log(`🎬 Movies Extracted: ${data.movies.length}`);
    console.log(`   - QFX Movies: ${data.metadata.qfxMovies}`);
    console.log(`   - FCube Movies: ${data.metadata.fcubeMovies}`);
    console.log(`🏢 Cinema Locations: ${data.cinemas.length}`);
    console.log(`⏰ Live Showtimes: ${data.showtimes.length}`);
    console.log(`🔬 Method: ${data.metadata.scrapingMethod}`);
    console.log(`📅 Scraped: ${new Date(data.scrapedAt).toLocaleString()}`);
    
    if (data.movies.length > 0) {
      console.log('\n🎬 LIVE MOVIES FOUND:');
      console.log('=====================');
      data.movies.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title}`);
        console.log(`   Source: ${movie.source}`);
        console.log(`   Genre: ${movie.genre}`);
        console.log(`   Rating: ${movie.rating}/10`);
        console.log('');
      });
    }
    
    if (data.cinemas.length > 0) {
      console.log('🏢 LIVE CINEMA LOCATIONS:');
      console.log('=========================');
      data.cinemas.forEach((cinema, index) => {
        console.log(`${index + 1}. ${cinema.name}`);
        console.log(`   Address: ${cinema.address}`);
        console.log(`   Facilities: ${cinema.facilities.join(', ')}`);
        console.log('');
      });
    }
    
    if (data.showtimes.length > 0) {
      console.log('⏰ LIVE SHOWTIMES EXTRACTED:');
      console.log('============================');
      const sortedTimes = data.showtimes.sort();
      console.log(sortedTimes.join(' | '));
      console.log('');
    }
    
    console.log('✅ ENHANCED LIVE SCRAPING COMPLETED!');
    console.log('📁 Data saved to: scraped-data/enhanced-live-data.json');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('- This is REAL-TIME data from cinema websites');
    console.log('- Run integration script to update your database');
    console.log('- Use this fresh data in your RTX Cinema app');
    console.log('- Set up automated scraping for regular updates');
    
    return data;
    
  } catch (error) {
    console.error('❌ ENHANCED SCRAPING FAILED:', error);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('- Check internet connection');
    console.log('- Cinema websites might be blocking requests');
    console.log('- Try running again with different timing');
    console.log('- Website structure may have changed');
  }
}

// Run the enhanced scraper
runEnhancedScraper();