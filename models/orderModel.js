import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Order = sequelize.define(
  "Orders",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    provider_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false },
    vehicle_type: { type: DataTypes.STRING, allowNull: false },
    vehicle_model: { type: DataTypes.STRING, allowNull: false, defaultValue: "Unknown" },
vehicle_brand: { type: DataTypes.STRING, allowNull: false, defaultValue: "Unknown" },
color: { type: DataTypes.STRING, allowNull: false, defaultValue: "Unknown" },
license_plate: { type: DataTypes.STRING, allowNull: false, defaultValue: "N/A" },
    address: { type: DataTypes.STRING, allowNull: false },
    service_type: { type: DataTypes.STRING, allowNull: false },
    problem_description: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM("pending","accepted","on_progress","finished","cancelled"),
      defaultValue: "pending",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Order;
