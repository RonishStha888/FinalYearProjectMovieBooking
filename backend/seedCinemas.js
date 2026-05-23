import mongoose from 'mongoose';
import Cinema from './models/Cinema.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const cinemas = [
  {
    name: 'QFX Labim Mall',
    location: 'Labim Mall, Pulchowk',
    address: 'Labim Mall, Pulchowk, Lalitpur',
    city: 'Kathmandu',
    distance: '3.2 km',
    rating: 4.5,
    amenities: ['Parking', 'Food Court', 'AC', 'Dolby Atmos', 'Premium Sound', 'Mall'],
    phone: '+977-1-5970222',
    email: 'labim@qfxcinemas.com',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    isActive: true
  },
  {
    name: 'QFX Civil Mall',
    location: 'Civil Mall, Sundhara',
    address: 'Civil Mall, Sundhara, Kathmandu',
    city: 'Kathmandu',
    distance: '2.5 km',
    rating: 4.3,
    amenities: ['Parking', 'Food Court', 'AC', 'Premium Sound', 'Mall', '3D'],
    phone: '+977-1-4169000',
    email: 'civil@qfxcinemas.com',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    isActive: true
  },
  {
    name: 'QFX Jai Nepal',
    location: 'Jai Nepal Hall, Jamal',
    address: 'Jai Nepal Cinema Hall, Jamal, Kathmandu',
    city: 'Kathmandu',
    distance: '1.8 km',
    rating: 4.0,
    amenities: ['AC', 'Premium Sound', '3D'],
    phone: '+977-1-4227720',
    email: 'jainepal@qfxcinemas.com',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    isActive: true
  },
  {
    name: 'Fcube Cinemas',
    location: 'Bhaktapur',
    address: 'Sallaghari, Bhaktapur',
    city: 'Bhaktapur',
    distance: '12 km',
    rating: 4.2,
    amenities: ['Parking', 'Food Court', 'AC', 'Dolby Atmos', '3D'],
    phone: '+977-1-6638888',
    email: 'info@fcubecinemas.com',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    isActive: true
  },
  {
    name: 'Big Movies',
    location: 'Bhaktapur',
    address: 'Kamal Binayak, Bhaktapur',
    city: 'Bhaktapur',
    distance: '11 km',
    rating: 3.9,
    amenities: ['Parking', 'AC', 'Premium Sound'],
    phone: '+977-1-6610444',
    email: 'info@bigmovies.com.np',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    isActive: true
  },
  {
    name: 'Gopi Krishna Movies',
    location: 'Jamal, Kathmandu',
    address: 'Gopi Krishna Complex, Jamal, Kathmandu',
    city: 'Kathmandu',
    distance: '2.0 km',
    rating: 3.8,
    amenities: ['AC', 'Food Court'],
    phone: '+977-1-4227374',
    email: 'info@gopikrishnamovies.com',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    isActive: true
  }
];

async function seedCinemas() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing cinemas
    await Cinema.deleteMany({});
    console.log('Cleared existing cinemas');

    // Insert new cinemas
    await Cinema.insertMany(cinemas);
    console.log('Successfully seeded cinemas!');
    console.log(`Added ${cinemas.length} cinemas`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding cinemas:', error);
    process.exit(1);
  }
}

seedCinemas();
