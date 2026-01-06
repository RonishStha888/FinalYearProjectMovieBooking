import mongoose from 'mongoose';
import Movie from './models/Movie.js';

mongoose.connect('mongodb://localhost:27017/rtx_cinema');

const checkMovies = async () => {
  try {
    const currentMovies = await Movie.find({ 
      title: { 
        $in: ['Avatar: Fire and Ash', 'Mission: Impossible 8', 'Fantastic Four', 'Wicked: Part Two', 'Sonic the Hedgehog 3', 'Mufasa: The Lion King'] 
      } 
    }).select('title image');
    
    console.log('🎬 CURRENT MOVIES WITH POSTERS:');
    console.log('===============================');
    currentMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title}`);
      console.log(`   Poster: ${movie.image}`);
      console.log('');
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

checkMovies();