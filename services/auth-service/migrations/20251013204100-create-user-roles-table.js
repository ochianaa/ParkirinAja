'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRoles', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'role_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add composite primary key and unique constraint
    await queryInterface.addConstraint('UserRoles', {
      fields: ['user_id', 'role_id'],
      type: 'primary key',
      name: 'user_roles_pkey'
    });

    // Add unique constraint to prevent duplicate user-role assignments
    await queryInterface.addConstraint('UserRoles', {
      fields: ['user_id', 'role_id'],
      type: 'unique',
      name: 'user_roles_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserRoles');
  }
};