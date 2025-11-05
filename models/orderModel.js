import { DataTypes } from "sequelize";
import db from "../config/db.js"; // koneksi Sequelize

const Order = db.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  phone_number: { type: DataTypes.STRING, allowNull: false },
  vehicle_type: { type: DataTypes.STRING, allowNull: false },
  vehicle_brand: { type: DataTypes.STRING, allowNull: false },
  problem_description: { type: DataTypes.TEXT, allowNull: false },
  service_type: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM("pending","in_progress","completed","cancelled"), defaultValue: "pending" },
}, { timestamps: true });

export default Order;
