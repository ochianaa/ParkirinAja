'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // UserRole belongs to User
      UserRole.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // UserRole belongs to Role
      UserRole.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role'
      });
    }
  }

  UserRole.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id', // Maps to user_id in database as per ERD
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'role_id', // Maps to role_id in database as per ERD
      references: {
        model: 'Roles',
        key: 'role_id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'UserRoles',
    timestamps: true,
    // Composite primary key
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'role_id']
      }
    ]
  });

  return UserRole;
};