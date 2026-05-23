import mongoose from 'mongoose';
import Cinema from './models/Cinema.js';
import Hall from './models/Hall.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function seedHalls() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get all cinemas
    const cinemas = await Cinema.find();
    console.log(`Found ${cinemas.length} cinemas\n`);

    // Clear existing halls
    await Hall.deleteMany({});
    console.log('Cleared existing halls\n');

    let totalHalls = 0;

    for (const cinema of cinemas) {
      console.log(`Adding halls for: ${cinema.name}`);
      
      let halls = [];
      
      // Define halls based on cinema type
      if (cinema.name.includes('QFX')) {
        // QFX cinemas - premium halls
        halls = [
          {
            cinemaId: cinema._id,
            hallNumber: '1',
            name: 'Hall 1',
            type: 'PREMIUM 2D',
            totalSeats: 150,
            seatLayout: { rows: 10, seatsPerRow: 15 },
            pricing: { basePrice: 400, weekendPrice: 500 },
            features: ['Dolby Atmos', 'Premium Sound', 'AC'],
            isActive: true
          },
          {
            cinemaId: cinema._id,
            hallNumber: '2',
            name: 'Hall 2',
            type: '3D',
            totalSeats: 120,
            seatLayout: { rows: 10, seatsPerRow: 12 },
            pricing: { basePrice: 550, weekendPrice: 650 },
            features: ['Dolby Atmos', 'Premium Sound', 'AC'],
            isActive: true
          },
          {
            cinemaId: cinema._id,
            hallNumber: '3',
            name: 'Hall 3',
            type: 'GOLD CLASS 2D',
            totalSeats: 80,
            seatLayout: { rows: 8, seatsPerRow: 10 },
            pricing: { basePrice: 600, weekendPrice: 700 },
            features: ['Dolby Atmos', 'Premium Sound', 'Recliner Seats', 'AC', 'Food Service'],
            isActive: true
          }
        ];
      } else if (cinema.name.includes('Fcube')) {
        // Fcube - modern halls
        halls = [
          {
            cinemaId: cinema._id,
            hallNumber: '1',
            name: 'Hall 1',
            type: 'PREMIUM 2D',
            totalSeats: 180,
            seatLayout: { rows: 12, seatsPerRow: 15 },
            pricing: { basePrice: 380, weekendPrice: 480 },
            features: ['Dolby Atmos', 'AC'],
            isActive: true
          },
          {
            cinemaId: cinema._id,
            hallNumber: '2',
            name: 'Hall 2',
            type: '3D',
            totalSeats: 150,
            seatLayout: { rows: 10, seatsPerRow: 15 },
            pricing: { basePrice: 500, weekendPrice: 600 },
            features: ['Dolby Atmos', 'Premium Sound', 'AC'],
            isActive: true
          }
        ];
      } else if (cinema.name.includes('Big Movies')) {
        // Big Movies - standard halls
        halls = [
          {
            cinemaId: cinema._id,
            hallNumber: '1',
            name: 'Hall 1',
            type: 'STANDARD 2D',
            totalSeats: 200,
            seatLayout: { rows: 13, seatsPerRow: 15 },
            pricing: { basePrice: 300, weekendPrice: 400 },
            features: ['Premium Sound', 'AC'],
            isActive: true
          },
          {
            cinemaId: cinema._id,
            hallNumber: '2',
            name: 'Hall 2',
            type: 'STANDARD 2D',
            totalSeats: 180,
            seatLayout: { rows: 12, seatsPerRow: 15 },
            pricing: { basePrice: 300, weekendPrice: 400 },
            features: ['AC'],
            isActive: true
          }
        ];
      } else {
        // Gopi Krishna and others - regular halls
        halls = [
          {
            cinemaId: cinema._id,
            hallNumber: '1',
            name: 'Hall 1',
            type: 'REGULAR 2D',
            totalSeats: 150,
            seatLayout: { rows: 10, seatsPerRow: 15 },
            pricing: { basePrice: 280, weekendPrice: 350 },
            features: ['AC'],
            isActive: true
          },
          {
            cinemaId: cinema._id,
            hallNumber: '2',
            name: 'Hall 2',
            type: 'REGULAR 2D',
            totalSeats: 120,
            seatLayout: { rows: 10, seatsPerRow: 12 },
            pricing: { basePrice: 280, weekendPrice: 350 },
            features: ['AC'],
            isActive: true
          }
        ];
      }

      // Insert halls
      const insertedHalls = await Hall.insertMany(halls);
      console.log(`  ✓ Added ${insertedHalls.length} halls`);

      // Update cinema with hall references
      cinema.halls = insertedHalls.map(h => h._id);
      await cinema.save();
      console.log(`  ✓ Updated cinema with hall references\n`);

      totalHalls += insertedHalls.length;
    }

    console.log(`\n✓ Successfully seeded ${totalHalls} halls across ${cinemas.length} cinemas!`);
    
    // Display summary
    console.log('\n📊 Summary:');
    for (const cinema of cinemas) {
      const hallCount = await Hall.countDocuments({ cinemaId: cinema._id });
      console.log(`  ${cinema.name}: ${hallCount} halls`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding halls:', error);
    process.exit(1);
  }
}

seedHalls();
