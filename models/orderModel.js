import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "../models/authModel.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // DATA CUSTOMER
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // DATA KENDARAAN
    vehicle_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle_brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle_model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    license_plate: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // LOKASI
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // JENIS SERVIS
    service_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    problem_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // STATUS ORDER
    status: {
      type: DataTypes.ENUM("pending", "accepted", "on_progress", "finished", "cancelled"),
      defaultValue: "pending",
    },   
  },
  {
    tableName: "Orders",
    timestamps: true,
  }
);

export default Order;
