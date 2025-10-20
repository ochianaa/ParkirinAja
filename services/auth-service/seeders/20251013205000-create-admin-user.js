'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash the admin password
    const hashedPassword = await bcrypt.hash('admin123!@#', 10);

    // First, create the admin user
    const [adminUser] = await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        email: 'admin@parkirinaja.com',
        password: hashedPassword,
        phoneNumber: '081234567999',
        address: 'ParkirinAja Headquarters',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Get the admin role ID
    const adminRole = await queryInterface.sequelize.query(
      "SELECT id FROM Roles WHERE roleName = 'admin'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (adminRole.length > 0) {
      // Assign admin role to the admin user
      await queryInterface.bulkInsert('UserRoles', [
        {
          userId: adminUser.id || 1, // Fallback to 1 if adminUser.id is not available
          roleId: adminRole[0].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@parkirinaja.com');
    console.log('🔑 Password: admin123!@#');
    console.log('⚠️  Please change the admin password after first login!');
  },

  async down(queryInterface, Sequelize) {
    // Remove admin user role assignment
    await queryInterface.bulkDelete('UserRoles', {
      userId: {
        [Sequelize.Op.in]: queryInterface.sequelize.literal(
          "(SELECT id FROM Users WHERE email = 'admin@parkirinaja.com')"
        )
      }
    });

    // Remove admin user
    await queryInterface.bulkDelete('Users', {
      email: 'admin@parkirinaja.com'
    });

    console.log('🗑️  Admin user removed successfully');
  }
};