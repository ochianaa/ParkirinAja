import { db, users, roles, userRoles } from './index';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create roles if they don't exist
    const existingRoles = await db.select().from(roles);
    
    if (existingRoles.length === 0) {
      console.log('📝 Creating roles...');
      await db.insert(roles).values([
        { roleName: 'admin' },
        { roleName: 'owner' },
        { roleName: 'renter' }
      ]);
      console.log('✅ Roles created successfully');
    }

    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@parkirinaja.com'));
    
    if (existingAdmin.length === 0) {
      console.log('👤 Creating admin user...');
      
      // Hash the admin password
      const hashedPassword = await bcrypt.hash('admin123!@#', 10);
      
      // Create admin user
      const [adminUser] = await db.insert(users).values({
        username: 'admin',
        email: 'admin@parkirinaja.com',
        password: hashedPassword,
        phoneNumber: '081234567999',
        address: 'ParkirinAja Headquarters'
      }).returning();

      // Get admin role
      const [adminRole] = await db.select().from(roles).where(eq(roles.roleName, 'admin'));
      
      if (adminRole && adminUser) {
        // Assign admin role to user
        await db.insert(userRoles).values({
          userId: adminUser.id,
          roleId: adminRole.id
        });
        
        console.log('✅ Admin user created successfully');
        console.log('📧 Email: admin@parkirinaja.com');
        console.log('🔑 Password: admin123!@#');
        console.log('⚠️  Please change the admin password after first login!');
      }
    } else {
      console.log('ℹ️  Admin user already exists, skipping creation');
    }

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}