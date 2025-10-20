import { db, bookings } from './index';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting booking database seeding...');

    // Check if bookings already exist
    const existingBookings = await db.select().from(bookings);
    
    if (existingBookings.length === 0) {
      console.log('📅 Creating sample bookings...');
      
      // Create some sample bookings (assuming user ID 1 and garage ID 1 exist)
      await db.insert(bookings).values([
        {
          user_id: 1,
          garage_id: 1,
          start_time: new Date('2024-01-15T08:00:00Z'),
          end_time: new Date('2024-01-15T17:00:00Z'),
          total_price: '135000.00', // 9 hours * 15000
          status: 'confirmed',
          payment_status: 'paid',
          notes: 'Business meeting parking'
        },
        {
          user_id: 1,
          garage_id: 2,
          start_time: new Date('2024-01-16T10:00:00Z'),
          end_time: new Date('2024-01-16T14:00:00Z'),
          total_price: '48000.00', // 4 hours * 12000
          status: 'pending',
          payment_status: 'unpaid',
          notes: 'Shopping trip'
        }
      ]);
      
      console.log('✅ Sample bookings created successfully');
    } else {
      console.log('ℹ️  Bookings already exist, skipping creation');
    }

    console.log('🎉 Booking database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding booking database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Booking seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Booking seeding failed:', error);
      process.exit(1);
    });
}