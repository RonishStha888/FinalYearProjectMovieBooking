import mongoose from 'mongoose';
import Cinema from './models/Cinema.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function cleanupDuplicates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Delete the duplicate cinemas by name
    const result1 = await Cinema.deleteOne({ name: 'Fcube' });
    const result2 = await Cinema.deleteOne({ name: 'One Cinemas' });

    console.log('Cleanup Results:');
    console.log(`Deleted "Fcube": ${result1.deletedCount} document(s)`);
    console.log(`Deleted "One Cinemas": ${result2.deletedCount} document(s)`);
    
    console.log('\nRemaining cinemas:');
    const cinemas = await Cinema.find({}, 'name image');
    cinemas.forEach(cinema => {
      console.log(`- ${cinema.name}: ${cinema.image}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupDuplicates();
