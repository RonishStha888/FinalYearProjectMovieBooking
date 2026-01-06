import ManualDataExtractor from './manual-data-extractor.js';

async function extractCurrentData() {
  try {
    console.log('🎬 QFX Cinema Current Data Extractor');
    console.log('====================================');
    console.log('📝 This tool contains current movies showing at QFX Cinema');
    console.log('🔄 You can update the movie list in manual-data-extractor.js');
    console.log('');
    
    const extractor = new ManualDataExtractor();
    const dataset = extractor.saveDataset();
    
    console.log('\n📊 Current QFX Cinema Data:');
    console.log('===========================');
    
    if (dataset.movies.length > 0) {
      console.log('\n🎬 Current Movies at QFX Cinema:');
      console.log('-------------------------------');
      dataset.movies.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title}`);
        console.log(`   Genre: ${movie.genre}`);
        console.log(`   Duration: ${movie.duration}`);
        console.log(`   Rating: ${movie.rating}`);
        console.log(`   Release: ${movie.releaseDate}`);
        console.log('');
      });
    }
    
    if (dataset.cinemas.length > 0) {
      console.log('🏢 QFX Cinema Locations:');
      console.log('------------------------');
      dataset.cinemas.forEach((cinema, index) => {
        console.log(`${index + 1}. ${cinema.name}`);
        console.log(`   Address: ${cinema.address}`);
        console.log(`   Facilities: ${cinema.facilities.join(', ')}`);
        console.log('');
      });
    }
    
    if (dataset.showtimes.length > 0) {
      console.log('⏰ Showtime Slots:');
      console.log('------------------');
      console.log(dataset.showtimes.join(', '));
      console.log('');
    }
    
    console.log('✅ Current QFX data extraction completed!');
    console.log('📁 Data saved to: scraped-data/qfx-current-data.json');
    console.log('');
    console.log('💡 To update with newer movies:');
    console.log('1. Visit https://qfxcinemas.com');
    console.log('2. Check current movies');
    console.log('3. Update the movie list in manual-data-extractor.js');
    console.log('4. Run this script again');
    console.log('');
    console.log('🔄 You can now integrate this data into your database!');
    
    return dataset;
    
  } catch (error) {
    console.error('❌ Data extraction failed:', error);
  }
}

// Run the extractor
extractCurrentData();