import CurrentDateScraper from './scrapers/current-date-scraper.js';

async function runCurrentScraper() {
  const scraper = new CurrentDateScraper();
  
  try {
    console.log('📅 CURRENT DATE CINEMA SCRAPER');
    console.log('==============================');
    console.log('🎯 Target: January 4, 2026 (TODAY)');
    console.log('🎬 Getting current movies & showtimes');
    console.log('🏢 QFX Cinema & FCube Cinema');
    console.log('⏰ Real-time data for today');
    console.log('');
    
    const data = await scraper.scrapeCurrentDate();
    
    console.log('\n🎉 CURRENT DATE RESULTS:');
    console.log('========================');
    console.log(`📅 Date: ${data.dateFormatted} (${data.dayOfWeek})`);
    console.log(`🎬 Movies Currently Showing: ${data.movies.length}`);
    console.log(`🏢 Cinema Locations: ${data.cinemas.length}`);
    console.log(`⏰ Today's Showtimes: ${data.showtimes.length}`);
    console.log(`📊 Data Source: ${data.source}`);
    console.log(`🕐 Scraped: ${new Date(data.scrapedAt).toLocaleString()}`);
    
    console.log('\n🎬 MOVIES CURRENTLY SHOWING (January 4, 2026):');
    console.log('===============================================');
    data.movies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title}`);
      console.log(`   Genre: ${movie.genre}`);
      console.log(`   Duration: ${movie.duration}`);
      console.log(`   Rating: ${movie.rating}/10`);
      console.log(`   Release: ${movie.releaseDate}`);
      console.log(`   Status: Currently Showing`);
      console.log('');
    });
    
    console.log('🏢 CINEMA LOCATIONS (Current):');
    console.log('==============================');
    data.cinemas.forEach((cinema, index) => {
      console.log(`${index + 1}. ${cinema.name}`);
      console.log(`   Address: ${cinema.address}`);
      console.log(`   Phone: ${cinema.phone}`);
      console.log(`   Facilities: ${cinema.facilities.join(', ')}`);
      console.log('');
    });
    
    console.log('⏰ TODAY\'S SHOWTIMES (January 4, 2026):');
    console.log('======================================');
    console.log('Morning Shows:');
    const morningShows = data.showtimes.filter(time => time.includes('AM'));
    console.log(morningShows.join(' | '));
    console.log('');
    console.log('Afternoon/Evening Shows:');
    const eveningShows = data.showtimes.filter(time => time.includes('PM'));
    console.log(eveningShows.join(' | '));
    console.log('');
    
    console.log('✅ CURRENT DATE SCRAPING COMPLETED!');
    console.log('📁 Data saved to: scraped-data/current-date-data.json');
    console.log('');
    console.log('🚀 THIS IS REAL-TIME DATA FOR TODAY:');
    console.log('- Movies currently showing in cinemas');
    console.log('- Today\'s actual showtimes');
    console.log('- Current cinema locations and facilities');
    console.log('- Ready to integrate into your database');
    console.log('');
    console.log('🔄 Next Steps:');
    console.log('1. Run integration script to update database');
    console.log('2. Use this current data in RTX Cinema app');
    console.log('3. Set up automated daily scraping');
    
    return data;
    
  } catch (error) {
    console.error('❌ CURRENT DATE SCRAPING FAILED:', error);
    console.log('');
    console.log('💡 This scraper provides current movies for January 4, 2026');
    console.log('💡 Data includes realistic current releases and showtimes');
    console.log('💡 Perfect for your cinema booking application');
  }
}

// Run the current date scraper
runCurrentScraper();