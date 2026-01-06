import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Movie from './models/Movie.js';
import Cinema from './models/Cinema.js';
import Hall from './models/Hall.js';
import Showtime from './models/Showtime.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rtx_cinema');

// Helper function to get real poster URLs for current movies
function getRealPosterUrl(movieTitle) {
  const posterMap = {
    'Avatar: Fire and Ash': 'https://image.tmdb.org/t/p/w500/95VlSEfLMqeX36UVcHJuNlWEpwf.jpg',
    'Mission: Impossible 8': 'https://image.tmdb.org/t/p/w500/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    'Fantastic Four': 'https://image.tmdb.org/t/p/w500/x2RS3uTcsJJ9IfjNPcgDmukoEcQ.jpg',
    'Wicked: Part Two': 'https://image.tmdb.org/t/p/w500/c5Tqxeo1UpBvnAc3csUm7j3hlQl.jpg',
    'Sonic the Hedgehog 3': 'https://image.tmdb.org/t/p/w500/d4EvZjBzJy6frXHd2lKtPsCwGxo.jpg',
    'Mufasa: The Lion King': 'https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg'
  };
  
  // Log the movie title being processed for debugging
  console.log(`🖼️ Getting poster for: "${movieTitle}"`);
  
  const posterUrl = posterMap[movieTitle];
  if (posterUrl) {
    console.log(`✅ Found poster URL for: ${movieTitle}`);
    return posterUrl;
  } else {
    console.log(`❌ No poster found for: ${movieTitle}, using placeholder`);
    return 'https://image.tmdb.org/t/p/w500/placeholder.jpg';
  }
}

// Helper function to map facilities to valid amenities
function mapFacilitiesToAmenities(facilities) {
  const validAmenities = ['Parking', 'Food Court', 'AC', 'Dolby Atmos', 'Premium Sound', 'Mall', '3D', 'IMAX'];
  const mapped = [];
  
  facilities.forEach(facility => {
    const facilityLower = facility.toLowerCase();
    if (facilityLower.includes('imax')) mapped.push('IMAX');
    if (facilityLower.includes('dolby atmos')) mapped.push('Dolby Atmos');
    if (facilityLower.includes('3d')) mapped.push('3D');
    if (facilityLower.includes('premium') || facilityLower.includes('recliner')) mapped.push('Premium Sound');
    if (facilityLower.includes('4dx') || facilityLower.includes('digital')) mapped.push('Premium Sound');
    if (facilityLower.includes('mall')) mapped.push('Mall');
    if (facilityLower.includes('parking')) mapped.push('Parking');
    if (facilityLower.includes('food')) mapped.push('Food Court');
  });
  
  // Add default amenities
  if (!mapped.includes('AC')) mapped.push('AC');
  if (!mapped.includes('Parking')) mapped.push('Parking');
  
  return [...new Set(mapped)]; // Remove duplicates
}

// Helper function to map genre to category
function getCategoryFromGenre(genre) {
  const genreLower = genre.toLowerCase();
  if (genreLower.includes('action')) return 'action';
  if (genreLower.includes('comedy')) return 'comedy';
  if (genreLower.includes('horror')) return 'horror';
  if (genreLower.includes('sci-fi') || genreLower.includes('science')) return 'sci-fi';
  if (genreLower.includes('drama')) return 'drama';
  return 'action'; // default
}

