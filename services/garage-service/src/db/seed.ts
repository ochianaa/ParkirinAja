import { db, garages } from './index';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting garage database seeding...');

    // Check if garages already exist
    const existingGarages = await db.select().from(garages);
    
    if (existingGarages.length === 0) {
      console.log('🏠 Creating sample garages...');
      
      await db.insert(garages).values([
        {
          owner_id: 1, // Assuming admin user has ID 1
          name: 'Downtown Parking Garage',
          address: 'Jl. Sudirman No. 123, Jakarta Pusat',
          description: 'Secure parking garage in the heart of downtown Jakarta',
          price_per_hour: '15000.00',
          status: 'available'
        },
        {
          owner_id: 1,
          name: 'Mall Parking Area',
          address: 'Jl. Thamrin No. 456, Jakarta Pusat',
          description: 'Covered parking area near shopping mall',
          price_per_hour: '12000.00',
          status: 'available'
        }
      ]);
      
      console.log('✅ Sample garages created successfully');
    } else {
      console.log('ℹ️  Garages already exist, skipping creation');
    }

    console.log('🎉 Garage database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding garage database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Garage seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Garage seeding failed:', error);
      process.exit(1);
    });
}