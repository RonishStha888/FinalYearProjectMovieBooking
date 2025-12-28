import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const cleanupDatabases = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the admin database to list all databases
    const adminDb = mongoose.connection.db.admin();
    const databasesList = await adminDb.listDatabases();
    
    console.log('\n📋 Current databases:');
    databasesList.databases.forEach(db => {
      console.log(`- ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    // Databases to keep (system databases + our main database)
    const systemDatabases = ['admin', 'config', 'local'];
    const ourDatabase = 'rtx_cinema';
    const keepDatabases = [...systemDatabases, ourDatabase];

    // Find databases to drop
    const databasesToDrop = databasesList.databases
      .filter(db => !keepDatabases.includes(db.name))
      .map(db => db.name);

    if (databasesToDrop.length === 0) {
      console.log('\n✅ No unnecessary databases found. Only rtx_cinema exists.');
      return;
    }

    console.log('\n🗑️  Databases to be dropped:');
    databasesToDrop.forEach(dbName => {
      console.log(`- ${dbName}`);
    });

    // Drop each unnecessary database
    for (const dbName of databasesToDrop) {
      try {
        const dbToDrop = mongoose.connection.client.db(dbName);
        await dbToDrop.dropDatabase();
        console.log(`✅ Dropped database: ${dbName}`);
      } catch (error) {
        console.error(`❌ Error dropping ${dbName}:`, error.message);
      }
    }

    // Verify final state
    const finalDatabasesList = await adminDb.listDatabases();
    console.log('\n📋 Remaining databases:');
    finalDatabasesList.databases.forEach(db => {
      console.log(`- ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    console.log('\n🎯 Database cleanup complete!');
    console.log('✅ Only rtx_cinema database remains with all your data.');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
};

cleanupDatabases();