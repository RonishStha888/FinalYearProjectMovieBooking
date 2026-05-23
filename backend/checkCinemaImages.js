import mongoose from 'mongoose';
import Cinema from './models/Cinema.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function checkCinemaImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const cinemas = await Cinema.find({}, 'name image');
    
    console.log('Current Cinema Images in Database:');
    console.log('=====================================\n');
    
    cinemas.forEach(cinema => {
      console.log(`${cinema.name}:`);
      console.log(`  Image: ${cinema.image}\n`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCinemaImages();
