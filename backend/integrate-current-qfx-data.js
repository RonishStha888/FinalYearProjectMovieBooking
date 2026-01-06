import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Movie from './models/Movie.js';
import Cinema from './models/Cinema.js';
import Hall from './models/Hall.js';
import Showtime from './models/Showtime.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rtx_cinema');

async function integrateCurrentQFXData() {
  try {
    console.log('🔄 Integrating current QFX Cinema data into RTX Cinema database...');
    
    // Read current QFX data
    const dataPath = path.join(process.cwd(), 'scraped-data', 'qfx-current-data.json');
    const qfxData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`📊 Processing ${qfxData.movies.length} current movies, ${qfxData.cinemas.length} cinemas`);
    
    // 1. Integrate Current Movies
    console.log('\n🎬 Integrating current movies...');
    const addedMovies = [];
    
    for (const movieData of qfxData.movies) {
      try {
        // Check if movie already exists
        const existingMovie = await Movie.findOne({ title: movieData.title });
        
        if (existingMovie) {
          console.log(`⚠️  Movie already exists: ${movieData.title}`);
          // Update existing movie with current data
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
                releaseDate: new Date(movieData.releaseDate),
                updatedAt: new Date()
              }
            }
          );
          console.log(`✅ Updated: ${movieData.title}`);
          addedMovies.push(existingMovie);
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
          addedMovies.push(newMovie);
        }
      } catch (error) {
        console.log(`❌ Error processing movie ${movieData.title}:`, error.message);
      }
    }
    
    // 2. Integrate QFX Cinemas
    console.log('\n🏢 Integrating QFX cinemas...');
    const addedCinemas = [];
    
    for (const cinemaData of qfxData.cinemas) {
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
          addedCinemas.push(existingCinema);
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
          addedCinemas.push(newCinema);
          
          // Create halls for new cinema
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
    
    // 3. Create Current Showtimes
    console.log('\n⏰ Creating current showtimes...');
    
    const allMovies = await Movie.find({});
    const allCinemas = await Cinema.find({});
    
    let showtimeCount = 0;
    
    // Create showtimes for current movies at all cinemas
    for (const movie of allMovies) {
      for (const cinema of allCinemas) {
        // Get halls for this cinema
        const halls = await Hall.find({ cinema: cinema._id });
        
        for (const hall of halls) {
          // Create showtimes for next 7 days
          for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const showDate = new Date();
            showDate.setDate(showDate.getDate() + dayOffset);
            showDate.setHours(0, 0, 0, 0);
            
            // Use QFX showtimes
            for (const timeSlot of qfxData.showtimes) {
              try {
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
                  
                  // Parse time for evening surcharge
                  const [time, period] = timeSlot.split(' ');
                  const [hours] = time.split(':');
                  let hour24 = parseInt(hours);
                  if (period === 'PM' && hour24 !== 12) hour24 += 12;
                  if (hour24 >= 18) basePrice += 50; // Evening surcharge
                  
                  // Calculate occupancy based on day
                  let occupancyRate = 0.2; // Default 20%
                  if (dayOffset === 0) occupancyRate = 0.9; // Today 90%
                  if (dayOffset === 1) occupancyRate = 0.6; // Tomorrow 60%
                  if (dayOffset === 2) occupancyRate = 0.4; // Day after 40%
                  
                  const occupiedSeats = Math.floor(hall.capacity * occupancyRate);
                  const availableSeats = hall.capacity - occupiedSeats;
                  
                  const newShowtime = new Showtime({
                    movie: movie._id,
                    cinema: cinema._id,
                    hall: hall._id,
                    date: showDate,
                    time: timeSlot,
                    price: basePrice,
                    availableSeats: availableSeats
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
    
    // 4. Generate integration report
    console.log('\n📊 QFX Integration Report:');
    console.log('==========================');
    
    const totalMovies = await Movie.countDocuments();
    const totalCinemas = await Cinema.countDocuments();
    const totalHalls = await Hall.countDocuments();
    const totalShowtimes = await Showtime.countDocuments();
    
    console.log(`🎬 Total Movies in Database: ${totalMovies}`);
    console.log(`🏢 Total Cinemas in Database: ${totalCinemas}`);
    console.log(`🎭 Total Halls in Database: ${totalHalls}`);
    console.log(`⏰ Total Showtimes in Database: ${totalShowtimes}`);
    
    // Show current movies
    console.log('\n🎬 Current Movies in Database:');
    console.log('-----------------------------');
    const currentMovies = await Movie.find({}).sort({ createdAt: -1 }).limit(10);
    currentMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.genre}) - Rating: ${movie.rating}`);
    });
    
    console.log('\n✅ QFX Cinema data integration completed successfully!');
    console.log('🎯 Your RTX Cinema database now includes current QFX movies and data');
    console.log('🌐 Users can now book tickets for current movies at QFX locations');
    
  } catch (error) {
    console.error('❌ Integration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the integration
integrateCurrentQFXData();