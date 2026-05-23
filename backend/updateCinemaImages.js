import mongoose from 'mongoose';
import Cinema from './models/Cinema.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Map cinema names to their local image paths
// Images are stored in frontend/src/assets/
const cinemaImages = {
  'QFX Labim Mall': '/src/assets/qfx-labim.jpg',
  'QFX Civil Mall': '/src/assets/qfx-civil.jpg',
  'QFX Jai Nepal': '/src/assets/qfx-jainepal.png',
  'Fcube Cinemas': '/src/assets/fcube.png',
  'Big Movies': '/src/assets/bigmovies.jpg',
  'Gopi Krishna Movies': '/src/assets/gopikrishna.jpg'
};

async function updateCinemaImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const [cinemaName, imagePath] of Object.entries(cinemaImages)) {
      const result = await Cinema.updateOne(
        { name: cinemaName },
        { $set: { image: imagePath } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✓ Updated image for: ${cinemaName}`);
      } else {
        console.log(`✗ Cinema not found: ${cinemaName}`);
      }
    }

    console.log('\n✓ Cinema images updated successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating cinema images:', error);
    process.exit(1);
  }
}

updateCinemaImages();