async function integrateCurrentData() {
  try {
    console.log('🗓️ INTEGRATING CURRENT DATE DATA (January 4, 2026)');
    console.log('===================================================');
    
    // Read current date scraped data
    const dataPath = path.join(process.cwd(), 'scraped-data', 'current-date-data.json');
    const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`📅 Target Date: ${currentData.dateFormatted} (${currentData.dayOfWeek})`);
    console.log(`🎬 Movies to integrate: ${currentData.movies.length}`);
    console.log(`🏢 Cinemas to integrate: ${currentData.cinemas.length}`);
    console.log(`⏰ Showtimes to integrate: ${currentData.showtimes.length}`);
    console.log('');
    
    // 1. Clear old data and integrate current movies
    console.log('🎬 INTEGRATING CURRENT MOVIES...');
    console.log('================================');
    
    // Remove duplicates from current movies (keep unique titles only)
    const uniqueMovies = [];
    const seenTitles = new Set();
    
    for (const movie of currentData.movies) {
      if (!seenTitles.has(movie.title)) {
        seenTitles.add(movie.title);
        uniqueMovies.push(movie);
      }
    }
    
    console.log(`📽️ Processing ${uniqueMovies.length} unique movies`);
    
    for (const movieData of uniqueMovies) {
      try {
        // Parse duration from "190 min" to 190
        const durationMatch = movieData.duration.match(/(\d+)/);
        const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 120;
        
        // Extract year from release date
        const releaseYear = new Date(movieData.releaseDate).getFullYear().toString();
        
        // Get real poster URL based on movie title
        const realPosterUrl = getRealPosterUrl(movieData.title);
        
        // Update or create movie
        const existingMovie = await Movie.findOne({ title: movieData.title });
        
        if (existingMovie) {
          await Movie.updateOne(
            { title: movieData.title },
            {
              $set: {
                image: realPosterUrl,
                genre: movieData.genre,
                duration: durationMinutes,
                rating: parseFloat(movieData.rating),
                year: releaseYear,
                synopsis: movieData.description,
                director: movieData.director,
                cast: movieData.cast.split(', '),
                language: movieData.language,
                releaseDate: new Date(movieData.releaseDate),
                category: getCategoryFromGenre(movieData.genre),
                isActive: true,
                updatedAt: new Date()
              }
            }
          );
          console.log(`✅ Updated: ${movieData.title} (with real poster)`);
        } else {
          const newMovie = new Movie({
            title: movieData.title,
            image: realPosterUrl,
            genre: movieData.genre,
            duration: durationMinutes,
            rating: parseFloat(movieData.rating),
            year: releaseYear,
            synopsis: movieData.description,
            director: movieData.director,
            cast: movieData.cast.split(', '),
            language: movieData.language,
            releaseDate: new Date(movieData.releaseDate),
            category: getCategoryFromGenre(movieData.genre),
            isActive: true
          });
          
          await newMovie.save();
          console.log(`✅ Added new: ${movieData.title} (with real poster)`);
        }
      } catch (error) {
        console.log(`❌ Error with movie ${movieData.title}: ${error.message}`);
      }
    }
    
    // 2. Integrate current cinemas
    console.log('\n🏢 INTEGRATING CURRENT CINEMAS...');
    console.log('=================================');
    
    for (const cinemaData of currentData.cinemas) {
      try {
        const existingCinema = await Cinema.findOne({ name: cinemaData.name });
        
        if (existingCinema) {
          await Cinema.updateOne(
            { name: cinemaData.name },
            {
              $set: {
                location: cinemaData.address.split(',')[0] || cinemaData.address,
                address: cinemaData.address,
                city: cinemaData.city,
                distance: '2.5 km', // Default distance
                rating: 4.2,
                amenities: mapFacilitiesToAmenities(cinemaData.facilities || []),
                phone: cinemaData.phone,
                isActive: true,
                updatedAt: new Date()
              }
            }
          );
          console.log(`✅ Updated cinema: ${cinemaData.name}`);
        } else {
          const newCinema = new Cinema({
            name: cinemaData.name,
            location: cinemaData.address.split(',')[0] || cinemaData.address,
            address: cinemaData.address,
            city: cinemaData.city,
            distance: '2.5 km',
            rating: 4.2,
            amenities: mapFacilitiesToAmenities(cinemaData.facilities || []),
            phone: cinemaData.phone,
            isActive: true
          });
          
          await newCinema.save();
          console.log(`✅ Added new cinema: ${cinemaData.name}`);
          
          // Create halls for new cinema
          const hallTypes = [
            { 
              name: 'Hall 1', 
              hallNumber: '1',
              type: 'IMAX', 
              totalSeats: 200,
              rows: 15,
              seatsPerRow: 14,
              basePrice: 600,
              weekendPrice: 750
            },
            { 
              name: 'Hall 2', 
              hallNumber: '2',
              type: 'STANDARD 2D', 
              totalSeats: 150,
              rows: 12,
              seatsPerRow: 13,
              basePrice: 350,
              weekendPrice: 450
            },
            { 
              name: 'Hall 3', 
              hallNumber: '3',
              type: '3D', 
              totalSeats: 120,
              rows: 10,
              seatsPerRow: 12,
              basePrice: 500,
              weekendPrice: 600
            }
          ];
          
          for (const hallData of hallTypes) {
            const newHall = new Hall({
              cinemaId: newCinema._id,
              hallNumber: hallData.hallNumber,
              name: hallData.name,
              type: hallData.type,
              totalSeats: hallData.totalSeats,
              seatLayout: {
                rows: hallData.rows,
                seatsPerRow: hallData.seatsPerRow
              },
              pricing: {
                basePrice: hallData.basePrice,
                weekendPrice: hallData.weekendPrice
              },
              features: ['AC', 'Premium Sound'],
              isActive: true
            });
            
            await newHall.save();
            console.log(`  ➕ Added hall: ${hallData.name} (${hallData.type})`);
          }
        }
      } catch (error) {
        console.log(`❌ Error with cinema ${cinemaData.name}: ${error.message}`);
      }
    }
    
    // 3. Create current date showtimes
    console.log('\n⏰ CREATING TODAY\'S SHOWTIMES...');
    console.log('=================================');
    console.log(`📅 Creating showtimes for: ${currentData.dateFormatted}`);
    
    // Get all movies and cinemas
    const movies = await Movie.find({ isActive: true });
    const cinemas = await Cinema.find({ isActive: true });
    
    let showtimeCount = 0;
    const targetDate = new Date(currentData.date);
    
    // Remove existing showtimes for today
    await Showtime.deleteMany({ 
      date: {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    console.log('🗑️ Cleared existing showtimes for today');
    
    for (const movie of movies) {
      for (const cinema of cinemas) {
        // Get halls for this cinema
        const halls = await Hall.find({ cinemaId: cinema._id });
        
        for (const hall of halls) {
          // Create showtimes using current data
          const showtimesToCreate = currentData.showtimes.slice(0, 8); // Limit per hall
          
          for (const timeSlot of showtimesToCreate) {
            try {
              // Parse time
              const [time, period] = timeSlot.split(' ');
              const [hours, minutes] = time.split(':');
              let hour24 = parseInt(hours);
              
              if (period === 'PM' && hour24 !== 12) hour24 += 12;
              if (period === 'AM' && hour24 === 12) hour24 = 0;
              
              // Calculate price based on hall type and time
              let basePrice = hall.pricing.basePrice;
              if (hour24 >= 18) basePrice = hall.pricing.weekendPrice; // Evening pricing
              
              // Calculate occupancy based on movie popularity and time
              let occupancyRate = 0.3; // Default 30%
              if (movie.rating > 8.5) occupancyRate = 0.7; // Popular movies 70%
              if (hour24 >= 19 && hour24 <= 21) occupancyRate += 0.2; // Prime time boost
              
              const occupiedSeats = Math.floor(hall.totalSeats * occupancyRate);
              const availableSeats = hall.totalSeats - occupiedSeats;
              
              const newShowtime = new Showtime({
                movieId: movie._id,
                cinemaId: cinema._id,
                hallId: hall._id,
                date: targetDate,
                time: timeSlot,
                price: basePrice,
                originalPrice: basePrice,
                availableSeats: availableSeats,
                bookedSeats: []
              });
              
              await newShowtime.save();
              showtimeCount++;
              
            } catch (error) {
              console.log(`Error creating showtime: ${error.message}`);
            }
          }
        }
      }
    }
    
    console.log(`✅ Created ${showtimeCount} showtimes for today`);
    
    // 4. Generate integration summary
    console.log('\n📊 INTEGRATION SUMMARY (January 4, 2026):');
    console.log('==========================================');
    
    const totalMovies = await Movie.countDocuments({ isActive: true });
    const totalCinemas = await Cinema.countDocuments();
    const totalHalls = await Hall.countDocuments();
    const todayShowtimes = await Showtime.countDocuments({ 
      date: {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    console.log(`🎬 Current Movies in Database: ${totalMovies}`);
    console.log(`🏢 Cinema Locations: ${totalCinemas}`);
    console.log(`🎭 Total Halls: ${totalHalls}`);
    console.log(`⏰ Today's Showtimes: ${todayShowtimes}`);
    console.log(`📅 Data Date: ${currentData.dateFormatted}`);
    console.log(`🕐 Integration Time: ${new Date().toLocaleString()}`);
    
    // Show sample of today's showtimes
    console.log('\n🎬 SAMPLE TODAY\'S SHOWTIMES:');
    console.log('============================');
    const sampleShowtimes = await Showtime.find({ 
      date: {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      }
    })
    .populate('movieId', 'title')
    .populate('cinemaId', 'name')
    .populate('hallId', 'name type')
    .limit(10);
    
    sampleShowtimes.forEach((showtime, index) => {
      console.log(`${index + 1}. ${showtime.movieId.title}`);
      console.log(`   Cinema: ${showtime.cinemaId.name}`);
      console.log(`   Hall: ${showtime.hallId.name} (${showtime.hallId.type})`);
      console.log(`   Time: ${showtime.time}`);
      console.log(`   Price: NPR ${showtime.price}`);
      console.log(`   Available: ${showtime.availableSeats} seats`);
      console.log('');
    });
    
    console.log('✅ CURRENT DATE INTEGRATION COMPLETED!');
    console.log('🎯 Your RTX Cinema database now has current January 4, 2026 data');
    console.log('🚀 Ready for live cinema booking system!');
    
  } catch (error) {
    console.error('❌ Integration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the integration
integrateCurrentData();