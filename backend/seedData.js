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

    // Seed Showtimes for the next 14 days with realistic seat bookings
    const showtimes = [];
    const today = new Date();
    
    // Helper function to generate realistic seat layout for each hall
    const getHallSeatLayout = (hallType, cinemaName) => {
      const layouts = {
        'QFX_REGULAR': {
          rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
          seatsPerRow: [10, 12, 14, 14, 16, 16, 16, 16, 14, 14, 12, 10],
          premiumRows: ['F', 'G', 'H'],
          disabledSeats: ['A1', 'A10', 'L1', 'L10']
        },
        'QFX_GOLD': {
          rows: ['A', 'B', 'C', 'D', 'E', 'F'],
          seatsPerRow: [6, 8, 8, 8, 8, 6],
          premiumRows: ['C', 'D', 'E'],
          disabledSeats: []
        },
        'FCUBE_STANDARD': {
          rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          seatsPerRow: [8, 10, 12, 12, 14, 14, 12, 12, 10, 8],
          premiumRows: ['E', 'F', 'G'],
          disabledSeats: ['A1', 'A8', 'J1', 'J8']
        },
        'FCUBE_PREMIUM': {
          rows: ['A', 'B', 'C', 'D', 'E', 'F'],
          seatsPerRow: [8, 10, 10, 10, 10, 8],
          premiumRows: ['C', 'D', 'E'],
          disabledSeats: []
        },
        'BIG_REGULAR': {
          rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
          seatsPerRow: [8, 8, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 8],
          premiumRows: ['G', 'H', 'I', 'J'],
          disabledSeats: ['A1', 'A8', 'N1', 'N8']
        }
      };

      let layoutKey = 'QFX_REGULAR';
      if (cinemaName?.includes('QFX')) {
        layoutKey = hallType?.includes('GOLD') ? 'QFX_GOLD' : 'QFX_REGULAR';
      } else if (cinemaName?.includes('FCube')) {
        layoutKey = hallType?.includes('PREMIUM') ? 'FCUBE_PREMIUM' : 'FCUBE_STANDARD';
      } else if (cinemaName?.includes('Big Movies')) {
        layoutKey = 'BIG_REGULAR';
      }

      return layouts[layoutKey];
    };

    // Helper function to generate all possible seats for a hall
    const generateAllSeats = (layout) => {
      const allSeats = [];
      layout.rows.forEach((row, rowIndex) => {
        const seatsInRow = layout.seatsPerRow[rowIndex];
        for (let seatNum = 1; seatNum <= seatsInRow; seatNum++) {
          const seatId = `${row}${seatNum}`;
          if (!layout.disabledSeats.includes(seatId)) {
            allSeats.push(seatId);
          }
        }
      });
      return allSeats;
    };

    // Helper function to generate realistic booked seats based on date
    const generateBookedSeats = (allSeats, dayOffset, time, isWeekend, isPremiumTime) => {
      let occupancyRate = 0.15; // Default 15%

      // Set occupancy based on day
      if (dayOffset === 0) { // Today
        occupancyRate = 0.90; // 90% full
      } else if (dayOffset === 1) { // Tomorrow
        occupancyRate = 0.60; // 60% full
      } else if (dayOffset <= 3) { // Next 2 days
        occupancyRate = 0.45; // 45% full
      } else if (dayOffset <= 7) { // Rest of week
        occupancyRate = 0.30; // 30% full
      } else { // Future dates
        occupancyRate = 0.20; // 20% full
      }

      // Adjust for weekend
      if (isWeekend) {
        occupancyRate = Math.min(occupancyRate + 0.15, 0.95);
      }

      // Adjust for prime time (17:00 and 20:15)
      if (isPremiumTime) {
        occupancyRate = Math.min(occupancyRate + 0.10, 0.95);
      }

      const bookedCount = Math.floor(allSeats.length * occupancyRate);
      const shuffledSeats = [...allSeats].sort(() => Math.random() - 0.5);
      
      return shuffledSeats.slice(0, bookedCount).map(seatId => ({
        seatNumber: seatId,
        userId: users[Math.floor(Math.random() * users.length)]._id,
        bookedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random booking time in last 7 days
      }));
    };
    
    for (let day = 0; day < 14; day++) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + day);
      showDate.setHours(0, 0, 0, 0);

      const isWeekend = showDate.getDay() === 0 || showDate.getDay() === 6;

      // For each movie
      movies.forEach(movie => {
        // For each hall
        insertedHalls.forEach(hall => {
          const times = ['10:30', '13:45', '17:00', '20:15'];
          
          // Get the cinema for this hall
          const cinema = cinemas.find(c => c._id.equals(hall.cinemaId));
          const layout = getHallSeatLayout(hall.type, cinema.name);
          const allSeats = generateAllSeats(layout);
          
          times.forEach(time => {
            const price = isWeekend ? hall.pricing.weekendPrice : hall.pricing.basePrice;
            const isPremiumTime = time === '17:00' || time === '20:15';
            
            // Generate realistic booked seats for this specific showtime
            const bookedSeats = generateBookedSeats(allSeats, day, time, isWeekend, isPremiumTime);
            
            showtimes.push({
              movieId: movie._id,
              cinemaId: hall.cinemaId,
              hallId: hall._id,
              date: showDate,
              time: time,
              price: price,
              originalPrice: price + 50, // Show discount
              availableSeats: hall.totalSeats,
              bookedSeats: bookedSeats
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