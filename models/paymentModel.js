import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Payment = db.define(
  "payment",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    mechanic_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { notEmpty: true },
    },

    method: {
      type: DataTypes.ENUM("COD", "Transfer", "E-Wallet"),
      allowNull: false,
      validate: { notEmpty: true },
    },

    transaction_status: {
      type: DataTypes.ENUM("pending", "Success", "failed", "Cancelled"),
      defaultValue: "pending",
      allowNull: false,
    },

    paid_at: { type: DataTypes.DATE, allowNull: true },

    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    // 🔹 Tambahan untuk menampilkan info order langsung pada payment
    order_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    vehicle_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    vehicle_brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 🔥 Tambahan yang tadinya HILANG
    vehicle_model: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    license_plate: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    order_status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Payment;
