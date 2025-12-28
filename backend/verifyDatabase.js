import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Movie from './models/Movie.js';
import Cinema from './models/Cinema.js';
import Hall from './models/Hall.js';
import Showtime from './models/Showtime.js';

// Load environment variables
dotenv.config();

const verifyDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to rtx_cinema database');

    // Count all collections
    const userCount = await User.countDocuments();
    const movieCount = await Movie.countDocuments();
    const cinemaCount = await Cinema.countDocuments();
    const hallCount = await Hall.countDocuments();
    const showtimeCount = await Showtime.countDocuments();

    console.log('\n📊 Database Contents (rtx_cinema):');
    console.log('================================');
    console.log(`👥 Users: ${userCount}`);
    console.log(`🎬 Movies: ${movieCount}`);
    console.log(`🏢 Cinemas: ${cinemaCount}`);
    console.log(`🎭 Halls: ${hallCount}`);
    console.log(`⏰ Showtimes: ${showtimeCount}`);

    // Show sample users
    const users = await User.find({}, 'login email name').limit(5);
    console.log('\n👥 Sample Users:');
    users.forEach(user => {
      console.log(`- ${user.login} (${user.email}) - ${user.name}`);
    });

    // Show sample movies
    const movies = await Movie.find({}, 'title category rating').limit(3);
    console.log('\n🎬 Sample Movies:');
    movies.forEach(movie => {
      console.log(`- ${movie.title} (${movie.category}) - ⭐${movie.rating}`);
    });

    // Show sample cinemas
    const cinemas = await Cinema.find({}, 'name location');
    console.log('\n🏢 All Cinemas:');
    cinemas.forEach(cinema => {
      console.log(`- ${cinema.name} (${cinema.location})`);
    });

    console.log('\n✅ Single Database Verification Complete!');
    console.log('🎯 All data is consolidated in rtx_cinema database.');

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
};

verifyDatabase();