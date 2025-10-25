import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Garage = sequelize.define("Garage", {
  garage_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT },
  price_per_hour: { type: DataTypes.DECIMAL, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "pending" }, // available, unavailable, pending
}, {
  timestamps: true,
});

export default Garage;
