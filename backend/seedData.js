import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';
import Cinema from './models/Cinema.js';
import Hall from './models/Hall.js';
import Showtime from './models/Showtime.js';
import User from './models/User.js';
import Booking from './models/Booking.js';
import EmailVerification from './models/EmailVerification.js';
import PasswordReset from './models/PasswordReset.js';
import { getCurrentMovies } from './services/movieApiService.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB using the same connection as the main app
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Clear ALL existing data from single database
    await Movie.deleteMany({});
    await Cinema.deleteMany({});
    await Hall.deleteMany({});
    await Showtime.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    await EmailVerification.deleteMany({});
    await PasswordReset.deleteMany({});

    console.log('Cleared all existing data from rtx_cinema database...');

    // Seed Test Users (for login testing)
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      {
        login: "admin",
        password: hashedPassword,
        email: "admin@rtxcinema.com",
        name: "Admin User",
        authMethod: "email"
      },
      {
        login: "testuser",
        password: hashedPassword,
        email: "test@rtxcinema.com", 
        name: "Test User",
        authMethod: "email"
      },
      {
        login: "john_doe",
        password: hashedPassword,
        email: "john@example.com",
        name: "John Doe",
        authMethod: "email"
      }
    ]);

    console.log('Seeded users...');

    // Seed Movies with Real Movie Posters and Data
    const realMovieData = getCurrentMovies();
    const movies = await Movie.insertMany(realMovieData);

    console.log('Seeded movies with real posters and data...');

    // Seed Cinemas
    const cinemas = await Cinema.insertMany([
      {
        name: "QFX Cinema Jai Nepal",
        location: "Chabahil",
        address: "Jai Nepal Cinema Hall, Chabahil, Kathmandu",
        city: "Kathmandu",
        distance: "2.5 km",
        rating: 4.5,
        amenities: ["Parking", "Food Court", "AC", "Dolby Atmos"],
        phone: "+977-1-4470000",
        email: "info@qfxcinemas.com"
      },
      {
        name: "FCube Cinema",
        location: "Labim Mall, Lalitpur",
        address: "Labim Mall, Pulchowk, Lalitpur",
        city: "Kathmandu",
        distance: "4.2 km",
        rating: 4.3,
        amenities: ["Parking", "Mall", "AC", "Premium Sound"],
        phone: "+977-1-5555000",
        email: "info@fcubecinema.com"
      },
      {
        name: "Big Movies",
        location: "Civil Mall, Sundhara",
        address: "Civil Mall, Sundhara, Kathmandu",
        city: "Kathmandu",
        distance: "1.8 km",
        rating: 4.2,
        amenities: ["Parking", "Food Court", "AC"],
        phone: "+977-1-4444000",
        email: "info@bigmovies.com"
      }
    ]);

    console.log('Seeded cinemas...');

    // Seed Halls
    const halls = [];
    
    // QFX Cinema halls
    halls.push(
      {
        cinemaId: cinemas[0]._id,
        hallNumber: "1",
        name: "Hall 1",
        type: "REGULAR 2D",
        totalSeats: 156,
        seatLayout: { rows: 12, seatsPerRow: 13 },
        pricing: { basePrice: 450, weekendPrice: 500 },
        features: ["AC", "Dolby Atmos"]
      },
      {
        cinemaId: cinemas[0]._id,
        hallNumber: "2",
        name: "Gold Class Hall",
        type: "GOLD CLASS 2D",
        totalSeats: 48,
        seatLayout: { rows: 6, seatsPerRow: 8 },
        pricing: { basePrice: 700, weekendPrice: 750 },
        features: ["AC", "Dolby Atmos", "Recliner Seats", "Food Service"]
      }
    );

    // FCube Cinema halls
    halls.push(
      {
        cinemaId: cinemas[1]._id,
        hallNumber: "1",
        name: "Standard Hall 1",
        type: "STANDARD 2D",
        totalSeats: 120,
        seatLayout: { rows: 10, seatsPerRow: 12 },
        pricing: { basePrice: 400, weekendPrice: 450 },
        features: ["AC", "Premium Sound"]
      },
      {
        cinemaId: cinemas[1]._id,
        hallNumber: "2",
        name: "Premium Hall 2",
        type: "PREMIUM 2D",
        totalSeats: 60,
        seatLayout: { rows: 6, seatsPerRow: 10 },
        pricing: { basePrice: 600, weekendPrice: 650 },
        features: ["AC", "Premium Sound", "Recliner Seats"]
      }
    );

    // Big Movies halls
    halls.push(
      {
        cinemaId: cinemas[2]._id,
        hallNumber: "1",
        name: "Main Hall",
        type: "REGULAR 2D",
        totalSeats: 140,
        seatLayout: { rows: 14, seatsPerRow: 10 },
        pricing: { basePrice: 380, weekendPrice: 420 },
        features: ["AC"]
      }
    );

    const insertedHalls = await Hall.insertMany(halls);
    console.log('Seeded halls...');

    // Seed Showtimes for the next 14 days
    const showtimes = [];
    const today = new Date();
    
    for (let day = 0; day < 14; day++) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + day);
      showDate.setHours(0, 0, 0, 0);

      // For each movie
      movies.forEach(movie => {
        // For each hall
        insertedHalls.forEach(hall => {
          const times = ['10:30', '13:45', '17:00', '20:15'];
          
          times.forEach(time => {
            const isWeekend = showDate.getDay() === 0 || showDate.getDay() === 6;
            const price = isWeekend ? hall.pricing.weekendPrice : hall.pricing.basePrice;
            
            showtimes.push({
              movieId: movie._id,
              cinemaId: hall.cinemaId,
              hallId: hall._id,
              date: showDate,
              time: time,
              price: price,
              originalPrice: price + 50, // Show discount
              availableSeats: hall.totalSeats,
              bookedSeats: []
            });
          });
        });
      });
    }

    await Showtime.insertMany(showtimes);
    console.log('Seeded showtimes...');

    console.log('Database seeded successfully with ALL data in single rtx_cinema database!');
    console.log(`- ${users.length} users`);
    console.log(`- ${movies.length} movies`);
    console.log(`- ${cinemas.length} cinemas`);
    console.log(`- ${insertedHalls.length} halls`);
    console.log(`- ${showtimes.length} showtimes`);
    console.log('\n🔐 Test Login Credentials:');
    console.log('Username: admin | Password: password123');
    console.log('Username: testuser | Password: password123');
    console.log('Username: john_doe | Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();