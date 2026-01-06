import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Movie from './models/Movie.js';
import Cinema from './models/Cinema.js';
import Hall from './models/Hall.js';
import Showtime from './models/Showtime.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rtx_cinema');

async function integrateScrapedData() {
  try {
    console.log('🔄 Integrating scraped QFX data into database...');
    
    // Read scraped data
    const dataPath = path.join(process.cwd(), 'scraped-data', 'qfx-cheerio-data.json');
    const scrapedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`📊 Processing ${scrapedData.movies.length} movies, ${scrapedData.cinemas.length} cinemas`);
    
    // 1. Integrate Movies
    console.log('\n🎬 Integrating movies...');
    for (const movieData of scrapedData.movies) {
      try {
        // Check if movie already exists
        const existingMovie = await Movie.findOne({ title: movieData.title });
        
        if (existingMovie) {
          console.log(`⚠️  Movie already exists: ${movieData.title}`);
          // Update existing movie with new data
          await Movie.updateOne(
            { title: movieData.title },
            {
              $set: {
                image: movieData.image,
                genre: movieData.genre,
                duration: movieData.duration,
                rating: parseFloat(movieData.rating),
                description: movieData.description,
                language: movieData.language,
                director: movieData.director,
                cast: movieData.cast,
                updatedAt: new Date()
              }
            }
          );
          console.log(`✅ Updated: ${movieData.title}`);
        } else {
          // Create new movie
          const newMovie = new Movie({
            title: movieData.title,
            image: movieData.image,
            genre: movieData.genre,
            duration: movieData.duration,
            rating: parseFloat(movieData.rating),
            description: movieData.description,
            releaseDate: new Date(movieData.releaseDate),
            language: movieData.language,
            director: movieData.director,
            cast: movieData.cast
          });
          
          await newMovie.save();
          console.log(`✅ Added new movie: ${movieData.title}`);
        }
      } catch (error) {
        console.log(`❌ Error processing movie ${movieData.title}:`, error.message);
      }
    }
    
    // 2. Integrate Cinemas
    console.log('\n🏢 Integrating cinemas...');
    for (const cinemaData of scrapedData.cinemas) {
      try {
        // Check if cinema already exists
        const existingCinema = await Cinema.findOne({ name: cinemaData.name });
        
        if (existingCinema) {
          console.log(`⚠️  Cinema already exists: ${cinemaData.name}`);
          // Update existing cinema
          await Cinema.updateOne(
            { name: cinemaData.name },
            {
              $set: {
                address: cinemaData.address,
                city: cinemaData.city,
                phone: cinemaData.phone,
                facilities: cinemaData.facilities,
                updatedAt: new Date()
              }
            }
          );
          console.log(`✅ Updated: ${cinemaData.name}`);
        } else {
          // Create new cinema
          const newCinema = new Cinema({
            name: cinemaData.name,
            address: cinemaData.address,
            city: cinemaData.city,
            phone: cinemaData.phone,
            facilities: cinemaData.facilities
          });
          
          await newCinema.save();
          console.log(`✅ Added new cinema: ${cinemaData.name}`);
          
          // Create default halls for new cinema
          const hallTypes = [
            { name: 'Hall 1', type: 'IMAX', capacity: 200, seatLayout: 'premium' },
            { name: 'Hall 2', type: 'Standard', capacity: 150, seatLayout: 'standard' },
            { name: 'Hall 3', type: '4DX', capacity: 100, seatLayout: 'luxury' }
          ];
          
          for (const hallData of hallTypes) {
            const newHall = new Hall({
              name: hallData.name,
              cinema: newCinema._id,
              capacity: hallData.capacity,
              type: hallData.type,
              seatLayout: hallData.seatLayout
            });
            
            await newHall.save();
            console.log(`  ➕ Added hall: ${hallData.name} (${hallData.type})`);
          }
        }
      } catch (error) {
        console.log(`❌ Error processing cinema ${cinemaData.name}:`, error.message);
      }
    }
    
    // 3. Create Showtimes for scraped movies and cinemas
    console.log('\n⏰ Creating showtimes...');
    
    const movies = await Movie.find({});
    const cinemas = await Cinema.find({});
    
    let showtimeCount = 0;
    
    for (const movie of movies) {
      for (const cinema of cinemas) {
        // Get halls for this cinema
        const halls = await Hall.find({ cinema: cinema._id });
        
        for (const hall of halls) {
          // Create showtimes for next 7 days
          for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const showDate = new Date();
            showDate.setDate(showDate.getDate() + dayOffset);
            showDate.setHours(0, 0, 0, 0);
            
            // Use scraped showtimes
            for (const timeSlot of scrapedData.showtimes) {
              try {
                // Parse time (e.g., "10:00 AM")
                const [time, period] = timeSlot.split(' ');
                const [hours, minutes] = time.split(':');
                let hour24 = parseInt(hours);
                
                if (period === 'PM' && hour24 !== 12) hour24 += 12;
                if (period === 'AM' && hour24 === 12) hour24 = 0;
                
                const showDateTime = new Date(showDate);
                showDateTime.setHours(hour24, parseInt(minutes), 0, 0);
                
                // Check if showtime already exists
                const existingShowtime = await Showtime.findOne({
                  movie: movie._id,
                  cinema: cinema._id,
                  hall: hall._id,
                  date: showDate,
                  time: timeSlot
                });
                
                if (!existingShowtime) {
                  // Calculate price based on hall type and time
                  let basePrice = 300; // Base price in NPR
                  if (hall.type === 'IMAX') basePrice = 500;
                  if (hall.type === '4DX') basePrice = 600;
                  if (hour24 >= 18) basePrice += 50; // Evening surcharge
                  
                  const newShowtime = new Showtime({
                    movie: movie._id,
                    cinema: cinema._id,
                    hall: hall._id,
                    date: showDate,
                    time: timeSlot,
                    price: basePrice,
                    availableSeats: hall.capacity
                  });
                  
                  await newShowtime.save();
                  showtimeCount++;
                }
              } catch (error) {
                console.log(`Error creating showtime: ${error.message}`);
              }
            }
          }
        }
      }
    }
    
    console.log(`✅ Created ${showtimeCount} new showtimes`);
    
    // 4. Generate summary report
    console.log('\n📊 Integration Summary:');
    console.log('======================');
    
    const totalMovies = await Movie.countDocuments();
    const totalCinemas = await Cinema.countDocuments();
    const totalHalls = await Hall.countDocuments();
    const totalShowtimes = await Showtime.countDocuments();
    
    console.log(`🎬 Total Movies in Database: ${totalMovies}`);
    console.log(`🏢 Total Cinemas in Database: ${totalCinemas}`);
    console.log(`🎭 Total Halls in Database: ${totalHalls}`);
    console.log(`⏰ Total Showtimes in Database: ${totalShowtimes}`);
    
    console.log('\n✅ QFX data integration completed successfully!');
    console.log('🎯 Your RTX Cinema database now includes QFX Cinema data');
    
  } catch (error) {
    console.error('❌ Integration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the integration
integrateScrapedData();