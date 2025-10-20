'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Many-to-many relationship with Users through UserRoles
      Role.belongsToMany(models.User, {
        through: 'UserRoles',
        foreignKey: 'roleId',
        otherKey: 'userId',
        as: 'users'
      });
    }
  }

  Role.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      field: 'role_id' // Maps to role_id in database as per ERD
    },
    roleName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: 'role_name', // Maps to role_name in database as per ERD
      validate: {
        notEmpty: true,
        isIn: [['renter', 'owner', 'admin']] // Only allow these predefined roles
      }
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'Roles',
    timestamps: true
  });

  return Role;
};